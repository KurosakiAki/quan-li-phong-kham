import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ISystemLogChangeData, SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';

export class SystemLogDto {
  @ApiProperty({
    type: 'enum',
    enum: SystemLogObjectTypeEnum,
    example: SystemLogObjectTypeEnum.USER,
  })
  objectType: SystemLogObjectTypeEnum;

  @ApiProperty({ type: 'number', example: '1' })
  @IsNotEmpty()
  objectId: number;

  @ApiProperty({
    type: 'enum',
    enum: SystemLogTypeEnum,
    example: SystemLogTypeEnum.CREATE,
  })
  @IsNotEmpty()
  type: SystemLogTypeEnum;

  @ApiProperty({ 
    type: 'object',
     example: [
      {field: 'name', oldValue: 'Admin', newValue: 'Bob'},
      {field: 'age', oldValue: 30, newValue: 32},
    ]
  })
  @IsOptional()
  changeData: ISystemLogChangeData[];

  createdAt?: Date;

  updatedUserId?: number;
}