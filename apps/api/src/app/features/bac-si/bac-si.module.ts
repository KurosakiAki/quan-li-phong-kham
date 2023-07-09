import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogModule } from '../system-log/system-log.module';
import { BacSiController } from './bac-si.controller';
import { BacSi } from './bac-si.entity';
import { BacSiService } from './bac-si.service';

@Module({
  imports: [TypeOrmModule.forFeature([BacSi]), SystemLogModule],
  providers: [BacSiService],
  controllers: [BacSiController],
  exports: [BacSiService],
})
export class BacSiModule {}
