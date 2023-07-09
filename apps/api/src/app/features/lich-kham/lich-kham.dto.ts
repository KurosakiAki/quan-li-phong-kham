import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateLichKhamDto {

  @ApiProperty({ type: 'number', example: '1' })
  @IsOptional()
  khachHangId: number;

  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  bacSiId: number;

  @ApiProperty({ type: 'string', example: 'Le Van Tam' })
  @IsNotEmpty()
  tenBenhNhan: string;

  @ApiProperty({ type: 'string', example: '0909000999' })
  @IsNotEmpty()
  soDienThoai: string;

  @ApiProperty({ type: 'string', example: 'bsi@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: 'string', example: '123 Le Duan' })
  @IsOptional()
  diaChi: string;

  @ApiProperty({ type: 'ISO Datetime', example: '2022-09-15T07:02:42.669Z' })
  @IsNotEmpty()
  thoiGianKham: String;

  @ApiProperty({ type: 'string', example: 'ABC' })
  @IsNotEmpty()
  lyDo: string;

  @ApiProperty({ type: 'string', example: 'ABC' })
  @IsOptional()
  chanDoan: string;

  @ApiProperty({ type: 'string', example: 'Chờ xử lý' })
  @IsNotEmpty()
  trangThai: string;

  updatedUser: number;
}

export class CreateLichKhamDto extends UpdateLichKhamDto {}
