import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../system-log/system-log.service';
import { CreateDichVuDto, UpdateDichVuDto } from './dich-vu.dto';
import { DichVu } from './dich-vu.entity';

@Injectable()
export class DichVuService {
  constructor(
    @InjectRepository(DichVu) private respository: Repository<DichVu>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin dich-vu theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy danh sách dich-vu
   */
  async list() {
    return await this.respository.find();
  }

  /**
   * Thêm mới dich-vu
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateDichVuDto, updatedUserId: number) {
    try {
      const item = await this.respository.create({
        ...data,
        updatedUser: updatedUserId,
      });
      await item.save();
      this.systemLogService.logChange({
        objectId: item.id,
        objectType: SystemLogObjectTypeEnum.DICH_VU,
        type: SystemLogTypeEnum.CREATE,
        updatedUserId: updatedUserId,
      });
  
      return item;
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new BadRequestException('Tên dịch vụ đã tồn tại');
      } else {
        throw new BadRequestException('Có lỗi khi tạo dịch vụ');
      }
    }
  }

  /**
   * Chỉnh sửa thông tin dich-vu
   * @param id Id dich-vu
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(id: number, updateData: UpdateDichVuDto, updatedUserId: number) {
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
      objectType: SystemLogObjectTypeEnum.DICH_VU,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  /**
   * Xóa dich-vu
   * @param id Id dich-vu
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.DICH_VU,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
