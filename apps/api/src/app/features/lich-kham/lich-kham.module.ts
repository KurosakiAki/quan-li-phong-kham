import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { LichKhamController } from './lich-kham.controller';
import { LichKham } from './lich-kham.entity';
import { LichKhamService } from './lich-kham.service';
import { SendEmailModule } from '../../common/services/send-email/send-email.module';
import { ChuyenKhoaModule } from '../chuyen-khoa/chuyen-khoa.module';

@Module({
  imports: [TypeOrmModule.forFeature([LichKham]), SystemLogModule, SendEmailModule, ChuyenKhoaModule],
  providers: [LichKhamService],
  controllers: [LichKhamController],
  exports: [LichKhamService],
})
export class LichKhamModule {}
