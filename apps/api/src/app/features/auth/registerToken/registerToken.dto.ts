import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateRegisterTokenDto {
  @ApiProperty({ type: 'string', example: 'user01' })
  @IsNotEmpty()
  referenceId: string;
}

export class CreateRegisterTokenDto extends UpdateRegisterTokenDto {}
