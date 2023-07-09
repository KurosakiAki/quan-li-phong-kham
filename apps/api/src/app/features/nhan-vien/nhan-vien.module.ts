import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { NhanVienController } from './nhan-vien.controller';
import { NhanVien } from './nhan-vien.entity';
import { NhanVienService } from './nhan-vien.service';

@Module({
  imports: [TypeOrmModule.forFeature([NhanVien]), SystemLogModule],
  providers: [NhanVienService],
  controllers: [NhanVienController],
  exports: [NhanVienService],
})
export class NhanVienModule {}
