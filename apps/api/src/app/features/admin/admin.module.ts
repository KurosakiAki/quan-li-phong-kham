import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { AdminController } from './admin.controller';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), SystemLogModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
