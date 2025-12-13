/**
 * 应用根服务
 * 提供应用级别的业务逻辑
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
