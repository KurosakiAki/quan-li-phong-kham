import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { PhieuDichVuController } from './phieu-dich-vu.controller';
import { PhieuDichVu } from './phieu-dich-vu.entity';
import { PhieuDichVuService } from './phieu-dich-vu.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhieuDichVu]), SystemLogModule],
  providers: [PhieuDichVuService],
  controllers: [PhieuDichVuController],
  exports: [PhieuDichVuService],
})
export class PhieuDichVuModule {}
