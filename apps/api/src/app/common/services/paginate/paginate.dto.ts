import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class PaginateDto {
  @ApiProperty({ type: 'number', example: 2, required: false })
  @IsOptional()
  page: number = 1;

  @ApiProperty({ type: 'number', example: 10, required: false })
  @IsOptional()
  limit: number = 0;
}
