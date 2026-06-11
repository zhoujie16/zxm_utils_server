# ZXM Toolkit Admin

个人工具集合管理平台，基于 Monorepo 架构的全栈 Web 应用，包含前端管理后台、客户端应用和 Go 后端 API 服务。

## 项目结构

```text
zxm-toolkit-admin/
├── apps/
│   ├── admin/          # 前端管理后台 (UmiJS + React + Ant Design)
│   ├── client/         # 前端客户端应用 (Vite + React + React Vant)
│   └── server-go/      # 后端 API 服务 (Go + Gin + SQLite)
├── doc-server-api/     # API 接口文档
├── doc-server-db/      # 数据库结构文档
├── packages/           # 共享 TypeScript 包
└── package.json        # 根配置文件 (Yarn Workspaces)
```

## 技术栈

### 前端 Admin

- UmiJS 4.x + React 19
- Ant Design 5.x
- SWR
- TypeScript
- Mako

### 前端 Client

- Vite 7.x + React 19
- React Vant 3.x
- React Router 7.x
- TypeScript
- Less

### 后端 Server

- Go 1.22+
- Gin
- GORM + SQLite
- Viper 配置管理
- JWT 认证

## 快速开始

### 前置要求

- Node.js >= 20.0.0
- Yarn >= 1.22.22
- Go >= 1.22

### 安装前端依赖

```bash
yarn install
```

### 配置后端

Go 服务配置文件位于 `apps/server-go/config/config.yaml`，也支持通过环境变量覆盖端口、数据库、JWT、管理员账号等配置。

### 启动项目

```bash
# 启动管理后台（端口 8008）
yarn dev:admin

# 启动客户端应用（端口 6681）
yarn dev:client

# 启动 Go 后端（端口 8010）
yarn dev:server
```

也可以直接运行 Go 服务：

```bash
cd apps/server-go
go run ./cmd/server/main.go
```

### 访问地址

- 前端管理后台：http://localhost:8008
- 前端客户端应用：http://localhost:6681
- 后端 API：http://localhost:8010/api

## 项目说明

### 前端 `apps/admin`

基于 UmiJS 和 Ant Design 构建的管理后台系统。

### 前端 `apps/client`

基于 Vite 和 React Vant 构建的客户端应用。

### 后端 `apps/server-go`

基于 Go + Gin 构建的 RESTful API 服务，提供登录认证、车辆轨迹、车辆行程、公共配置和 Demo 等业务能力。

详细文档请查看 [apps/server-go/README.md](./apps/server-go/README.md)。

### API 文档

项目 API 文档位于 `doc-server-api/` 目录。

- [API 文档总览](./doc-server-api/README.md)
- [登录认证接口](./doc-server-api/login/login.md)

## 开发脚本

| 脚本 | 说明 |
|------|------|
| `yarn dev` | 同时启动 Go 后端、管理后台和客户端应用 |
| `yarn dev:admin` | 启动管理后台开发服务器 |
| `yarn dev:client` | 启动客户端应用开发服务器 |
| `yarn dev:server` | 启动 Go 后端服务 |
| `yarn dev:server-go` | 启动 Go 后端服务 |
| `yarn admin:build` | 构建管理后台生产版本 |
| `yarn client:build` | 构建客户端应用生产版本 |
| `yarn server:build` | 构建 Go 后端二进制 |
| `yarn server-go:build` | 交叉编译 Go 后端二进制 |
| `yarn build` | 构建所有应用 |
| `yarn format` | 格式化前端和文档文件 |

## 开发规范

- 接口变更同步更新 `doc-server-api`
- 数据库变更同步更新 `doc-server-db`
- Go 代码使用 `gofmt`
- TypeScript/React 代码使用 ESLint 和 Prettier
- 不提交密钥、本地数据库文件或构建产物

## 许可证

UNLICENSED
