import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateChiTietThuocDto {
  
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  thuocId: number;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  soLuong: number;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  soLuongConLai: number;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  giaNhap: number;

  @ApiProperty({ type: 'string', example: '2020-01-31' })
  @IsNotEmpty()
  ngayHetHan: string;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  tongNhap: number;

  @ApiProperty({ type: 'string', example: 'Đã thanh toán' })
  @IsOptional()
  trangThai: string;

  updatedUser: number;
}

export class CreateChiTietThuocDto extends UpdateChiTietThuocDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  nhapKhoThuocId: number;
}
