import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterToken } from './registerToken.entity';
import { RegisterTokenService } from './registerToken.service';
import { SendEmailModule } from '../../../common/services/send-email/send-email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegisterToken]),
    SendEmailModule,
  ],
  providers: [RegisterTokenService],
  controllers: [],
  exports: [RegisterTokenService]
})
export class RegisterTokenModule {}
