import { ISystemLogChangeData, SystemLogObjectTypeEnum, SystemLogTypeEnum } from "@api-interfaces";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NoteService } from "../note/note.service";
import { SystemLogDto } from "./system-log.dto";
import { SystemLog } from "./system-log.entity";
import { Admin } from "../admin/admin.entity";
import { BacSi } from "../bac-si/bac-si.entity";
import { KhachHang } from "../khach-hang/khach-hang.entity";
import { NhanVien } from "../nhan-vien/nhan-vien.entity";


@Injectable()
export class SystemLogService {
  constructor(
    @InjectRepository(SystemLog) private systemLogRepository: Repository<SystemLog>,
    private noteService: NoteService
  ) { }

  /**
   * Add new log
   * @param data
   * @param updateById
   * @returns
   */
  private async add(data: SystemLogDto, updateById: number) {
    const newLog = await this.systemLogRepository.create({
      ...data,
      updatedUserId: updateById
    });
    return await newLog.save();
  }

  /**
   * List all logs
   * @returns
   */
  async list() {
    const logs = await this.systemLogRepository.find({
      relations: ['updatedUser'],
      order: {
        id: 'DESC'
      }
    });

    return logs;
  }

  /**
   * List all logs of an Object
   * @returns
   */
  async listByObject(object: {objectType: SystemLogObjectTypeEnum, objectId: number}) {
    // const logs = await this.systemLogRepository.find({
    //   where: object,
    //   relations: ['updatedUser'],
    //   order: {
    //     id: 'DESC'
    //   }
    // });

    const logs = await this.systemLogRepository.createQueryBuilder('systemLog')
    .leftJoin(Admin, 'admin', 'admin.userId = systemLog.updatedUserId')
    .leftJoin(BacSi, 'bacSi', 'bacSi.userId = systemLog.updatedUserId')
    .leftJoin(NhanVien, 'nhanVien', 'nhanVien.userId = systemLog.updatedUserId')
    .leftJoin(KhachHang, 'khachHang', 'khachHang.userId = systemLog.updatedUserId')
    .select([
      'systemLog.*',
      'COALESCE(bacSi.fullname, admin.fullname, nhanVien.fullname, khachHang.fullname) AS updatedUserName',
    ])
    .where(object).orderBy({id: 'DESC'})
    .getRawMany();

    logs.forEach(item => {
      item.changeData = JSON.parse(item.changeData);
    })

    return logs;
  }

  /**
   * Compare change value between before and after
   * @param before
   * @param after
   * @param ignore Fields that ignored to compare
   */
  compareChange(before: any, after: any, ignore: string[] = []) {
    const ignoreList = [...ignore, 'createdAt', 'updatedAt', 'updatedUser', 'deletedUser', 'dletedAt'];
    const change: ISystemLogChangeData[] = [];
    for (const key in before) {
      if (!ignoreList.includes(key)) {
        if (before[key]?.toISOString) {
          before[key] = before[key].toISOString();
          after[key] = after[key].toISOString();
        }
        if (before[key] !== after[key]) {
          change.push({
            field: key,
            oldValue: before[key],
            newValue: after[key]
          })
        }
      }
    }
    return change;
  }

  async logChange(
    data: {
      before?: any,
      after?: any,
      objectType: SystemLogObjectTypeEnum,
      objectId: number,
      type: SystemLogTypeEnum,
      updatedUserId: number,
      note?: string
    },
    ignoredFields: string[] = []
  ) {
    let log: SystemLog;

    if (data.type === SystemLogTypeEnum.UPDATE) {
      const change = this.compareChange(data.before, data.after, ignoredFields);
      if (change.length) {
        log = await this.add({
          objectType: data.objectType,
          objectId: data.objectId,
          type: data.type,
          changeData: change,
          createdAt: new Date()
        }, data.updatedUserId);
      }
    } else {
      log = await this.add({
        objectType: data.objectType,
        objectId: data.objectId,
        type: data.type,
        changeData: [],
        createdAt: new Date()
      }, data.updatedUserId);
    }

    if (data.note) {
      if (log) {
        const note = await this.noteService.create({content: data.note});
        log.note = note;
        await log.save();
      }
    }
  }

}
