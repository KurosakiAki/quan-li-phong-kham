import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserDeviceModule } from '../user/user-device/user-device.module';
import { SendEmailModule } from '../../common/services/send-email/send-email.module';
import { configService } from 'apps/api/src/config/config.service';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { KhachHangModule } from '../khach-hang/khach-hang.module';
import { RegisterTokenModule } from './registerToken/registerToken.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configService.getValue('JWT_SECRET'),
      signOptions: { expiresIn: configService.getValue('JWT_EXPIRES') || '30 days' }
    }),
    UserModule,
    KhachHangModule,
    UserDeviceModule,
    SendEmailModule,
    ForgotPasswordModule,
    RegisterTokenModule
  ],
  providers: [
    JwtStrategy,
    AuthService
  ],
  controllers: [
    AuthController,
  ],
  exports: [AuthService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

  }
}
