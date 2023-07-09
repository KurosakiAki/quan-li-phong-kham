import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNhanVienDto {
  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
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

  updatedUser: number;
}

export class CreateNhanVienDto extends UpdateNhanVienDto {}
