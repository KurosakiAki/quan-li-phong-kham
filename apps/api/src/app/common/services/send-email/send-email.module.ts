import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { SendEmailController } from './send-email.controller';
import { SendEmailService } from './send-email.service';
import { SendEmailProcessor } from './send-email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-email-queue',
    }),
  ],
  providers: [SendEmailService, SendEmailProcessor],
  controllers: [SendEmailController],
  exports: [SendEmailService],
})
export class SendEmailModule {}
