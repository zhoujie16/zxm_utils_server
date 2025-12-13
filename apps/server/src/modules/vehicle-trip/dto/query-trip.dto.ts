/**
 * 查询行程数据 DTO
 * 用于查询车辆行程数据列表，支持分页和时间范围筛选
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTripDto {
  @ApiProperty({
    description: '页码',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码必须大于0' })
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量必须大于0' })
  @Max(100, { message: '每页数量不能超过100' })
  limit?: number = 10;

  @ApiProperty({
    description: '开始时间（时间戳，毫秒）',
    example: 1764547200000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '开始时间必须是整数' })
  startTime?: number;

  @ApiProperty({
    description: '结束时间（时间戳，毫秒）',
    example: 1767139199000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '结束时间必须是整数' })
  endTime?: number;
}

