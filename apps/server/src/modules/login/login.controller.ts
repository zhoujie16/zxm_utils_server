import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginDto } from './dto';
import { ILoginResponse } from './interfaces/login.interface';

@ApiTags('登录认证')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto, description: '登录信息' })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            username: { type: 'string', example: 'your_username' },
            email: { type: 'string', example: 'admin@example.com' },
            access: { type: 'string', example: 'admin' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async login(@Body() loginDto: LoginDto): Promise<ILoginResponse> {
    return await this.loginService.login(loginDto);
  }
}