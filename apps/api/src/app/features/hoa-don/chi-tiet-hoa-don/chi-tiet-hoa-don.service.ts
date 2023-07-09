import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../../system-log/system-log.service';
import {
  CreateChiTietHoaDonDto,
  UpdateChiTietHoaDonDto,
} from './chi-tiet-hoa-don.dto';
import { ChiTietHoaDon } from './chi-tiet-hoa-don.entity';

@Injectable()
export class ChiTietHoaDonService {
  constructor(
    @InjectRepository(ChiTietHoaDon)
    private respository: Repository<ChiTietHoaDon>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin chi-tiet-hoa-don theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy danh sách chi-tiet-hoa-don
   */
  async list() {
    return await this.respository.find({
      relations: ['thuoc', 'dichVu', 'hoaDon']
    });
  }

  /**
   * Lấy danh sách chi-tiet-thuoc by ID
   */
  async listByHoaDonId(id: number) {
    return await this.respository.find({
      where: { hoaDonId: id },
      relations: ['thuoc', 'dichVu', 'hoaDon']
    });
  }

  /**
   * Thêm mới chi-tiet-hoa-don
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateChiTietHoaDonDto, updatedUserId: number) {
    const item = await this.respository.create({
      ...data,
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
   * Chỉnh sửa thông tin chi-tiet-hoa-don
   * @param id Id chi-tiet-hoa-don
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdateChiTietHoaDonDto,
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
      objectType: SystemLogObjectTypeEnum.USER,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  /**
   * Xóa chi-tiet-hoa-don
   * @param id Id chi-tiet-hoa-don
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.USER,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
