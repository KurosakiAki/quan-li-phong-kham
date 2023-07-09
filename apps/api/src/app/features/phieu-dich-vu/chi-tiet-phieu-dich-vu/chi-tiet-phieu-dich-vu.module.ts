import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../../system-log/system-log.module';
import { ChiTietPhieuDichVuController } from './chi-tiet-phieu-dich-vu.controller';
import { ChiTietPhieuDichVu } from './chi-tiet-phieu-dich-vu.entity';
import { ChiTietPhieuDichVuService } from './chi-tiet-phieu-dich-vu.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChiTietPhieuDichVu]), SystemLogModule],
  providers: [ChiTietPhieuDichVuService],
  controllers: [ChiTietPhieuDichVuController],
  exports: [ChiTietPhieuDichVuService],
})
export class ChiTietPhieuDichVuModule {}
