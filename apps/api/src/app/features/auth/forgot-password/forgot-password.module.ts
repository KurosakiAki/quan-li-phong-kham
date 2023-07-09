import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendEmailModule } from '../../../common/services/send-email/send-email.module';
import { ForgotPassword } from './forgot-password.entity';
import { ForgotPasswordService } from './forgot-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForgotPassword]),
    SendEmailModule
  ],
  providers: [ForgotPasswordService],
  controllers: [],
  exports: [ForgotPasswordService]
})
export class ForgotPasswordModule { }
