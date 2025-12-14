/**
 * 同步轨迹数据 DTO
 * 用于同步指定时间范围的车辆轨迹数据
 */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'isTimeRangeValid', async: false })
export class IsTimeRangeValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const dto = args.object as SyncTrackDto;
    const startTime = dto.startTime;
    const endTime = dto.endTime;

    if (!startTime || !endTime) {
      return true; // 让其他验证器处理空值
    }

    try {
      const start = new Date(startTime.replace(' ', 'T'));
      const end = new Date(endTime.replace(' ', 'T'));

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return true; // 让格式验证器处理无效日期
      }

      // 检查结束时间是否晚于开始时间
      if (end <= start) {
        return false;
      }

      // 计算时间差（毫秒）
      const diffMs = end.getTime() - start.getTime();
      // 7天的毫秒数
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

      return diffMs <= sevenDaysMs;
    } catch (error) {
      return true; // 让格式验证器处理解析错误
    }
  }

  defaultMessage(args: ValidationArguments) {
    const dto = args.object as SyncTrackDto;
    const startTime = dto.startTime;
    const endTime = dto.endTime;

    if (!startTime || !endTime) {
      return '时间范围验证失败';
    }

    try {
      const start = new Date(startTime.replace(' ', 'T'));
      const end = new Date(endTime.replace(' ', 'T'));

      if (end <= start) {
        return '结束时间必须晚于开始时间';
      }

      return '时间范围不能超过7天';
    } catch (error) {
      return '时间范围验证失败';
    }
  }
}

export class SyncTrackDto {
  @ApiProperty({
    description: '开始时间（格式：YYYY-MM-DD HH:mm:ss）',
    example: '2025-12-14 00:00:00',
  })
  @IsNotEmpty({ message: '开始时间不能为空' })
  @IsString({ message: '开始时间必须是字符串' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '开始时间格式不正确，应为 YYYY-MM-DD HH:mm:ss',
  })
  @Validate(IsTimeRangeValidConstraint)
  startTime: string;

  @ApiProperty({
    description: '结束时间（格式：YYYY-MM-DD HH:mm:ss）',
    example: '2025-12-14 15:20:59',
  })
  @IsNotEmpty({ message: '结束时间不能为空' })
  @IsString({ message: '结束时间必须是字符串' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '结束时间格式不正确，应为 YYYY-MM-DD HH:mm:ss',
  })
  @Validate(IsTimeRangeValidConstraint)
  endTime: string;
}
