import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateThuocDto {
  @ApiProperty({ type: 'string', example: 'Toroidal' })
  @IsNotEmpty()
  tenThuoc: string;

  @ApiProperty({ type: 'string', example: 'lần' })
  @IsNotEmpty()
  donVi: string;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  donGia: number;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsOptional()
  tonKho: number;

  updatedUser: number;
}

export class CreateThuocDto extends UpdateThuocDto {}
