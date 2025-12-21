# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个个人工具集合管理平台，基于 Monorepo 架构的全栈应用，使用 Yarn Workspaces 管理。项目包含一个基于 React/UmiJS 的前端管理面板和一个 NestJS 后端 API 服务。

### 项目结构

```
zxm-toolkit-admin/
├── apps/
│   ├── admin/          # 前端管理后台 (UmiJS + React + Ant Design)
│   └── server/         # 后端 API 服务 (NestJS + TypeScript + SQLite)
├── packages/
│   ├── http-client/    # HTTP 客户端共享包
│   └── shared-components/ # 共享组件包
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

# 启动后端开发服务器（端口 8010）
yarn dev:server

# 或分别在各自目录启动：
cd apps/admin && yarn dev        # 前端访问：http://localhost:8008
cd apps/server && yarn start:dev # 后端 API：http://localhost:8010/api
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

## 核心功能模块

### 1. 车辆轨迹管理 (Vehicle Track)
**路径**: `apps/server/src/modules/vehicle-track/`, `apps/admin/src/pages/vehicle-track/`

**功能概述**:
- 车辆轨迹数据的同步、查询和坐标转换
- 支持从外部 API（途强）同步轨迹数据
- 支持百度坐标系(BD-09)到高德坐标系(GCJ-02)的批量转换
- 提供轨迹数据的分页查询和时间范围筛选

**关键特性**:
- 数据同步：支持指定时间范围的轨迹数据批量同步
- 坐标转换：批量将 BD-09 坐标转换为 GCJ-02 坐标
- 数据查询：支持分页、时间筛选和缺失坐标筛选
- 延迟加载：Tab 组件按需加载数据，提升性能

**API 端点**:
- `GET /api/vehicle-track` - 查询轨迹数据列表
- `POST /api/vehicle-track/sync` - 同步轨迹数据
- `POST /api/vehicle-track/convert-gcj02` - 批量转换 GCJ-02 坐标

**坐标系支持**:
- BD-09：百度地图坐标系（原始数据）
- GCJ-02：高德地图坐标系（通过转换获得）

### 2. 车辆行程管理 (Vehicle Trip)
**路径**: `apps/server/src/modules/vehicle-trip/`, `apps/admin/src/pages/vehicle-trip/`

**功能概述**:
- 车辆行程数据的同步和管理
- 支持从外部 API 同步行程数据

### 3. 通用配置管理 (Common Config)
**路径**: `apps/server/src/modules/common-config/`, `apps/admin/src/pages/common-config/`

**功能概述**:
- 系统配置的增删改查管理
- 支持配置项的启用/禁用状态管理
- 支持排序和分类管理

**重要配置项**:
- `TuQiangToken`：途强 API 访问令牌
- `BaiduMapApiKey`：百度地图 API 密钥（用于坐标转换）

### 4. 用户认证系统 (Authentication)
**路径**: `apps/server/src/modules/auth/`, `apps/admin/src/pages/login/`

**功能概述**:
- 基于 JWT 的身份认证
- 用户登录和权限管理
- HTTP-only Cookie 存储 Token

## 架构概览

### 前端 (apps/admin)
- **框架**: UmiJS 4.x + React 19
- **UI 组件库**: Ant Design 5.x
- **状态管理**: SWR 用于数据获取
- **构建工具**: Mako 极速构建
- **样式**: Less + CSS-in-JS

**主要目录**:
- `src/pages/`: 页面组件（车辆轨迹、车辆行程、通用配置等）
- `src/components/`: 可复用组件
- `src/services/`: API 服务函数
- `src/utils/`: 工具函数
- `src/types/`: TypeScript 类型定义
- `src/hooks/`: 自定义 React Hooks
- `config/`: UmiJS 配置，包括代理设置

### 后端 (apps/server)
- **框架**: NestJS 11.x + TypeScript
- **数据库**: SQLite3 (better-sqlite3 驱动)
- **ORM**: TypeORM 0.3.x
- **认证**: JWT 认证
- **API 文档**: Swagger/OpenAPI（仅开发环境）

**主要目录**:
- `src/modules/`: 业务模块（vehicle-track、vehicle-trip、common-config、auth、login、demo）
- `src/common/`: 公共模块（auth、guards、decorators 等）
- `src/config/`: 配置文件
- `src/types/`: 类型定义

### HTTP 客户端包 (packages/http-client)
- 提供统一的 API 调用接口
- 包含所有后端 API 的类型定义
- 提供自定义 React Hooks 用于数据获取
- 支持车辆轨迹、车辆行程、通用配置等模块的 API 调用

### 共享组件包 (packages/shared-components)
- 提供跨项目的可复用 React 组件
- 包含轨迹地图显示组件
- 支持多种坐标系的地图展示

## 坐标系统

### 支持的坐标系
1. **BD-09 (百度坐标系)**：外部 API 提供的原始坐标
2. **GCJ-02 (高德坐标系)**：通过百度地图 API 转换获得

### 坐标转换流程
1. 数据同步时保存 BD-09 坐标
2. 通过坐标转换功能批量转换为 GCJ-02 坐标
3. 地图显示时根据需要选择合适的坐标系

## 环境配置

### 数据库配置
1. 复制环境文件：
```bash
cd apps/server && cp env.example .env
```

2. 配置 `.env` 文件：
   - 数据库文件路径（默认：`data/app.db`）
   - JWT 密钥（生产环境必须修改）
   - 管理员账号密码
   - CORS 设置

### API 配置
- 途强 Token：用于车辆轨迹数据同步
- 百度地图 API Key：用于坐标转换

### API 文档
- 开发环境：http://localhost:8010/docs
- API 接口地址：http://localhost:8010/api

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
- 模块化设计，功能相关的代码放在同一目录

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

### 主要数据表
- `vehicle_track`：车辆轨迹数据
- `vehicle_trip`：车辆行程数据
- `common_configs`：通用配置数据
- `demo`：演示数据

## 认证系统

- 基于 JWT 的身份认证
- Token 存储在 HTTP-only Cookie 中
- 默认管理员账号可通过环境变量配置
- JWT 默认 7 天过期（可配置）

## 外部 API 集成

### 途强 API
- 用于车辆轨迹数据同步
- 需要配置有效的 Token
- 支持指定时间范围的数据同步

### 百度地图 API
- 用于坐标系转换
- 支持 BD-09 到 GCJ-02 的转换
- 需要配置有效的 API Key

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
- 确保所有外部 API 密钥已正确配置


## 项目特色

1. **模块化架构**：采用 Monorepo 架构，前后端分离，共享 HTTP 客户端
2. **坐标系统管理**：专业的坐标转换和数据管理功能
3. **高性能构建**：前端使用 Mako 构建工具，构建速度快
4. **类型安全**：全栈 TypeScript，严格的类型检查
5. **延迟加载**：前端组件按需加载，优化性能
6. **RESTful API**：标准的 REST API 设计，易于集成

## 联系方式

如有问题或建议，请通过项目仓库进行反馈。