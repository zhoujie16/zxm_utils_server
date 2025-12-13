/**
 * 当前用户装饰器
 * 用于在控制器方法中获取当前登录用户信息
 * 需要配合 AuthGuard 使用
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

