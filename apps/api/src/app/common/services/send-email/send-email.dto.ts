import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  @IsNotEmpty()
  to: string | string[];

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  @IsOptional()
  cc: string | string[];

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  @IsOptional()
  bcc: string | string[];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ type: String })
  @IsOptional()
  text: string;

  @ApiProperty({ type: String })
  @IsOptional()
  template: string;

  @ApiProperty()
  @IsOptional()
  context: any;
}
