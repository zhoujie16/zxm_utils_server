## 概述

`server-go` 是基于 Go + Gin + Viper + slog 实现的后端服务，实现了原 NestJS 版本中的所有业务能力：

- 登录认证（JWT）
- 车辆轨迹：查询、同步、GCJ-02 坐标转换
- 车辆行程：查询、同步
- 公共配置：CRUD
- Demo：CRUD

## 启动

1. 确保本地已安装 Go 1.22+
2. 在仓库根目录执行：

```bash
cd apps/server-go
go run ./cmd/server
```

服务默认监听 `http://localhost:8010/api`，端口和前缀可在 `config/config.yaml` 或环境变量中调整。

