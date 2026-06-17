# Client App Guidelines

本文件适用于 `apps/client`。除本文件外，仍需遵循仓库根目录 `AGENTS.md`。

## 技术栈

- Vite
- React 19
- React Router 7.x
- Ant Design Mobile
- LocalForage
- Less

## 常用命令

- 在仓库根目录运行 `yarn dev:client` 启动移动端。
- 在仓库根目录运行 `yarn client:build` 构建移动端。
- 在 `apps/client` 内运行 `yarn lint` 做 lint 检查。
- 在 `apps/client` 内运行 `yarn format` 格式化本 app。

## 目录约定

- 页面放在 `src/pages`。
- 页面内组件优先放在对应页面目录的 `components` 下。
- 跨页面组件放在 `src/components`。
- hooks 放在 `src/hooks` 或页面内的 `hooks` 目录。
- 样式基础文件放在 `src/styles`。
- 组件目录优先使用 `index.tsx`，有样式时同级放置 `index.less`。

## 开发规范

- 移动端优先，优先保证小屏布局、触控区域和弹层体验。
- 使用函数组件和 Hooks，避免类组件。
- 组件使用 PascalCase，函数与 hooks 使用 camelCase。
- Props 和业务接口类型使用 `I` 前缀。
- 路由使用 React Router 7.x，按需使用 `lazy` 和 `Suspense`。
- Client 以自定义 UI 为主，Ant Design Mobile 只作为复杂交互补充。
- Ant Design Mobile 优先用于 `Toast`、`Dialog`、`Picker`、`DatePicker`、`ImagePreview`。
- 本地持久化优先使用 LocalForage。
- 图标优先使用 `lucide-react`。
- 接口变更时同步更新 `doc-server-api`。
