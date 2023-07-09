import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { ChuyenKhoaController } from './chuyen-khoa.controller';
import { ChuyenKhoa } from './chuyen-khoa.entity';
import { ChuyenKhoaService } from './chuyen-khoa.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChuyenKhoa]), SystemLogModule],
  providers: [ChuyenKhoaService],
  controllers: [ChuyenKhoaController],
  exports: [ChuyenKhoaService],
})
export class ChuyenKhoaModule {}
