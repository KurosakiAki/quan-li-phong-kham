import { Module } from '@nestjs/common';
import { PaginateService } from './paginate.service';

@Module({
  imports: [],
  providers: [PaginateService],
  controllers: [],
  exports: [PaginateService]
})
export class PaginateModule { }
