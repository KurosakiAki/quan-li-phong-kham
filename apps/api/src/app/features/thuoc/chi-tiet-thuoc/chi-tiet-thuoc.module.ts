import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../../system-log/system-log.module';
import { ChiTietThuocController } from './chi-tiet-thuoc.controller';
import { ChiTietThuoc } from './chi-tiet-thuoc.entity';
import { ChiTietThuocService } from './chi-tiet-thuoc.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChiTietThuoc]), SystemLogModule],
  providers: [ChiTietThuocService],
  controllers: [ChiTietThuocController],
  exports: [ChiTietThuocService],
})
export class ChiTietThuocModule {}
