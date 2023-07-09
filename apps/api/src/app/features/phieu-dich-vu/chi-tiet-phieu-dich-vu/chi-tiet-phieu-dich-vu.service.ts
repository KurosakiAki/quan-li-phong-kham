import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../../system-log/system-log.service';
import {
  CreateChiTietPhieuDichVuDto,
  UpdateChiTietPhieuDichVuDto,
} from './chi-tiet-phieu-dich-vu.dto';
import { ChiTietPhieuDichVu } from './chi-tiet-phieu-dich-vu.entity';

@Injectable()
export class ChiTietPhieuDichVuService {
  constructor(
    @InjectRepository(ChiTietPhieuDichVu)
    private respository: Repository<ChiTietPhieuDichVu>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin chi-tiet-phieu-dich-vu theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy danh sách chi-tiet-phieu-dich-vu
   */
  async list(phieuDichVuId?: any) {
    if(phieuDichVuId){
      return await this.respository.find({
        where: { phieuDichVuId: phieuDichVuId },
        relations: ['dichVu'],
      });
    }
    else 
      return await this.respository.find({
        relations: ['dichVu'],
      });
  }

  /**
   * Lấy danh sách chi-tiet-thuoc by ID
   */
  async listByPhieuDichVuId(id: number) {
    return await this.respository.find({
      where: { phieuDichVuId: id },
      relations: ['phieuDichVu', 'dichVu']
    });
  }

  /**
   * Thêm mới chi-tiet-phieu-dich-vu
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateChiTietPhieuDichVuDto, updatedUserId: number) {
    const item = await this.respository.create({
      ...data,
      updatedUser: updatedUserId,
    });
    await item.save();
    this.systemLogService.logChange({
      objectId: item.id,
      objectType: SystemLogObjectTypeEnum.CHI_TIET_PHIEU_DICH_VU,
      type: SystemLogTypeEnum.CREATE,
      updatedUserId: updatedUserId,
    });

    return item;
  }

  /**
   * Chỉnh sửa thông tin chi-tiet-phieu-dich-vu
   * @param id Id chi-tiet-phieu-dich-vu
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdateChiTietPhieuDichVuDto,
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
      objectType: SystemLogObjectTypeEnum.CHI_TIET_PHIEU_DICH_VU,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  /**
   * Xóa chi-tiet-phieu-dich-vu
   * @param id Id chi-tiet-phieu-dich-vu
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.CHI_TIET_PHIEU_DICH_VU,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
