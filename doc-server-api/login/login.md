# 用户登录

## 接口信息

- **接口路径**: `POST /api/auth/login`
- **接口描述**: 用户登录，获取访问令牌
- **是否需要认证**: 否

## 请求参数

### 请求体 (Body)

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| username | string | 是 | 用户名 | your_username |
| password | string | 是 | 密码 | your_password |

### 请求示例

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

## 响应结果

### 成功响应 (200)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "your_username",
    "email": "admin@example.com",
    "access": "admin"
  }
}
```

### 响应字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| access_token | string | JWT 访问令牌，用于后续接口认证 |
| user | object | 用户信息对象 |
| user.id | string | 用户ID |
| user.username | string | 用户名 |
| user.email | string | 用户邮箱 |
| user.access | string | 用户权限级别 |

### 错误响应

**401 - 用户名或密码错误**

```json
{
  "statusCode": 401,
  "message": "用户名或密码错误",
  "error": "Unauthorized"
}
```

**400 - 请求参数错误**

```json
{
  "statusCode": 400,
  "message": ["用户名不能为空", "密码不能为空"],
  "error": "Bad Request"
}
```

## 使用示例

### cURL

```bash
curl -X POST http://localhost:8010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

### JavaScript (Fetch)

```javascript
const response = await fetch('http://localhost:8010/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'your_username',
    password: 'your_password',
  }),
});

const data = await response.json();
console.log(data.access_token); // JWT token
```

### TypeScript (Axios)

```typescript
import axios from 'axios';

const response = await axios.post('http://localhost:8010/api/auth/login', {
  username: 'your_username',
  password: 'your_password',
});

const { access_token, user } = response.data;
// 将 token 存储到 localStorage 或状态管理中
localStorage.setItem('token', access_token);
```

## 注意事项

1. **Token 使用**: 获取到的 `access_token` 需要在后续需要认证的接口请求头中携带：
   ```
   Authorization: Bearer {access_token}
   ```

2. **Token 有效期**: Token 默认有效期为 7 天（可通过环境变量 `JWT_EXPIRES_IN` 配置）

3. **账号配置**: 
   - 管理员账号和密码通过环境变量 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 配置
   - 请参考 `env.example` 文件进行配置
   - 生产环境必须修改为安全的账号密码

4. **安全提示**: 
   - 生产环境请修改默认的 JWT 密钥（`JWT_SECRET` 环境变量）
   - 生产环境必须修改管理员账号和密码（`ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 环境变量）

