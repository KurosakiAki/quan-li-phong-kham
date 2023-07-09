import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BackupService } from '../backup/backup.service';
import { ChiTietThuocService } from '../features/thuoc/chi-tiet-thuoc/chi-tiet-thuoc.service';
import { LichKhamService } from '../features/lich-kham/lich-kham.service';
import { ThuocService } from '../features/thuoc/thuoc.service';


@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private chiTietThuocService: ChiTietThuocService,
    private thuocService: ThuocService,
    private lichKhamService: LichKhamService,
    private backupService: BackupService,
  ) { }


  // @Cron(CronExpression.EVERY_DAY_AT_1AM, { timeZone: 'Asia/Ho_Chi_Minh' })
  // async backupDatabase() {
  //   this.backupService.backupDatabase()
  // }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { timeZone: 'Asia/Ho_Chi_Minh' })
  async handleCron() {
    const listChiTietThuoc = await this.chiTietThuocService.listDaKiemDinh();
    const current = new Date();
    current.setHours(0,0,0,0);

    for (let item of listChiTietThuoc){
      item.ngayHetHan.setHours(0,0,0,0);
      if (item.ngayHetHan < current){
        this.chiTietThuocService.updateTrangThai(item.id, 'Quá hạn');
        const tonKho = item.thuoc?.tonKho - item.soLuongConLai;
        this.thuocService.updateTonKho(item.thuocId, tonKho)
      }
    }

    const listLichKham = await this.lichKhamService.list();

    for (let item of listLichKham){
      if ((item.trangThai != 'Hủy bỏ') && (item.trangThai != 'Đã khám')){
        if (item.thoiGianKham <= current){
          this.lichKhamService.updateTrangThai(item.id, 'Quá hạn')
        }
      }
    }
  }
}
