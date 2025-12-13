/**
 * 验证管道
 * 用于验证和转换输入数据
 */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // 验证和转换逻辑
    return value;
  }
}

