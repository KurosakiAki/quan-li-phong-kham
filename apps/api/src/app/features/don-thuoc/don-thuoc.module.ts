import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { DonThuocController } from './don-thuoc.controller';
import { DonThuoc } from './don-thuoc.entity';
import { DonThuocService } from './don-thuoc.service';

@Module({
  imports: [TypeOrmModule.forFeature([DonThuoc]), SystemLogModule],
  providers: [DonThuocService],
  controllers: [DonThuocController],
  exports: [DonThuocService],
})
export class DonThuocModule {}
