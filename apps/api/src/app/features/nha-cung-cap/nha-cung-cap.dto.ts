import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNhaCungCapDto {
  @ApiProperty({ type: 'string', example: 'Toroidal' })
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ type: 'string', example: '0909000999' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ type: 'string', example: 'user01@sedo.com' })
  @IsNotEmpty()
  // @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', example: '10 Le Duan' })
  @IsNotEmpty()
  address: string;


  updatedUser: number;
}

export class CreateNhaCungCapDto extends UpdateNhaCungCapDto {}
