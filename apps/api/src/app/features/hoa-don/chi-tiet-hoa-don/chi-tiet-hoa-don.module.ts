import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../../system-log/system-log.module';
import { ChiTietHoaDonController } from './chi-tiet-hoa-don.controller';
import { ChiTietHoaDon } from './chi-tiet-hoa-don.entity';
import { ChiTietHoaDonService } from './chi-tiet-hoa-don.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChiTietHoaDon]), SystemLogModule],
  providers: [ChiTietHoaDonService],
  controllers: [ChiTietHoaDonController],
  exports: [ChiTietHoaDonService],
})
export class ChiTietHoaDonModule {}
