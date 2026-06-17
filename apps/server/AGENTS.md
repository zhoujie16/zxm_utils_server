# Server Go Guidelines

本文件适用于 `apps/server`。除本文件外，仍需遵循仓库根目录 `AGENTS.md`。

## 技术栈

- Go 1.22
- Gin
- GORM
- SQLite
- Viper
- slog
- JWT

## 常用命令

- 在仓库根目录运行 `yarn dev:server` 启动服务。
- 在 `apps/server` 内运行 `go run ./cmd/server/main.go` 启动服务。
- 在 `apps/server` 内运行 `go test ./...` 执行后端测试。
- 在仓库根目录运行 `yarn server:build` 交叉编译服务。

## 目录约定

- 服务入口：`cmd/server/main.go`。
- 配置加载：`config`。
- HTTP handler：`internal/http/handler`。
- 路由注册：`internal/http/router`。
- 中间件：`internal/http/router_middleware`。
- DTO：`internal/dto`。
- 业务逻辑：`internal/service`。
- 数据访问：`internal/repository`。
- GORM 模型：`internal/model`。
- 数据库初始化：`pkg/db`。
- 日志初始化：`pkg/logger`。

## 开发规范

- 按 `handler -> service -> repository -> model` 分层组织逻辑。
- handler 只做请求解析、基础校验和响应转换；复杂业务校验放在 service。
- repository 负责数据库查询封装，复杂查询不要散落在 handler 或 service。
- 成功响应直接返回业务数据，错误响应使用 `{ "message": "..." }`。
- 分页接口支持 `page`、`limit`，返回 `data` 和 `pagination`。
- 列表接口必须明确排序规则。
- 新增需要认证的接口必须挂载 JWT 中间件。
- 修改 Go 文件后使用 `gofmt`。
- 接口变更同步更新 `doc-server-api`，数据库字段或表结构变更同步更新 `doc-server-db`。
