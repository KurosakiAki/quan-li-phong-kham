import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateKhachHangDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsOptional()
  userId: number;

  @ApiProperty({ type: 'string', example: 'Le Van Tam' })
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ type: 'string', example: '2020-01-31' })
  @IsNotEmpty()
  birthday: string;

  @ApiProperty({ type: 'string', example: 'Female' })
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ type: 'string', example: '0909000999' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ type: 'string', example: 'user01@sedo.com' })
  @IsNotEmpty()
  // @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', example: '10 Le Duan' })
  @IsOptional()
  address: string;

  @ApiProperty({ type: 'string', example: 'Khong co' })
  @IsOptional()
  tienSuBenh: string;

  updatedUser: number;
}

export class CreateKhachHangDto extends UpdateKhachHangDto {}
