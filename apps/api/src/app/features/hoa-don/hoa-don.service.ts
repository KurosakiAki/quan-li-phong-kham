import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../system-log/system-log.service';
import { CreateHoaDonDto, UpdateHoaDonDto } from './hoa-don.dto';
import { HoaDon } from './hoa-don.entity';

@Injectable()
export class HoaDonService {
  constructor(
    @InjectRepository(HoaDon) private respository: Repository<HoaDon>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin hoa-don theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({
      where: { id },
      relations: ['khachHang'] 
    });
  }

  /**
   * Lấy thông tin DON-THUOC theo maDonThuoc
   * @param id
   */
  async getByMaHoaDon(id: string) {
    return await this.respository.findOne({ 
      where: { maHoaDon: id },
      relations: ['khachHang']
    });
  }

  /**
   * Lấy danh sách hoa-don
   */
  async list(khachHangId?: number) {
    if(khachHangId){
      return await this.respository.find({
        where: { khachHangId: khachHangId },
        relations: ['khachHang'],
      });
    }
    else 
      return await this.respository.find({
        relations: ['khachHang'],
      });
  }

  /**
   * Thêm mới hoa-don
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateHoaDonDto, updatedUserId: number, maHoaDon: string) {
    const item = await this.respository.create({
      ...data,
      maHoaDon: maHoaDon,
      updatedUser: updatedUserId,
    });
    await item.save();
    this.systemLogService.logChange({
      objectId: item.id,
      objectType: SystemLogObjectTypeEnum.HOA_DON,
      type: SystemLogTypeEnum.CREATE,
      updatedUserId: updatedUserId,
    });

    return item;
  }

  /**
   * Chỉnh sửa thông tin hoa-don
   * @param id Id hoa-don
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(id: number, updateData: UpdateHoaDonDto, updatedUserId: number) {
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
      objectType: SystemLogObjectTypeEnum.HOA_DON,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  /**
   * Xóa hoa-don
   * @param id Id hoa-don
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.HOA_DON,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
