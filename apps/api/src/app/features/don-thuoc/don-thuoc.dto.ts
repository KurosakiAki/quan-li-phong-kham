import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDonThuocDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  lichKhamId: number;

  @ApiProperty({ type: 'string', example: 'HD100000000' })
  @IsOptional()
  maHoaDon: string;

  @ApiProperty({ type: 'string', example: 'Lời dặn' })
  @IsOptional()
  loiDan: string;

  @ApiProperty({ type: 'number', example: '1' })
  @IsOptional()
  hoaDonId: number;

  updatedUser: number;
}

export class CreateDonThuocDto extends UpdateDonThuocDto {}
