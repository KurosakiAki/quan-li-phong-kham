import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../system-log/system-log.service';
import { CreateNhaCungCapDto, UpdateNhaCungCapDto } from './nha-cung-cap.dto';
import { NhaCungCap } from './nha-cung-cap.entity';

@Injectable()
export class NhaCungCapService {
  constructor(
    @InjectRepository(NhaCungCap) private respository: Repository<NhaCungCap>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin nha-cung-cap theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy danh sách nha-cung-cap
   */
  async list() {
    return await this.respository.find();
  }

  /**
   * Thêm mới nha-cung-cap
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateNhaCungCapDto, updatedUserId: number) {
    try {
      const item = await this.respository.create({
        ...data,
        updatedUser: updatedUserId,
      });
      await item.save();
      this.systemLogService.logChange({
        objectId: item.id,
        objectType: SystemLogObjectTypeEnum.NHA_CUNG_CAP,
        type: SystemLogTypeEnum.CREATE,
        updatedUserId: updatedUserId,
      });
  
      return item;
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new BadRequestException('Tên nhà cung cấp đã tồn tại');
      } else {
        throw new BadRequestException('Có lỗi khi thêm nhà cung cấp');
      }
    }
  }

  /**
   * Chỉnh sửa thông tin nha-cung-cap
   * @param id Id nha-cung-cap
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdateNhaCungCapDto,
    updatedUserId: number
  ) {
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
      objectType: SystemLogObjectTypeEnum.NHA_CUNG_CAP,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  /**
   * Xóa nha-cung-cap
   * @param id Id nha-cung-cap
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.NHA_CUNG_CAP,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
