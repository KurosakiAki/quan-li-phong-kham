import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../../system-log/system-log.module';
import { ChiTietDonThuocController } from './chi-tiet-don-thuoc.controller';
import { ChiTietDonThuoc } from './chi-tiet-don-thuoc.entity';
import { ChiTietDonThuocService } from './chi-tiet-don-thuoc.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChiTietDonThuoc]), SystemLogModule],
  providers: [ChiTietDonThuocService],
  controllers: [ChiTietDonThuocController],
  exports: [ChiTietDonThuocService],
})
export class ChiTietDonThuocModule {}
