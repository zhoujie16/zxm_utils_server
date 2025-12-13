/**
 * 示例装饰器
 * 用于演示装饰器的基本结构
 */
import { SetMetadata } from '@nestjs/common';

// 装饰器常量
export const EXAMPLE_KEY = 'example';

// 示例装饰器
export const Example = () => SetMetadata(EXAMPLE_KEY, true);

