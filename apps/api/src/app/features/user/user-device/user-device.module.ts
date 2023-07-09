import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserDevice } from './user-device.entity';
import { UserDeviceService } from './user-device.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ UserDevice ])
  ],
  providers: [
    UserDeviceService
  ],
  controllers: [],
  exports: [
    UserDeviceService
  ],
})
export class UserDeviceModule {}
