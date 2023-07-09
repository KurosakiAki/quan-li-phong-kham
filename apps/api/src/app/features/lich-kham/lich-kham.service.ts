import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { SystemLogService } from '../system-log/system-log.service';
import { CreateLichKhamDto, UpdateLichKhamDto } from './lich-kham.dto';
import { LichKham } from './lich-kham.entity';
import { SendEmailDto } from '../../common/services/send-email/send-email.dto';
import { configService } from 'apps/api/src/config/config.service';
import { SendEmailService } from '../../common/services/send-email/send-email.service';
import { ChuyenKhoaService } from '../chuyen-khoa/chuyen-khoa.service';
import { format } from 'date-fns';
@Injectable()
export class LichKhamService {
  constructor(
    @InjectRepository(LichKham) private respository: Repository<LichKham>,
    private systemLogService: SystemLogService,
    private sendEmailService: SendEmailService,
    private chuyenKhoaService: ChuyenKhoaService
  ) {}

  /**
   * Lấy thông tin lich-kham theo ID
   * @param id
   */
  async get(id: number) {
    return await this.respository.findOne({ where: { id }, relations: ['bacSi', 'khachHang'] });
  }

  /**
   * Lấy danh sách lich-kham
   */
  async list(bacSiId?: any, khachHangId?: any) {
    if(bacSiId){
      return await this.respository.find({
        where: { bacSiId: bacSiId },
        relations: ['bacSi', 'khachHang'],
      });
    }
    if(khachHangId){
      return await this.respository.find({
        where: { khachHangId: khachHangId },
        relations: ['bacSi', 'khachHang'],
      });
    }
    else 
      return await this.respository.find({
        relations: ['bacSi', 'khachHang'],
      });
  }

  /**
   * Lấy danh sách lich-kham để đăng ký theo bac-si
   */
  async listDangKyByBacSi(bacSiId: number) {
    return await this.respository.find(
      { where: { bacSiId: bacSiId, trangThai: Not(In(['Chờ xác nhận', 'Hủy bỏ'])) },
        relations: ['bacSi'] 
      });
  }

  /**
   * Thêm mới lich-kham
   * @param data
   * @param updatedUserId
   * @returns
   */
  async create(data: CreateLichKhamDto) {
    try {
      const item = this.respository.create(data);
      return await item.save();
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new BadRequestException('Thời gian khám này đã có người đặt');
      } else {
        throw new BadRequestException('Có lỗi khi tạo lịch khám');
      }
    }
  }

  /**
   * Chỉnh sửa thông tin lich-kham
   * @param id Id lich-kham
   * @param updateData Dự liệu update
   * @param updatedUserId Id của user update
   */
  async update(
    id: number,
    updateData: UpdateLichKhamDto,
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
      objectType: SystemLogObjectTypeEnum.LICH_KHAM,
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
   * Xóa lich-kham
   * @param id Id lich-kham
   * @param deletedUserId Id của user thực hiện thao tác xóa
   */
  async remove(id: number, deletedUserId: number) {
    await this.respository.update(id, {
      deletedUser: deletedUserId,
    });

    this.systemLogService.logChange({
      objectId: id,
      objectType: SystemLogObjectTypeEnum.LICH_KHAM,
      type: SystemLogTypeEnum.DELETE,
      updatedUserId: deletedUserId,
    });

    return await this.respository.softDelete(id);
  }

  async confirmLichKham(lichKham: any){
    lichKham = {
      ...lichKham,
      thoiGianKham: format(lichKham.thoiGianKham, 'hh:mm dd/MM/yyyy'),
      chuyenKhoa: await this.chuyenKhoaService.get(lichKham.bacSi.specialistId)
    }
    this._sendConfirmEmail(lichKham.email, '', lichKham);
    return true;
  }

  _sendConfirmEmail(
    toEmails: string | string[],
    ccEmails: string | string[],
    data: any,
  ) {
    const webUrl = configService.getWebUrl();
    const mailData = new SendEmailDto();
    mailData.to = toEmails;
    mailData.cc = ccEmails;
    mailData.subject = `[${configService.getValue(
      'APP_NAME',
      true,
    )}] Confirm appointment/Xác nhận lịch khám`;
    mailData.template = 'confirm-email';
    mailData.context = {
      data,
      webUrl,
    };

    //Email xác nhận này chứa thông tin về ngày, giờ khám, chuyên khoa và tên bác sĩ đã được đặt.

    this.sendEmailService.send(mailData);
  }
}
