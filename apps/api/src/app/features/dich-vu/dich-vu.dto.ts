import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateDichVuDto {
  @ApiProperty({ type: 'string', example: 'Toroidal' })
  @IsNotEmpty()
  tenDichVu: string;

  @ApiProperty({ type: 'string', example: 'Kham benh' })
  @IsNotEmpty()
  loai: string;

  @ApiProperty({ type: 'string', example: 'lần' })
  @IsNotEmpty()
  donVi: string;

  @ApiProperty({ type: 'number', example: '1000' })
  @IsNotEmpty()
  donGia: number;

  updatedUser: number;
}

export class CreateDichVuDto extends UpdateDichVuDto {}
