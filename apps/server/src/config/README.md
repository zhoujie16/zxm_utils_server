# Config 目录

存放配置管理相关文件。

配置模块用于统一管理应用程序的配置，包括：
- 应用配置（`app.config.ts`）：HTTP 端口、API 前缀、CORS、JWT、管理员账号等
- 数据库配置（`database.config.ts`）：数据库连接、同步、日志等
- 环境变量配置：通过环境变量覆盖默认配置

## 配置文件说明

### app.config.ts
应用基础配置，包括：
- 运行环境（`NODE_ENV`）
- HTTP 端口（`PORT`）
- API 前缀（`API_PREFIX`）
- CORS 配置（`CORS_ORIGIN`）
- JWT 配置（`JWT_SECRET`、`JWT_EXPIRES_IN`）
- 管理员账号（`ADMIN_USERNAME`、`ADMIN_PASSWORD`）

### database.config.ts
数据库相关配置，包括：
- 数据库文件路径（`SQLITE_DATABASE`）
- 自动同步（`SQLITE_SYNCHRONIZE`）
- SQL 日志（`SQLITE_LOGGING`）

所有配置项都支持通过环境变量进行覆盖，详见 `env.example` 文件。

