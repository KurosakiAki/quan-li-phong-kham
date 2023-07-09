import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/config.service';

import { AppController } from './app.controller';
import { CronModule } from './cron/cron.module';
import { AuthModule } from './features/auth/auth.module';
import { LichKhamModule } from './features/lich-kham/lich-kham.module';
import { SystemLogModule } from './features/system-log/system-log.module';
import { UserModule } from './features/user/user.module';
import { BacSiModule } from './features/bac-si/bac-si.module';
import { KhachHangModule } from './features/khach-hang/khach-hang.module';
import { NhanVienModule } from './features/nhan-vien/nhan-vien.module';
import { ChuyenKhoaModule } from './features/chuyen-khoa/chuyen-khoa.module';
import { AdminModule } from './features/admin/admin.module';
import { ThuocModule } from './features/thuoc/thuoc.module';
import { NhapKhoThuocModule } from './features/thuoc/nhap-kho-thuoc/nhap-kho-thuoc.module';
import { PhieuDichVuModule } from './features/phieu-dich-vu/phieu-dich-vu.module';
import { DichVuModule } from './features/dich-vu/dich-vu.module';
import { NhaCungCapModule } from './features/nha-cung-cap/nha-cung-cap.module';
import { HoaDonModule } from './features/hoa-don/hoa-don.module';
import { DonThuocModule } from './features/don-thuoc/don-thuoc.module';
import { ChiTietDonThuocModule } from './features/don-thuoc/chi-tiet-don-thuoc/chi-tiet-don-thuoc.module';
import { ChiTietPhieuDichVuModule } from './features/phieu-dich-vu/chi-tiet-phieu-dich-vu/chi-tiet-phieu-dich-vu.module';
import { ChiTietThuocModule } from './features/thuoc/chi-tiet-thuoc/chi-tiet-thuoc.module';
import { ChiTietHoaDonModule } from './features/hoa-don/chi-tiet-hoa-don/chi-tiet-hoa-don.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    BullModule.forRoot({
      redis: {
        host: configService.getValue('REDIS_HOST', true),
        port: Number(configService.getValue('REDIS_PORT', true)),
      },
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    CronModule,
    SystemLogModule,
    LichKhamModule,
    AdminModule,
    BacSiModule,
    KhachHangModule,
    NhanVienModule,
    ChuyenKhoaModule,
    ThuocModule,
    ChiTietThuocModule,
    NhapKhoThuocModule,
    PhieuDichVuModule,
    DichVuModule,
    NhaCungCapModule,
    HoaDonModule,
    DonThuocModule,
    ChiTietDonThuocModule,
    ChiTietPhieuDichVuModule,
    ChiTietHoaDonModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
