/**
 * 认证守卫
 * 用于验证用户身份和权限
 * 验证请求头中的 JWT token
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { appConfig } from '../../config/app.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('未提供认证令牌');
    }

    try {
      // 验证并解析 JWT token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: appConfig.jwt.secret,
      });

      // 将用户信息附加到请求对象上，供后续使用
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('无效的认证令牌或令牌已过期');
    }

    return true;
  }

  /**
   * 从请求头中提取 Bearer token
   * @param request HTTP 请求对象
   * @returns token 字符串，如果不存在则返回 undefined
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

