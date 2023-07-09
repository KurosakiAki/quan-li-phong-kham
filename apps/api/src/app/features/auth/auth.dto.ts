import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
  @ApiProperty({ type: 'string', example: 'user01' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: 'string', example: '******' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', example: 'ADMIN' })
  @IsOptional()
  role: string;
}

export class ChangePasswordDto {
  @ApiProperty({ type: 'string', example: '123456' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', example: '123456' })
  @IsNotEmpty()
  confirmPassword: string;
}
