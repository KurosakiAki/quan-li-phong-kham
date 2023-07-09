import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { ThuocController } from './thuoc.controller';
import { Thuoc } from './thuoc.entity';
import { ThuocService } from './thuoc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Thuoc]), SystemLogModule],
  providers: [ThuocService],
  controllers: [ThuocController],
  exports: [ThuocService],
})
export class ThuocModule {}
