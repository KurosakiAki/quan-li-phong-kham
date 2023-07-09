import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../../system-log/system-log.service';
import {
  CreateChiTietDonThuocDto,
  UpdateChiTietDonThuocDto,
} from './chi-tiet-don-thuoc.dto';
import { ChiTietDonThuoc } from './chi-tiet-don-thuoc.entity';

@Injectable()
export class ChiTietDonThuocService {
  constructor(
    @InjectRepository(ChiTietDonThuoc)
    private respository: Repository<ChiTietDonThuoc>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin chi-tiet-don-thuoc theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy danh sách chi-tiet-don-thuoc
   */
  async list(donThuocId?: any) {
    if(donThuocId){
      return await this.respository.find({
        where: { donThuocId: donThuocId },
        relations: ['thuoc'],
      });
    }
    else 
      return await this.respository.find({
        relations: ['thuoc'],
      });
  }

  /**
   * Lấy danh sách chi-tiet-thuoc by ID
   */
  async listByDonThuocId(id: number) {
    return await this.respository.find({
      where: { donThuocId: id },
      relations: ['thuoc', 'donThuoc']
    });
  }

  /**
   * Thêm mới chi-tiet-don-thuoc
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateChiTietDonThuocDto, updatedUserId: number) {
    const item = await this.respository.create({
      ...data,
      updatedUser: updatedUserId,
    });
    await item.save();
    this.systemLogService.logChange({
      objectId: item.id,
      objectType: SystemLogObjectTypeEnum.CHI_TIET_DON_THUOC,
      type: SystemLogTypeEnum.CREATE,
      updatedUserId: updatedUserId,
    });

    return item;
  }

  /**
   * Chỉnh sửa thông tin chi-tiet-don-thuoc
   * @param id Id chi-tiet-don-thuoc
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdateChiTietDonThuocDto,
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
      objectType: SystemLogObjectTypeEnum.CHI_TIET_DON_THUOC,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  /**
   * Xóa chi-tiet-don-thuoc
   * @param id Id chi-tiet-don-thuoc
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.CHI_TIET_DON_THUOC,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
