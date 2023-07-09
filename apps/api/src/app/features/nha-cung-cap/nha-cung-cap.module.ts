import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { NhaCungCapController } from './nha-cung-cap.controller';
import { NhaCungCap } from './nha-cung-cap.entity';
import { NhaCungCapService } from './nha-cung-cap.service';

@Module({
  imports: [TypeOrmModule.forFeature([NhaCungCap]), SystemLogModule],
  providers: [NhaCungCapService],
  controllers: [NhaCungCapController],
  exports: [NhaCungCapService],
})
export class NhaCungCapModule {}
