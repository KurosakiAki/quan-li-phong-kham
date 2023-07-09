import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { DichVuController } from './dich-vu.controller';
import { DichVu } from './dich-vu.entity';
import { DichVuService } from './dich-vu.service';

@Module({
  imports: [TypeOrmModule.forFeature([DichVu]), SystemLogModule],
  providers: [DichVuService],
  controllers: [DichVuController],
  exports: [DichVuService],
})
export class DichVuModule {}
