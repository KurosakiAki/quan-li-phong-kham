import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { HoaDonController } from './hoa-don.controller';
import { HoaDon } from './hoa-don.entity';
import { HoaDonService } from './hoa-don.service';

@Module({
  imports: [TypeOrmModule.forFeature([HoaDon]), SystemLogModule],
  providers: [HoaDonService],
  controllers: [HoaDonController],
  exports: [HoaDonService],
})
export class HoaDonModule {}
