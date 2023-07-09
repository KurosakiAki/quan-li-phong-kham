import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../system-log/system-log.service';
import { CreateAdminDto, UpdateAdminDto } from './admin.dto';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private respository: Repository<Admin>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin admin theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  async getByReferenceId(id: string) {
    return await this.respository.findOne({ where: { referenceId: id } });
  }

  /**
   * Lấy danh sách admin
   */
  async list() {
    return await this.respository.find();
  }

  /**
   * Thêm mới admin
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateAdminDto, updatedUserId: number, referenceId: string) {
    const item = await this.respository.create({
      ...data,
      referenceId: referenceId,
      updatedUser: updatedUserId,
    });
    await item.save();
    this.systemLogService.logChange({
      objectId: item.id,
      objectType: SystemLogObjectTypeEnum.USER,
      type: SystemLogTypeEnum.CREATE,
      updatedUserId: updatedUserId,
    });

    return item;
  }

  /**
   * Chỉnh sửa thông tin admin
   * @param id Id admin
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(id: number, updateData: UpdateAdminDto, updatedUserId: number) {
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
      objectType: SystemLogObjectTypeEnum.USER,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  /**
   * Xóa admin
   * @param id Id admin
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async deleteUser(id: number) {
    return await this.respository.delete(id);
  }
}
