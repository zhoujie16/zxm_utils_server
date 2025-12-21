/**
 * 转换坐标 DTO
 * 用于批量转换坐标，支持时间范围筛选
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ConvertCoordinateDto {
  @ApiProperty({
    description: '开始时间（时间戳，毫秒），可选，不传则转换所有数据',
    example: 1736822392000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '开始时间必须是整数' })
  startTime?: number;

  @ApiProperty({
    description: '结束时间（时间戳，毫秒），可选，不传则转换所有数据',
    example: 1736822394000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '结束时间必须是整数' })
  endTime?: number;
}

