import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateChiTietDonThuocDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  donThuocId: number;

  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  thuocId: number;

  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  soLuong: number;

  @ApiProperty({ type: 'string', example: 'Sang 1 lan, chieu 1 lan' })
  @IsNotEmpty()
  cachDung: string;

  updatedUser: number;
}

export class CreateChiTietDonThuocDto extends UpdateChiTietDonThuocDto {}
