# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个基于 Monorepo 架构的全栈管理应用，使用 Yarn Workspaces 管理。项目包含一个基于 React/UmiJS 的前端管理面板和一个 NestJS 后端 API 服务。

### 项目结构

```
zxm-admin-app/
├── apps/
│   ├── admin/          # 前端管理后台 (UmiJS + React + Ant Design)
│   └── server/         # 后端 API 服务 (NestJS + TypeScript + SQLite)
├── doc-server-api/     # API 接口文档
├── .cursor/rules/      # 开发规范和约定
└── package.json        # 根配置文件 (Yarn Workspaces)
```

## 常用开发命令

### 安装依赖
```bash
# 安装所有依赖（在根目录执行）
yarn install
```

### 开发环境
```bash
# 启动前端开发服务器（端口 8008）
yarn dev:admin

# 启动后端开发服务器（端口 7031）
yarn dev:server

# 或分别在各自目录启动：
cd apps/admin && yarn dev        # 前端访问：http://localhost:8008
cd apps/server && yarn start:dev # 后端 API：http://localhost:7031/api
```

### 构建打包
```bash
# 构建前端生产版本
yarn admin:build

# 构建后端生产版本
yarn server:build
```

### 测试
```bash
# 后端单元测试
cd apps/server && yarn test

# 后端端到端测试
cd apps/server && yarn test:e2e

# 前端类型检查
cd apps/admin && yarn tsc
```

### 代码质量
```bash
# 格式化所有代码
yarn format

# 后端代码检查
cd apps/server && yarn lint
```

## 架构概览

### 前端 (apps/admin)
- **框架**: UmiJS 4.x + React 19
- **UI 组件库**: Ant Design 5.x
- **状态管理**: SWR 用于数据获取
- **构建工具**: Mako 极速构建
- **样式**: Less + CSS-in-JS

主要目录：
- `src/pages/`: 页面组件
- `src/components/`: 可复用组件
- `src/services/`: API 服务函数
- `src/utils/`: 工具函数
- `src/types/`: TypeScript 类型定义
- `config/`: UmiJS 配置，包括代理设置

### 后端 (apps/server)
- **框架**: NestJS 11.x + TypeScript
- **数据库**: SQLite3 (better-sqlite3 驱动)
- **ORM**: TypeORM 0.3.x
- **认证**: JWT 认证
- **API 文档**: Swagger/OpenAPI（仅开发环境）

主要目录：
- `src/modules/`: 业务模块（demo、login 等）
- `src/common/`: 公共模块（auth、guards 等）
- `src/config/`: 配置文件
- `src/types/`: 类型定义

### 环境配置

1. 复制环境文件：
```bash
cd apps/server && cp env.example .env
```

2. 配置 `.env` 文件：
   - 数据库文件路径（默认：`data/app.db`）
   - JWT 密钥（生产环境必须修改）
   - 管理员账号密码
   - CORS 设置

### API 文档
- 开发环境：http://localhost:7031/docs
- API 接口地址：http://localhost:7031/api

## 开发规范

基于 `.cursor/rules/` 目录中的规范：

### 通用规范
- **交流语言**：全程使用中文进行交流和注释
- **修改流程**：对代码进行修改前，必须先暂停操作，用条理化的方式描述方案，等待明确确认后才能实施
- **需求实现**：只实现当前需求必要的功能
- **兼容性**：不需要写兼容性强的代码，除非特别要求

### 代码规范
- **注释规范**：在关键逻辑、复杂算法或重要部分添加简明中文注释，解释代码的作用和意图
- **命名规范**：
  - 变量、函数等名称必须具有自解释性
  - 类型定义（接口）名称统一以大写字母 "I" 开头（例如 `IUserData`）
- **编程范式**：
  - 遵循函数式编程范式
  - 优先使用纯函数和不可变数据结构
- **组件设计原则**：
  - 页面组件和 UI 组件保持单一职责
  - 使用组件组合而非继承
  - 逻辑与 UI 分离

### 文件组织规范
- 每个文件顶部必须包含文件说明注释
- 单个代码文件不应超过 300 行，超出应进行拆分

### 版本控制规范
- 不要自动提交 Git，除非特别要求
- 若涉及 Git 提交，务必遵循标准的提交消息规范
- 提交信息应简短、清晰且符合约定

### 工作流程
1. 修改前先描述方案，等待确认
2. 仅实现当前必要功能
3. 修改结束后生成最终总结，不生成中间过程文档
4. 除非要求，否则不自动提交 Git

## 数据库

- SQLite 数据库存储在 `apps/server/data/` 目录
- TypeORM 实体定义数据结构
- 开发环境 `SQLITE_SYNCHRONIZE=true` 自动同步结构
- 生产环境设置 `SQLITE_SYNCHRONIZE=false` 并使用迁移

## 认证系统

- 基于 JWT 的身份认证
- Token 存储在 HTTP-only Cookie 中
- 默认管理员账号可通过环境变量配置
- JWT 默认 7 天过期（可配置）

## 测试

- 后端使用 Jest 进行单元测试和 e2e 测试
- 测试文件遵循 `*.spec.ts` 模式
- 前端测试配置存在但需要完善实现

## 生产部署

- 设置 `NODE_ENV=production`
- 禁用数据库同步：`SQLITE_SYNCHRONIZE=false`
- 使用强 JWT 密钥
- 配置正确的 CORS 来源
- API 文档在生产环境自动禁用