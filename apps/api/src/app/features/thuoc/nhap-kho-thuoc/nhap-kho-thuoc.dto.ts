import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNhapKhoThuocDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  nhaCungCapId: number;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  tongTien: number;

  @ApiProperty({ type: 'string', example: 'Đã thanh toán' })
  @IsOptional()
  trangThai: string;

  updatedUser: number;
}

export class CreateNhapKhoThuocDto extends UpdateNhapKhoThuocDto {}
