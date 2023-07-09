import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePhieuDichVuDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  lichKhamId: number;

  @ApiProperty({ type: 'string', example: 'HD100000000' })
  @IsOptional()
  maHoaDon: string;

  @ApiProperty({ type: 'string', example: 'Kham benh' })
  @IsNotEmpty()
  loai: string;

  // @ApiProperty({ type: 'string', example: '234234' })
  // @IsNotEmpty()
  // maPhieuDichVu: string;

  updatedUser: number;
}

export class CreatePhieuDichVuDto extends UpdatePhieuDichVuDto {}
