/**
 * 同步行程数据 DTO
 * 用于同步指定月份的车辆行程数据
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SyncTripDto {
  @ApiProperty({
    description: '时间（格式：YYYY-MM）',
    example: '2025-12',
  })
  @IsNotEmpty({ message: '时间不能为空' })
  @IsString({ message: '时间必须是字符串' })
  @Matches(/^\d{4}-\d{2}$/, { message: '时间格式不正确，应为 YYYY-MM' })
  month: string;
}

