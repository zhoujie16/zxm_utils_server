# Server 后端服务

基于 NestJS 11.x 框架构建的 TypeScript 后端应用，采用模块化架构设计，提供完整的 RESTful API 和数据库操作。

## 📋 目录

- [技术栈](#技术栈)
- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [API 文档](#api-文档)
- [开发指南](#开发指南)
- [脚本说明](#脚本说明)

## 🛠 技术栈

- **框架**: NestJS 11.x
- **语言**: TypeScript 5.7
- **数据库**: SQLite3 (better-sqlite3)
- **ORM**: TypeORM 0.3.x
- **API 文档**: Swagger/OpenAPI
- **认证**: JWT (@nestjs/jwt)
- **包管理器**: Yarn
- **代码规范**: ESLint + Prettier

## ✨ 功能特性

- ✅ 模块化架构设计
- ✅ RESTful API 接口
- ✅ TypeORM 数据库操作（增删改查）
- ✅ JWT 身份认证
- ✅ Swagger API 文档自动生成
- ✅ 环境配置管理
- ✅ CORS 跨域支持
- ✅ 统一的异常处理
- ✅ 数据验证管道
- ✅ 代码规范和格式化

## 📁 项目结构

```
server/
├── src/
│   ├── common/              # 共享模块
│   │   ├── decorators/     # 自定义装饰器
│   │   ├── filters/        # 异常过滤器
│   │   ├── guards/         # 认证守卫
│   │   ├── interceptors/   # 拦截器
│   │   ├── middleware/     # 中间件
│   │   ├── pipes/          # 数据验证管道
│   │   ├── interfaces/     # 共享接口定义
│   │   ├── constants/      # 常量定义
│   │   └── utils/          # 工具函数
│   ├── config/             # 配置管理
│   │   ├── app.config.ts   # 应用配置
│   │   ├── database.config.ts  # 数据库配置
│   │   └── config.module.ts
│   ├── modules/            # 业务模块
│   │   ├── login/          # 登录认证模块
│   │   │   ├── login.module.ts
│   │   │   ├── login.controller.ts
│   │   │   ├── login.service.ts
│   │   │   ├── dto/        # 数据传输对象
│   │   │   └── interfaces/ # 模块内接口
│   │   └── demo/           # Demo 模块示例
│   │       ├── demo.module.ts
│   │       ├── demo.controller.ts
│   │       ├── demo.service.ts
│   │       ├── demo.entity.ts
│   │       ├── dto/        # 数据传输对象
│   │       └── interfaces/ # 模块内接口
│   ├── types/             # 全局类型定义
│   ├── app.module.ts      # 根模块
│   └── main.ts            # 应用入口
├── data/                  # 数据库文件目录
├── test/                  # 测试文件
├── env.example            # 环境变量示例
└── package.json
```

## 🚀 快速开始

### 前置要求

- Node.js >= 20.0.0
- Yarn >= 1.22.22

### 安装依赖

```bash
yarn install
```

### 环境配置

复制环境变量示例文件并配置：

```bash
cp env.example .env
```

编辑 `.env` 文件，根据实际需求修改配置项（详见 [环境配置](#环境配置)）。

### 启动应用

```bash
# 开发模式（热重载）
yarn start:dev

# 生产模式
yarn build
yarn start:prod
```

应用启动后，访问：

- **API 基础路径**: http://localhost:8010/api
- **Swagger 文档**: http://localhost:8010/docs (仅开发环境)

## ⚙️ 环境配置

项目使用环境变量进行配置管理，主要配置项如下：

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `NODE_ENV` | 运行环境 | `development` | `development` / `production` |
| `PORT` | HTTP 端口 | `8010` | `8010` |
| `API_PREFIX` | API 前缀 | `api` | `api` |
| `CORS_ORIGIN` | CORS 允许来源 | `*` | `*` 或 `http://localhost:8008` |
| `SQLITE_DATABASE` | 数据库文件路径 | `data/app.db` | `data/app.db` |
| `SQLITE_SYNCHRONIZE` | 自动同步数据库结构 | `true` | `true` / `false` |
| `SQLITE_LOGGING` | 启用 SQL 日志 | `true` | `true` / `false` |
| `JWT_SECRET` | JWT 密钥 | - | 生产环境必须修改 |
| `JWT_EXPIRES_IN` | JWT 过期时间 | `7d` | `7d` |
| `ADMIN_USERNAME` | 管理员用户名 | - | 自定义管理员用户名 |
| `ADMIN_PASSWORD` | 管理员密码 | - | 自定义管理员密码 |

### 注意事项

- 生产环境必须设置 `NODE_ENV=production`
- 生产环境必须设置 `SQLITE_SYNCHRONIZE=false`
- 生产环境必须修改 `JWT_SECRET` 为安全的随机字符串
- 生产环境必须修改 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 为安全的账号密码
- 生产环境建议禁用 `SQLITE_LOGGING` 以提高性能

## 📚 API 文档

项目集成了 Swagger，提供交互式 API 文档。

### 访问文档

开发环境启动后，访问：http://localhost:8010/docs

### 主要接口

#### 登录认证模块

- `POST /api/auth/login` - 用户登录，获取 JWT Token

详细文档请查看：[登录接口文档](../../doc-server-api/login/login.md)

#### Demo 模块接口

- `POST /api/demo` - 创建 Demo
- `GET /api/demo` - 查询所有 Demo
- `GET /api/demo/:id` - 根据 ID 查询 Demo
- `PATCH /api/demo/:id` - 更新 Demo
- `DELETE /api/demo/:id` - 删除 Demo

### 请求示例

```bash
# 用户登录
curl -X POST http://localhost:8010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'

# 创建 Demo
curl -X POST http://localhost:8010/api/demo \
  -H "Content-Type: application/json" \
  -d '{"name": "测试", "description": "这是一个测试"}'

# 查询所有 Demo
curl http://localhost:8010/api/demo

# 查询单个 Demo
curl http://localhost:8010/api/demo/1

# 更新 Demo
curl -X PATCH http://localhost:8010/api/demo/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "更新后的名称"}'

# 删除 Demo
curl -X DELETE http://localhost:8010/api/demo/1
```

## 💻 开发指南

### 代码规范

项目使用 ESLint 和 Prettier 进行代码规范检查：

```bash
# 检查代码规范
yarn lint

# 格式化代码
yarn format
```

### 测试

```bash
# 单元测试
yarn test

# 监听模式
yarn test:watch

# 测试覆盖率
yarn test:cov

# E2E 测试
yarn test:e2e
```

### 添加新模块

1. 在 `src/modules/` 目录下创建新模块目录
2. 创建模块文件：`{模块名}.module.ts`
3. 创建控制器：`{模块名}.controller.ts`
4. 创建服务：`{模块名}.service.ts`
5. 创建实体（如需要）：`{模块名}.entity.ts`
6. 创建 DTO 文件（如需要）：`dto/` 目录
7. 创建接口定义（如需要）：`interfaces/` 目录
8. 在 `app.module.ts` 中导入新模块

### 数据库操作

项目使用 TypeORM 进行数据库操作：

- 实体文件放在模块目录下：`{模块名}.entity.ts`
- 数据库文件自动创建在 `data/` 目录
- 开发环境自动同步数据库结构
- 生产环境必须禁用自动同步，使用迁移文件

### JWT 认证

项目使用 JWT 进行身份认证：

- 登录接口：`POST /api/auth/login`
- Token 格式：`Bearer {token}`
- Token 默认有效期：7 天
- 需要在请求头中携带：`Authorization: Bearer {token}`

## 📜 脚本说明

| 脚本 | 说明 |
|------|------|
| `yarn build` | 构建生产版本 |
| `yarn start` | 启动应用 |
| `yarn start:dev` | 开发模式（热重载） |
| `yarn start:debug` | 调试模式 |
| `yarn start:prod` | 生产模式 |
| `yarn lint` | 代码规范检查 |
| `yarn format` | 代码格式化 |
| `yarn test` | 运行单元测试 |
| `yarn test:watch` | 监听模式测试 |
| `yarn test:cov` | 测试覆盖率 |
| `yarn test:e2e` | E2E 测试 |

## 🔧 配置说明

### 端口配置

应用默认运行在 **6001** 端口，可通过环境变量 `PORT` 修改。

### CORS 配置

默认允许所有来源（`*`），生产环境建议配置具体的前端地址：

```env
CORS_ORIGIN=http://localhost:8008
```

### 数据库配置

- 数据库文件位置：`data/app.db`
- 开发环境自动同步数据库结构
- 生产环境必须禁用自动同步

## 📝 许可证

UNLICENSED

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

---

**注意**: 这是一个演示项目，生产环境使用前请确保：

1. 修改所有默认配置和密钥
2. 配置适当的安全策略
3. 设置正确的数据库备份策略
4. 配置日志和监控系统
