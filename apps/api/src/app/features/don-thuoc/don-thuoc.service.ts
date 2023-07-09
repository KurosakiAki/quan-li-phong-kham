import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../system-log/system-log.service';
import { CreateDonThuocDto, UpdateDonThuocDto } from './don-thuoc.dto';
import { DonThuoc } from './don-thuoc.entity';

@Injectable()
export class DonThuocService {
  constructor(
    @InjectRepository(DonThuoc) private respository: Repository<DonThuoc>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin don-thuoc theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy thông tin don-thuoc theo ID
   * @param id
   */
  async getByLichKhamId(id: number) {
    return await this.respository.findOne({ where: { lichKhamId: id } });
  }

  /**
   * Lấy thông tin don-thuoc theo ID
   * @param id
   */
  async getByMaHoaDon(maHoaDon: string) {
    const item = await this.respository.findOne({ where: { maHoaDon: maHoaDon } });
    return item;
  }

  /**
   * Lấy thông tin DON-THUOC theo maDonThuoc
   * @param id
   */
  async getByMaDonThuoc(id: string) {
    return await this.respository.findOne({ where: { maDonThuoc: id } });
  }

  /**
   * Lấy danh sách don-thuoc
   */
  async list() {
    return await this.respository.find({
      relations: ['lichKham']
    });
  }

  /**
   * Thêm mới don-thuoc
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateDonThuocDto, updatedUserId: number, maDonThuoc: string) {
    const item = await this.respository.create({
      ...data,
      maDonThuoc: maDonThuoc,
      updatedUser: updatedUserId,
    });
    await item.save();
    this.systemLogService.logChange({
      objectId: item.id,
      objectType: SystemLogObjectTypeEnum.DON_THUOC,
      type: SystemLogTypeEnum.CREATE,
      updatedUserId: updatedUserId,
    });

    return item;
  }

  /**
   * Chỉnh sửa thông tin don-thuoc
   * @param id Id don-thuoc
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdateDonThuocDto,
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
      objectType: SystemLogObjectTypeEnum.DON_THUOC,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  /**
   * Xóa don-thuoc
   * @param id Id don-thuoc
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.DON_THUOC,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
