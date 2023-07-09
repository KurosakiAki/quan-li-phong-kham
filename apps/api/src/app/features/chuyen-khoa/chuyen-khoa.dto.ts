import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateChuyenKhoaDto {
  @ApiProperty({ type: 'string', example: 'Toroidal' })
  @IsNotEmpty()
  tenChuyenKhoa: string;

  updatedUser: number;
}

export class CreateChuyenKhoaDto extends UpdateChuyenKhoaDto {}
