import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '@api-interfaces';

export class UpdateUserDto {
  @ApiProperty({ type: 'string', example: 'user01' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.PATIENT,
    example: UserRoleEnum.PATIENT,
  })
  @IsOptional()
  userRoleCode: UserRoleEnum;

  updatedUser: number;
}

export class CreateUserDto extends UpdateUserDto {
  @ApiProperty({ type: 'string', example: '123123' })
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ type: 'string', example: '123456' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', example: '123456' })
  @IsNotEmpty()
  confirmPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({ type: 'string', example: '123456' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', example: '123456' })
  @IsNotEmpty()
  token: string;
}

export class RegisterDto extends CreateUserDto{
  @ApiProperty({ type: 'string', example: '123456' })
  @IsNotEmpty()
  token: string;
}
