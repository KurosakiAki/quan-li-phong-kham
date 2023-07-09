import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateHoaDonDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  khachHangId: number;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  tongTien: number;

  @ApiProperty({ type: 'string', example: 'chua thanh toan' })
  @IsOptional()
  trangThai: string;

  updatedUser: number;
}

export class CreateHoaDonDto extends UpdateHoaDonDto {}
