import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto';
import { ILoginResponse } from './interfaces/login.interface';
import { appConfig } from '../../config/app.config';

@Injectable()
export class LoginService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const { username, password } = loginDto;

    // 检查管理员账号是否已配置
    if (!appConfig.admin.username || !appConfig.admin.password) {
      throw new InternalServerErrorException('管理员账号未配置，请设置 ADMIN_USERNAME 和 ADMIN_PASSWORD 环境变量');
    }

    // 验证用户名和密码
    if (username !== appConfig.admin.username || password !== appConfig.admin.password) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成用户信息
    const user = {
      id: '1',
      username: appConfig.admin.username,
      email: 'admin@example.com',
      access: 'admin',
    };

    // 生成JWT token
    const payload = {
      sub: user.id,
      username: user.username,
      access: user.access
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    // 检查管理员账号是否已配置
    if (!appConfig.admin.username || !appConfig.admin.password) {
      return null;
    }

    if (username === appConfig.admin.username && password === appConfig.admin.password) {
      return {
        id: '1',
        username: appConfig.admin.username,
        email: 'admin@example.com',
        access: 'admin',
      };
    }
    return null;
  }
}