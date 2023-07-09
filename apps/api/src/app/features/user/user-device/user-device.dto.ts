import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDeviceDto {

  @ApiProperty({ type: 'string', example: 'abc123' })
  @IsNotEmpty()
  deviceToken: string;

  @ApiProperty({ type: 'string', example: 'Android' })
  @IsOptional()
  deviceType: string;

}
