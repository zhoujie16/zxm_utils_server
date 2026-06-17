## 概述

`server` 是基于 Go + Gin + Viper + GORM + slog 实现的后端 API 服务：

- 登录认证（JWT）
- 车辆轨迹：查询、同步、GCJ-02 坐标转换
- 车辆行程：查询、同步
- 公共配置：CRUD
- Demo：CRUD
- SQLite 数据库自动建表/补字段（受 `database.synchronize` 控制）

## 启动

1. 确保本地已安装 Go 1.22+
2. 在仓库根目录执行：

```bash
cd apps/server
go run ./cmd/server/main.go
```

服务默认监听 `http://localhost:8010/api`，端口和前缀可在 `config/config.yaml` 或环境变量中调整。

## 配置

默认配置文件位于 `config/config.yaml`。常用配置也可以通过环境变量覆盖：

- `PORT`
- `API_PREFIX`
- `CORS_ORIGIN`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SQLITE_DATABASE`
- `SQLITE_SYNCHRONIZE`
- `SQLITE_LOGGING`
