import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../../system-log/system-log.service';
import {
  CreateChiTietThuocDto,
  UpdateChiTietThuocDto,
} from './chi-tiet-thuoc.dto';
import { ChiTietThuoc } from './chi-tiet-thuoc.entity';

@Injectable()
export class ChiTietThuocService {
  constructor(
    @InjectRepository(ChiTietThuoc)
    private respository: Repository<ChiTietThuoc>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin chi-tiet-thuoc theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy danh sách chi-tiet-thuoc
   */
  async list() {
    return await this.respository.find({
      relations: ['thuoc', 'nhapKhoThuoc']
    });
  }

  /**
   * Lấy danh sách chi-tiet-thuoc by ID
   */
  async listByNhapKhoId(id: number) {
    return await this.respository.find({
      where: { nhapKhoThuocId: id },
      relations: ['thuoc', 'nhapKhoThuoc']
    });
  }

  /**
   * Lấy danh sách chi-tiet-thuoc by ID
   */
  async listByThuocId(id: number) {
    return await this.respository.find({
      where: { thuocId: id },
      relations: ['thuoc', 'nhapKhoThuoc']
    });
  }

  /**
   * Lấy danh sách chi-tiet-thuoc by ID
   */
  async listDaKiemDinh() {
    return await this.respository.find({
      where: { trangThai: 'Đã thanh toán' },
      relations: ['thuoc', 'nhapKhoThuoc']
    });
  }

  /**
   * Lấy danh sách chi-tiet-thuoc by ID
   */
  async listDaKiemDinhByThuocId(id: number) {
    const item = await this.respository.find({
      where: { trangThai: 'Đã thanh toán', thuocId: id },
      relations: ['thuoc', 'nhapKhoThuoc']
    });
    return item;
  }

  /**
   * Thêm mới chi-tiet-thuoc
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateChiTietThuocDto, updatedUserId: number) {
    const item = await this.respository.create({
      ...data,
      updatedUser: updatedUserId,
    });
    await item.save();
    this.systemLogService.logChange({
      objectId: item.id,
      objectType: SystemLogObjectTypeEnum.CHI_TIET_THUOC,
      type: SystemLogTypeEnum.CREATE,
      updatedUserId: updatedUserId,
    });

    return item;
  }

  /**
   * Chỉnh sửa thông tin chi-tiet-thuoc
   * @param id Id chi-tiet-thuoc
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdateChiTietThuocDto,
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
      objectType: SystemLogObjectTypeEnum.CHI_TIET_THUOC,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  async updateTrangThai(id: number, trangThai: string){
    await this.respository.update(id, {
      trangThai: trangThai
    });
  }

  /**
   * Xóa chi-tiet-thuoc
   * @param id Id chi-tiet-thuoc
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.CHI_TIET_THUOC,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
