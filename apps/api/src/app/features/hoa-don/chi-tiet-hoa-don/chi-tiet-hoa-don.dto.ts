import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateChiTietHoaDonDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  hoaDonId: number;

  @ApiProperty({ type: 'number', example: '1' })
  @IsOptional()
  thuocId: number;

  @ApiProperty({ type: 'number', example: '1' })
  @IsOptional()
  dichVuId: number;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  thanhTien: number;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  soLuong: number;

  updatedUser: number;
}

export class CreateChiTietHoaDonDto extends UpdateChiTietHoaDonDto {}
