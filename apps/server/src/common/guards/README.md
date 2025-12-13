# Guards 目录

存放认证和授权守卫。

守卫用于在路由处理器执行前进行权限验证，可以：
- 验证用户身份（认证）
- 检查用户权限（授权）
- 控制路由访问
- 实现角色和权限管理

## AuthGuard 使用说明

`AuthGuard` 用于验证 JWT token，确保请求已通过身份认证。

### 使用方法

在控制器或路由处理器上使用 `@UseGuards(AuthGuard)` 装饰器：

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('demo')
@Controller('demo')
@UseGuards(AuthGuard) // 保护整个控制器
@ApiBearerAuth() // Swagger 文档中显示需要认证
export class DemoController {
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    // user 包含从 JWT token 中解析的用户信息
    // { sub: '1', username: 'admin', access: 'admin' }
    return user;
  }
}
```

### 获取当前用户

使用 `@CurrentUser()` 装饰器获取当前登录用户信息：

```typescript
@Get('me')
async getCurrentUser(@CurrentUser() user: any) {
  return {
    id: user.sub,
    username: user.username,
    access: user.access,
  };
}
```

### 跳过认证

如果某个路由不需要认证，可以使用 `@Public()` 装饰器（需要自行实现）或直接在路由上不使用 `@UseGuards(AuthGuard)`。

