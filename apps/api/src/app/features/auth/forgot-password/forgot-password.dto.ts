import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ type: 'string', example: 'user01' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: 'string', example: 'ADMIN' })
  @IsOptional()
  role: string;
}