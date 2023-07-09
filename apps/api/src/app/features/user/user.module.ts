import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgotPasswordModule } from '../auth/forgot-password/forgot-password.module';
import { SystemLogModule } from '../system-log/system-log.module';
import { UserDevice } from './user-device/user-device.entity';
import { UserRoleModule } from './user-role/user-role.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { RegisterTokenModule } from '../auth/registerToken/registerToken.module';
import { KhachHangModule } from '../khach-hang/khach-hang.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ForgotPasswordModule,
    UserRoleModule,
    UserDevice,
    SystemLogModule,
    RegisterTokenModule,
    KhachHangModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
