import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { KhachHangController } from './khach-hang.controller';
import { KhachHang } from './khach-hang.entity';
import { KhachHangService } from './khach-hang.service';

@Module({
  imports: [TypeOrmModule.forFeature([KhachHang]), SystemLogModule],
  providers: [KhachHangService],
  controllers: [KhachHangController],
  exports: [KhachHangService],
})
export class KhachHangModule {}
