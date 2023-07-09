import { Module } from '@nestjs/common';
import { BackupModule } from '../backup/backup.module';
import { SendEmailModule } from '../common/services/send-email/send-email.module';

import { CronService } from './cron.service';
import { ChiTietThuocModule } from '../features/thuoc/chi-tiet-thuoc/chi-tiet-thuoc.module';
import { LichKhamModule } from '../features/lich-kham/lich-kham.module';
import { ThuocModule } from '../features/thuoc/thuoc.module';

@Module({
  imports: [
    SendEmailModule,
    BackupModule,
    ChiTietThuocModule,
    LichKhamModule,
    ThuocModule
  ],
  providers: [CronService],
  controllers: [],
  exports: [CronService]
})
export class CronModule { }
