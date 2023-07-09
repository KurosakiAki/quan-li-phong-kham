import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateChiTietPhieuDichVuDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  phieuDichVuId: number;

  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  dichVuId: number;

  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  soLuong: number;

  updatedUser: number;
}

export class CreateChiTietPhieuDichVuDto extends UpdateChiTietPhieuDichVuDto {}
