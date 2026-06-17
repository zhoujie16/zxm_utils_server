# Repository Guidelines

本文件是 Codex 在本仓库工作的主要上下文与执行规范。交互默认使用中文；只实现当前需求必要的功能；不要自动提交 Git，除非用户明确要求。

## 项目结构与模块组织

本仓库是 Yarn workspaces monorepo。前端应用位于 `apps/admin`（Umi/Max 管理端）和 `apps/client`（Vite React 移动端）。后端服务位于 `apps/server`（Go + Gin API）。共享 TypeScript 包位于 `packages/http-client` 和 `packages/shared-components`。接口与数据库文档分别维护在 `doc-server-api`、`doc-server-db`。

前端 workspace 的源码主要在 `src` 目录。Go 服务入口是 `apps/server/cmd/server/main.go`，业务逻辑在 `internal/service`，HTTP handler 在 `internal/http/handler`，模型在 `internal/model`。

主要业务模块：

- 车辆轨迹管理：`apps/server/internal/service/vehicle_track_service.go`、`apps/server/internal/http/handler/vehicle_track_handler.go`、`apps/admin/src/pages/vehicle-track/`
- 车辆行程管理：`apps/server/internal/service/vehicle_trip_service.go`、`apps/server/internal/http/handler/vehicle_trip_handler.go`、`apps/admin/src/pages/vehicle-trip/`
- 通用配置管理：`apps/server/internal/service/common_config_service.go`、`apps/server/internal/http/handler/common_config_handler.go`、`apps/admin/src/pages/common-config/`
- 用户认证系统：`apps/server/internal/service/auth_service.go`、`apps/server/internal/http/handler/auth_handler.go`、`apps/admin/src/pages/login/`

## 构建、测试与开发命令

除 Go 服务外，优先在仓库根目录使用 Yarn 1。

- `yarn install`：安装前端 workspace 依赖。
- `yarn dev`：同时启动 Go 后端、管理端和移动端。
- `yarn dev:admin`：启动管理端，默认端口 `8008`。
- `yarn dev:client`：启动 Vite 移动端。
- `yarn dev:server`：本地运行 Go 服务。
- `yarn build`：构建管理端、移动端并交叉编译 Go 服务。
- `yarn client:build`、`yarn admin:build`：构建单个前端 workspace。
- `yarn server:build`：交叉编译 Go 二进制到 `apps/server/dist`。
- `cd apps/server && go test ./...`：运行 Go 测试。
- `yarn format`：格式化前端与文档。

## 代码风格与命名规范

TypeScript 与 React 使用 ESLint 和 Prettier。可在根目录执行 `yarn format`，或运行对应 workspace 脚本。TS/TSX/JSON/Markdown 使用 2 空格缩进。React 组件使用 PascalCase，函数与 hooks 使用 camelCase，组件样式优先与组件同目录放置为 `index.less`。

Go 代码使用 `gofmt` 格式化；包名保持简短小写。新增代码应遵循现有 `internal/model`、`internal/service`、`internal/repository`、`internal/http`、`pkg/*` 分层。

通用编码要求：

- 类型定义（接口）名称统一以大写字母 `I` 开头，例如 `IUserData`。
- 优先使用函数组件、Hooks、纯函数和不可变数据结构。
- 页面组件和 UI 组件保持单一职责，使用组件组合，逻辑与 UI 分离。
- 变量、函数和组件名称应具有自解释性。
- 关键逻辑、复杂算法或重要业务分支添加简明注释。
- 每个文件顶部保留文件说明注释；新增文件也应遵循该约定，但不要添加 `@author` 字段。
- 单个代码文件原则上不超过 300 行，超出时优先拆分。

## 前端规范

### Admin（`apps/admin`）

- 使用函数组件 + Hooks，避免类组件。
- 本地状态使用 `useState`，全局状态使用 UmiJS Model，服务器状态使用 SWR。
- 表格必须指定 `rowKey`，提供 `loading` 状态，配置分页和必要的横向滚动。
- 表单优先使用 `vertical` 布局。
- 不使用 ProComponents，不使用 `PageContainer`。
- 图表组件统一使用 `recharts`，图标优先使用 `lucide-react`，也可按需使用 `@ant-design/icons`。
- 样式优先使用 Less，组件样式与组件文件同级。

### Client（`apps/client`）

- 移动端优先，确保移动端布局与交互可用。
- 使用 React Router 7.x 管理路由，按需使用 `lazy` 和 `Suspense`。
- Client 以自定义 UI 为主，Ant Design Mobile 仅作为基础组件补充。
- Ant Design Mobile 推荐只用于 `Toast`、`Dialog`、`Picker`、`DatePicker`、`ImagePreview` 等复杂交互。
- 图标统一优先使用 `lucide-react`。
- 本地持久化优先使用 LocalForage。

### 前端样式

- BEM 命名使用 `.block`、`.block__element`、`.block--modifier`。
- 最外层 class 尽量唯一，避免跨组件样式污染。
- 避免过深 DOM 嵌套，建议不超过 5 层。
- 保持选择器简单，避免复杂嵌套。

## 后端规范

- 按现有分层组织代码：`handler -> service -> repository -> model`。
- HTTP 相关逻辑放在 `internal/http`，业务逻辑放在 `internal/service`，数据访问放在 `internal/repository`。
- 外部输入在 handler 层完成基础解析和校验，复杂业务校验放在 service 层。
- 成功响应直接返回业务数据，错误响应使用 `{ "message": "..." }`。
- 分页接口支持 `page`、`limit`，分页结果返回 `data` 和 `pagination`。
- 列表查询需要明确排序规则，复杂查询优先封装在 repository。
- 表结构使用 `internal/model` 中的 GORM model 定义，需要查询的字段添加索引。
- 需要认证的接口必须挂载 JWT 中间件。

## 测试规范

每次修改完成后不要自动启动项目、开发服务或测试命令；仅在用户明确要求时运行。需要验证时，先说明建议执行的命令与原因，等待用户确认。Go 后端常用测试命令为 `cd apps/server && go test ./...`。前端测试覆盖较少，UI 改动可按需通过 lint/build 和手动验证。

## 提交与 PR 规范

近期提交使用 Conventional Commit 前缀，如 `feat:`、`fix:`、`refactor:`。提交信息应简洁，并保持中文或英文风格一致。示例：`feat: 新增车辆轨迹同步`、`fix: handle login token expiry`。

PR 应包含简短说明、影响的 app/package、已运行的测试命令。涉及 UI 的改动需附截图或录屏；涉及接口行为变化时，链接相关 issue 或文档。

## 安全与配置提示

不要提交密钥、本地数据库文件或构建产物。接口变更同步更新 `doc-server-api`，数据库变更同步更新 `doc-server-db`。环境相关服务配置应放在配置文件或环境变量中，不要硬编码到共享包。

Go 服务配置文件：`apps/server/config/config.yaml`。常用环境变量包括 `PORT`、`API_PREFIX`、`CORS_ORIGIN`、`JWT_SECRET`、`JWT_EXPIRES_IN`、`ADMIN_USERNAME`、`ADMIN_PASSWORD`、`SQLITE_DATABASE`、`SQLITE_SYNCHRONIZE`、`SQLITE_LOGGING`。
