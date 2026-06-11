# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个个人工具集合管理平台，基于 Monorepo 架构的全栈应用。项目包含 React/UmiJS 管理后台、Vite React 客户端应用和 Go 后端 API 服务。

## 项目结构

```text
zxm-toolkit-admin/
├── apps/
│   ├── admin/          # 前端管理后台 (UmiJS + React + Ant Design)
│   ├── client/         # 前端客户端应用 (Vite + React + React Vant)
│   └── server-go/      # 后端 API 服务 (Go + Gin + SQLite)
├── packages/
│   ├── http-client/    # HTTP 客户端共享包
│   └── shared-components/ # 共享组件包
├── doc-server-api/     # API 接口文档
├── doc-server-db/      # 数据库结构文档
└── package.json        # 根配置文件
```

## 常用开发命令

```bash
# 安装前端依赖
yarn install

# 启动管理后台（端口 8008）
yarn dev:admin

# 启动客户端应用（端口 6681）
yarn dev:client

# 启动 Go 后端（端口 8010）
yarn dev:server

# 或直接启动 Go 后端
cd apps/server-go && go run ./cmd/server/main.go

# 构建前端
yarn admin:build
yarn client:build

# 构建 Go 后端
yarn server:build

# Go 测试
cd apps/server-go && go test ./...

# 格式化前端和文档
yarn format
```

## 核心功能模块

### 车辆轨迹管理

路径：`apps/server-go/internal/service/vehicle_track_service.go`、`apps/server-go/internal/http/handler/vehicle_track_handler.go`、`apps/admin/src/pages/vehicle-track/`

- 从途强 API 同步轨迹数据
- 查询轨迹数据，支持分页、时间范围和缺失坐标筛选
- 批量将 BD-09 坐标转换为 GCJ-02 坐标

API：

- `GET /api/vehicle-track`
- `POST /api/vehicle-track/sync`
- `POST /api/vehicle-track/convert-gcj02`

### 车辆行程管理

路径：`apps/server-go/internal/service/vehicle_trip_service.go`、`apps/server-go/internal/http/handler/vehicle_trip_handler.go`、`apps/admin/src/pages/vehicle-trip/`

- 从外部 API 同步行程数据
- 查询行程数据，支持分页和时间范围筛选

### 通用配置管理

路径：`apps/server-go/internal/service/common_config_service.go`、`apps/server-go/internal/http/handler/common_config_handler.go`、`apps/admin/src/pages/common-config/`

- 系统配置增删改查
- 支持配置项启用/禁用和排序

重要配置项：

- `TuQiangToken`：途强 API 访问令牌
- `WanCheBaoToken`：万车宝 API 访问令牌
- `BaiduMapApiKey`：百度地图 API 密钥

### 用户认证系统

路径：`apps/server-go/internal/service/auth_service.go`、`apps/server-go/internal/http/handler/auth_handler.go`、`apps/admin/src/pages/login/`

- 基于 JWT 的身份认证
- 管理员账号通过配置文件或环境变量设置
- 业务接口由 Go 中间件校验 Bearer Token

## 架构概览

### 前端 `apps/admin`

- UmiJS 4.x + React 19
- Ant Design 5.x
- SWR 用于数据获取
- Mako 构建

### 客户端 `apps/client`

- Vite + React
- React Vant
- React Router

### 后端 `apps/server-go`

- Gin HTTP 服务
- GORM + SQLite 持久化
- Viper 加载 YAML 和环境变量配置
- slog 日志
- JWT 登录与认证中间件

主要目录：

- `cmd/server/`：服务入口
- `config/`：配置加载和默认值
- `internal/http/handler/`：HTTP handler
- `internal/http/router/`：路由注册
- `internal/http/router_middleware/`：认证、CORS、日志中间件
- `internal/service/`：业务逻辑
- `internal/repository/`：数据访问
- `internal/model/`：GORM 模型
- `pkg/db/`：数据库初始化
- `pkg/logger/`：日志初始化

## 环境配置

Go 服务配置文件：`apps/server-go/config/config.yaml`

常用环境变量：

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

API 接口地址：http://localhost:8010/api

## 数据库

- SQLite 数据库存储在 `apps/server-go/data/` 目录
- GORM 模型定义数据结构
- `database.synchronize=true` 时启动自动执行 `AutoMigrate`
- 生产环境建议设置 `SQLITE_SYNCHRONIZE=false`，并使用显式迁移流程

主要数据表：

- `vehicle_track`
- `vehicle_trip`
- `common_configs`
- `demo`

## 外部 API 集成

### 途强 API

- 用于车辆轨迹数据同步
- 需要配置有效的 `TuQiangToken`

### 万车宝 API

- 用于车辆行程数据同步
- 需要配置有效的 `WanCheBaoToken`

### 百度地图 API

- 用于 BD-09 到 GCJ-02 坐标转换
- 需要配置有效的 `BaiduMapApiKey`

## 开发规范

- 接口变更同步更新 `doc-server-api`
- 数据库变更同步更新 `doc-server-db`
- Go 代码使用 `gofmt`
- 前端代码使用 ESLint 和 Prettier
- 不要提交密钥、本地数据库文件或构建产物
- 不要自动提交 Git，除非特别要求

## 生产部署

- 设置 `NODE_ENV=production` 或等价运行环境变量
- 设置 `SQLITE_SYNCHRONIZE=false`
- 使用强 JWT 密钥
- 配置正确的 CORS 来源
- 确保所有外部 API 密钥已正确配置
