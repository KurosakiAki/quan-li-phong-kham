import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../../system-log/system-log.service';
import {
  CreateNhapKhoThuocDto,
  UpdateNhapKhoThuocDto,
} from './nhap-kho-thuoc.dto';
import { NhapKhoThuoc } from './nhap-kho-thuoc.entity';

@Injectable()
export class NhapKhoThuocService {
  constructor(
    @InjectRepository(NhapKhoThuoc)
    private respository: Repository<NhapKhoThuoc>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin nhap-kho-thuoc theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id },
      relations: ['nhaCungCap'] });
  }

  /**
   * Lấy thông tin DON-THUOC theo maDonThuoc
   * @param id
   */
  async getByMaNhapKho(id: string) {
    return await this.respository.findOne({ where: { maNhapKho: id } });
  }

  /**
   * Lấy danh sách nhap-kho-thuoc
   */
  async list() {
    return await this.respository.find({
      relations: ['nhaCungCap']
    });
  }

  /**
   * Thêm mới nhap-kho-thuoc
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateNhapKhoThuocDto, updatedUserId: number, maNhapKho: string) {
    const item = await this.respository.create({
      ...data,
      maNhapKho: maNhapKho,
      updatedUser: updatedUserId,
    });
    await item.save();
    this.systemLogService.logChange({
      objectId: item.id,
      objectType: SystemLogObjectTypeEnum.NHAP_KHO_THUOC,
      type: SystemLogTypeEnum.CREATE,
      updatedUserId: updatedUserId,
    });

    return item;
  }

  /**
   * Chỉnh sửa thông tin nhap-kho-thuoc
   * @param id Id nhap-kho-thuoc
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdateNhapKhoThuocDto,
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
      objectType: SystemLogObjectTypeEnum.NHAP_KHO_THUOC,
      type: SystemLogTypeEnum.UPDATE,
      updatedUserId: updatedUserId,
    });

    return afterUpdateData;
  }

  /**
   * Xóa nhap-kho-thuoc
   * @param id Id nhap-kho-thuoc
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.NHAP_KHO_THUOC,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }
}
