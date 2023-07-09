import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../system-log/system-log.service';
import { CreateThuocDto, UpdateThuocDto } from './thuoc.dto';
import { Thuoc } from './thuoc.entity';

@Injectable()
export class ThuocService {
  constructor(
    @InjectRepository(Thuoc) private respository: Repository<Thuoc>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin thuoc theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy danh sách thuoc
   */
  async list() {
    return await this.respository.find();
  }

  /**
   * Thêm mới thuoc
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateThuocDto, updatedUserId: number) {
    try {
      const item = await this.respository.create({
        ...data,
        updatedUser: updatedUserId,
      });
      await item.save();
      this.systemLogService.logChange({
        objectId: item.id,
        objectType: SystemLogObjectTypeEnum.THUOC,
        type: SystemLogTypeEnum.CREATE,
        updatedUserId: updatedUserId,
      });
  
      return item;
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new BadRequestException('Tên thuốc đã tồn tại');
      } else {
        throw new BadRequestException('Có lỗi khi tạo thuốc');
      }
    }
  }

  /**
   * Chỉnh sửa thông tin thuoc
   * @param id Id thuoc
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(id: number, updateData: UpdateThuocDto, updatedUserId: number) {
    const beforeUpdateData = await this.get(id);
    await this.respository.update(id, {
      ...updateData,
      updatedUser: updatedUserId,
    });
    const afterUpdateData = await this.get(id);

    this.systemLogService.logChange({
      before: beforeUpdateData,
      after: afterUpdateData,
      objectId: afterUpdateData.id,
      objectType: SystemLogObjectTypeEnum.THUOC,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  async updateTonKho(id: number, tonKho: number){
    await this.respository.update(id, {
      tonKho: tonKho,
    });
  }

  /**
   * Xóa thuoc
   * @param id Id thuoc
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.THUOC,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
