# Repository Guidelines

## 项目结构与模块组织

本仓库是 Yarn workspaces monorepo。前端应用位于 `apps/admin`（Umi/Max 管理端）和 `apps/client`（Vite React 移动端）。后端服务位于 `apps/server-go`（Go + Gin API）。共享 TypeScript 包位于 `packages/http-client` 和 `packages/shared-components`。接口与数据库文档分别维护在 `doc-server-api`、`doc-server-db`。

前端 workspace 的源码主要在 `src` 目录。Go 服务入口是 `apps/server-go/cmd/server/main.go`，业务逻辑在 `internal/service`，HTTP handler 在 `internal/http/handler`，模型在 `internal/model`。

## 构建、测试与开发命令

除 Go 服务外，优先在仓库根目录使用 Yarn 1。

- `yarn install`：安装前端 workspace 依赖。
- `yarn dev`：同时启动 Go 后端、管理端和移动端。
- `yarn dev:admin`：启动管理端，默认端口 `8008`。
- `yarn dev:client`：启动 Vite 移动端。
- `yarn dev:server`：本地运行 Go 服务。
- `yarn dev:server-go`：本地运行 Go 服务。
- `yarn build`：构建管理端、移动端并交叉编译 Go 服务。
- `yarn client:build`、`yarn admin:build`：构建单个前端 workspace。
- `yarn server:build`、`yarn server-go:build`：交叉编译 Go 二进制到 `apps/server-go/dist`。
- `cd apps/server-go && go test ./...`：运行 Go 测试。

## 代码风格与命名规范

TypeScript 与 React 使用 ESLint 和 Prettier。可在根目录执行 `yarn format`，或运行对应 workspace 脚本。TS/TSX/JSON/Markdown 使用 2 空格缩进。React 组件使用 PascalCase，函数与 hooks 使用 camelCase，组件样式优先与组件同目录放置为 `index.less`。

Go 代码使用 `gofmt` 格式化；包名保持简短小写。新增代码应遵循现有 `internal/model`、`internal/service`、`internal/http`、`pkg/*` 分层。

## 测试规范

Go 后端修改后优先运行 `cd apps/server-go && go test ./...`。前端测试覆盖较少，UI 改动需至少通过 lint/build 和手动验证。

## 提交与 PR 规范

近期提交使用 Conventional Commit 前缀，如 `feat:`、`fix:`、`refactor:`。提交信息应简洁，并保持中文或英文风格一致。示例：`feat: 新增车辆轨迹同步`、`fix: handle login token expiry`。

PR 应包含简短说明、影响的 app/package、已运行的测试命令。涉及 UI 的改动需附截图或录屏；涉及接口行为变化时，链接相关 issue 或文档。

## 安全与配置提示

不要提交密钥、本地数据库文件或构建产物。接口变更同步更新 `doc-server-api`，数据库变更同步更新 `doc-server-db`。环境相关服务配置应放在配置文件或环境变量中，不要硬编码到共享包。
