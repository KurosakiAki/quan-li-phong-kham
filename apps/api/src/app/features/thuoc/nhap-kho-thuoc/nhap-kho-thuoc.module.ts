import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../../system-log/system-log.module';
import { NhapKhoThuocController } from './nhap-kho-thuoc.controller';
import { NhapKhoThuoc } from './nhap-kho-thuoc.entity';
import { NhapKhoThuocService } from './nhap-kho-thuoc.service';

@Module({
  imports: [TypeOrmModule.forFeature([NhapKhoThuoc]), SystemLogModule],
  providers: [NhapKhoThuocService],
  controllers: [NhapKhoThuocController],
  exports: [NhapKhoThuocService],
})
export class NhapKhoThuocModule {}
