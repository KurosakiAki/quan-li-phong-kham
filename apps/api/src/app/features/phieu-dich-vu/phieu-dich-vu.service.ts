import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../system-log/system-log.service';
import {
  CreatePhieuDichVuDto,
  UpdatePhieuDichVuDto,
} from './phieu-dich-vu.dto';
import { PhieuDichVu } from './phieu-dich-vu.entity';

@Injectable()
export class PhieuDichVuService {
  constructor(
    @InjectRepository(PhieuDichVu) private respository: Repository<PhieuDichVu>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin phieu-dich-vu theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy thông tin DON-THUOC theo maDonThuoc
   * @param id
   */
  async getByMaPhieuDichVu(id: string) {
    return await this.respository.findOne({ where: { maPhieuDichVu: id } });
  }

  /**
   * Lấy thông tin don-thuoc theo ID
   * @param id
   */
  async getByMaHoaDon(maHoaDon: string) {
    return await this.respository.findOne({ where: { maHoaDon: maHoaDon } });
  }

  /**
   * Lấy danh sách phieu-dich-vu
   */
  async list(lichKhamId?: any) {
    if(lichKhamId){
      return await this.respository.find({
        where: { lichKhamId: lichKhamId },
        relations: ['lichKham'],
      });
    }
    else 
      return await this.respository.find({
        relations: ['lichKham'],
      });
  }

  /**
   * Thêm mới phieu-dich-vu
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreatePhieuDichVuDto, updatedUserId: number, maPhieuDichVu: string) {
    const item = await this.respository.create({
      ...data,
      maPhieuDichVu: maPhieuDichVu,
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
   * Chỉnh sửa thông tin phieu-dich-vu
   * @param id Id phieu-dich-vu
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdatePhieuDichVuDto,
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
   * Xóa phieu-dich-vu
   * @param id Id phieu-dich-vu
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
