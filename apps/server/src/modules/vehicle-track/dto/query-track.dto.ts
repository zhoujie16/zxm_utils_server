/**
 * 查询轨迹数据 DTO
 * 用于查询车辆轨迹数据列表，支持分页和时间范围筛选
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTrackDto {
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
    example: 1736822392000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '开始时间必须是整数' })
  startTime?: number;

  @ApiProperty({
    description: '结束时间（时间戳，毫秒）',
    example: 1736822394000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '结束时间必须是整数' })
  endTime?: number;

  @ApiProperty({
    description: '筛选缺少 GCJ-02 坐标的数据（lat 和 lng 存在，但 lat_gcj02 或 lng_gcj02 为 null）',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'missingGcj02 必须是布尔值' })
  missingGcj02?: boolean;

  @ApiProperty({
    description: '筛选缺少 WGS84 坐标的数据（lat 和 lng 存在，但 lat_wgs84 或 lng_wgs84 为 null）',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'missingWgs84 必须是布尔值' })
  missingWgs84?: boolean;
}
