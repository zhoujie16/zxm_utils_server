# Admin App Guidelines

本文件适用于 `apps/admin`。除本文件外，仍需遵循仓库根目录 `AGENTS.md`。

## 技术栈

- Umi/Max 4.x
- React 19
- Ant Design 5.x
- SWR
- Less

## 常用命令

- 在仓库根目录运行 `yarn dev:admin` 启动管理端，默认端口 `8008`。
- 在仓库根目录运行 `yarn admin:build` 构建管理端。
- 在 `apps/admin` 内运行 `yarn tsc` 或 `yarn lint` 做类型检查。
- 在 `apps/admin` 内运行 `yarn format` 格式化本 app。

## 目录约定

- 页面放在 `src/pages`。
- 通用组件放在 `src/components`。
- 常量放在 `src/constants`。
- 类型放在 `src/types`。
- 工具函数放在 `src/utils`。
- 组件目录优先使用 `index.tsx`，有样式时同级放置 `index.less`。

## 开发规范

- 使用函数组件和 Hooks，避免类组件。
- 组件使用 PascalCase，函数与 hooks 使用 camelCase。
- Props 和业务接口类型使用 `I` 前缀。
- 本地状态使用 `useState`，全局状态使用 UmiJS Model，服务器状态使用 SWR。
- 表格必须指定 `rowKey`，提供 `loading` 状态，并配置分页。
- 表单优先使用 `vertical` 布局。
- 图标优先使用 `lucide-react`，按需使用 `@ant-design/icons`。
- 图表统一使用 `recharts`。
- 不使用 ProComponents；如需页面框架，优先使用项目已有轻量组件。
- 接口变更时同步更新 `doc-server-api`。
