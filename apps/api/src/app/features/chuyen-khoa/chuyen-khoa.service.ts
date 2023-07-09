import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../system-log/system-log.service';
import { CreateChuyenKhoaDto, UpdateChuyenKhoaDto } from './chuyen-khoa.dto';
import { ChuyenKhoa } from './chuyen-khoa.entity';

@Injectable()
export class ChuyenKhoaService {
  constructor(
    @InjectRepository(ChuyenKhoa) private respository: Repository<ChuyenKhoa>,
    private systemLogService: SystemLogService
  ) {}

  /**
   * Lấy thông tin chuyen-khoa theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id } });
  }

  /**
   * Lấy danh sách chuyen-khoa
   */
  async list() {
    return await this.respository.find();
  }

  /**
   * Thêm mới chuyen-khoa
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateChuyenKhoaDto, updatedUserId: number) {
    try {
      const item = await this.respository.create({
        ...data,
        updatedUser: updatedUserId,
      });
      await item.save();
      this.systemLogService.logChange({
        objectId: item.id,
        objectType: SystemLogObjectTypeEnum.CHUYEN_KHOA,
        type: SystemLogTypeEnum.CREATE,
        updatedUserId: updatedUserId,
      });
  
      return item;
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new BadRequestException('Tên chuyên khoa đã tồn tại');
      } else {
        throw new BadRequestException('Có lỗi khi tạo chuyên khoa');
      }
    }
  }

  /**
   * Chỉnh sửa thông tin chuyen-khoa
   * @param id Id chuyen-khoa
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdateChuyenKhoaDto,
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
   * Xóa chuyen-khoa
   * @param id Id chuyen-khoa
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
