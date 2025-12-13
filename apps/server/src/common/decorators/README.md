# Decorators 目录

存放自定义装饰器。

装饰器用于扩展类、方法、属性或参数的功能，可以用于：
- 权限控制
- 日志记录
- 性能监控
- 参数验证
- 其他横切关注点

## CurrentUser 装饰器

`CurrentUser` 装饰器用于在控制器方法中获取当前登录用户信息。

### 使用方法

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('demo')
@UseGuards(AuthGuard) // 必须使用 AuthGuard 才能获取用户信息
export class DemoController {
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    // user 包含从 JWT token 中解析的用户信息
    // {
    //   sub: '1',        // 用户 ID
    //   username: 'admin', // 用户名
    //   access: 'admin',   // 权限
    //   iat: 1234567890,  // 签发时间（可选）
    //   exp: 1234567890   // 过期时间（可选）
    // }
    return user;
  }
}
```

### 注意事项

- `CurrentUser` 装饰器必须配合 `AuthGuard` 使用
- 如果请求未通过认证，`AuthGuard` 会抛出 `UnauthorizedException`
- 用户信息来自 JWT token 的 payload，由登录接口生成

