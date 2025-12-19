# @zxm-toolkit/http-client

统一的 HTTP 请求客户端、API 服务和 useSWR Hooks，供 admin 和 client 项目使用。

## 📦 安装

由于这是一个 monorepo 内部的共享包，无需单独安装。在 `apps/admin` 或 `apps/client` 项目中直接引用即可。

## 🚀 快速开始

### 1. 初始化 HTTP 客户端

在应用启动时初始化 HTTP 客户端配置：

```typescript
import { initHttpClient, type IHttpError } from '@zxm-toolkit/http-client';

// 初始化配置
// baseURL、timeout、tokenKey、loginPath 已封装到内部，使用默认值
initHttpClient({
  onError: (error: IHttpError) => {
    console.error('请求错误:', error.message);
  },
  onUnauthorized: () => {
    // 自定义 401 处理逻辑
    console.log('未授权，需要重新登录');
  },
});
```

> **注意**：`baseURL`（默认：`/api`）、`timeout`（默认：`10000`）、`tokenKey`（默认：`token`）、`loginPath`（默认：`/login`）已封装到内部，无需配置。

### 2. 使用 API 服务方法

```typescript
import { loginApi, getTrackList, getTripList, getConfigList } from '@zxm-toolkit/http-client';

// 登录
const loginResult = await loginApi({ username: 'admin', password: '123456' });

// 获取车辆轨迹列表
const trackList = await getTrackList({ page: 1, limit: 10 });

// 获取车辆行程列表
const tripList = await getTripList({ page: 1, limit: 10 });

// 获取配置列表
const configList = await getConfigList();
```

### 3. 使用 useSWR Hooks

```typescript
import { useTrackList, useTripList, useConfigList } from '@zxm-toolkit/http-client';

function MyComponent() {
  // 使用车辆轨迹列表 Hook
  const { data, isLoading, error, refresh, setPage, setLimit } = useTrackList(1, 10);

  // 使用车辆行程列表 Hook
  const { data: tripData, isLoading: tripLoading } = useTripList(1, 10);

  // 使用配置列表 Hook
  const { data: configData } = useConfigList();

  return (
    <div>
      {/* 渲染数据 */}
    </div>
  );
}
```

## 📚 API 文档

### HTTP 客户端配置

#### 配置选项

`IHttpClientConfig` 接口支持以下配置：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `headers` | `Record<string, string>` | `{ 'Content-Type': 'application/json' }` | 默认请求头 |
| `onError` | `(error: IHttpError) => void` | `undefined` | 自定义错误处理函数 |
| `onUnauthorized` | `() => void` | `undefined` | 自定义 401 处理函数 |

> **注意**：以下参数已封装到内部，使用默认值，无需配置：
> - `baseURL`: `/api` - API 基础 URL
> - `timeout`: `10000` - 请求超时时间（毫秒）
> - `tokenKey`: `token` - Token 在 localStorage 中的键名
> - `loginPath`: `/login` - 401 错误时的跳转路径

### HTTP 客户端

#### 基础请求方法

```typescript
import { get, post, put, patch, del } from '@zxm-toolkit/http-client';

// GET 请求
const data = await get('/api/users');

// POST 请求
const result = await post('/api/users', { name: 'John' });

// PUT 请求
const updated = await put('/api/users/1', { name: 'Jane' });

// PATCH 请求
const patched = await patch('/api/users/1', { age: 31 });

// DELETE 请求
await del('/api/users/1');
```

### API 服务

#### 认证服务

```typescript
import { loginApi } from '@zxm-toolkit/http-client';

// 登录
const result = await loginApi({
  username: 'admin',
  password: '123456',
  remember: true,
});
```

#### 车辆轨迹服务

```typescript
import { getTrackList, syncTrackData } from '@zxm-toolkit/http-client';

// 获取车辆轨迹列表
const trackList = await getTrackList({
  page: 1,
  limit: 10,
  startTime: 1609459200000,
  endTime: 1612137600000,
});

// 同步车辆轨迹数据
const syncResult = await syncTrackData({
  startTime: '2024-01-01 00:00:00',
  endTime: '2024-01-31 23:59:59',
});
```

#### 车辆行程服务

```typescript
import { getTripList, syncTripData } from '@zxm-toolkit/http-client';

// 获取车辆行程列表
const tripList = await getTripList({
  page: 1,
  limit: 10,
  startTime: 1609459200000,
  endTime: 1612137600000,
});

// 同步车辆行程数据
const syncResult = await syncTripData({
  month: '2024-01',
});
```

#### 公共配置服务

```typescript
import {
  getConfigList,
  getConfigByKey,
  createConfig,
  updateConfig,
  deleteConfig,
} from '@zxm-toolkit/http-client';

// 获取所有配置
const configList = await getConfigList();

// 根据键获取配置
const config = await getConfigByKey('app.name');

// 创建配置
const newConfig = await createConfig({
  configKey: 'app.name',
  configValue: 'My App',
  description: '应用名称',
});

// 更新配置
const updatedConfig = await updateConfig(1, {
  configValue: 'Updated App Name',
});

// 删除配置
await deleteConfig(1);
```

### useSWR Hooks

#### useApi - 通用 Hook

```typescript
import { useApi } from '@zxm-toolkit/http-client';

function MyComponent() {
  // 简单用法
  const { data, isLoading, error } = useApi('/api/users');

  // 带参数用法
  const { data: userData } = useApi(['/api/users', { page: 1, limit: 10 }]);

  // 自定义配置
  const { data: customData } = useApi('/api/users', {
    revalidateOnFocus: true,
    refreshInterval: 5000,
  });

  return <div>{/* 渲染数据 */}</div>;
}
```

#### useTrackList - 车辆轨迹列表 Hook

```typescript
import { useTrackList } from '@zxm-toolkit/http-client';

function TrackListComponent() {
  const {
    data,           // 轨迹列表数据
    isLoading,      // 加载状态
    error,          // 错误信息
    refresh,        // 刷新函数
    page,           // 当前页码
    limit,          // 每页数量
    startTime,      // 开始时间
    endTime,        // 结束时间
    setPage,        // 设置页码
    setLimit,       // 设置每页数量
    setTimeRange,   // 设置时间范围
    queryParams,    // 查询参数
  } = useTrackList(1, 10);

  // 设置时间范围（会自动重置到第一页）
  const handleTimeRangeChange = (start: number, end: number) => {
    setTimeRange(start, end);
  };

  return (
    <div>
      {/* 渲染列表 */}
    </div>
  );
}
```

#### useTripList - 车辆行程列表 Hook

```typescript
import { useTripList } from '@zxm-toolkit/http-client';

function TripListComponent() {
  const {
    data,
    isLoading,
    error,
    refresh,
    page,
    limit,
    startTime,
    endTime,
    setPage,
    setLimit,
    setTimeRange,
  } = useTripList(1, 10);

  return (
    <div>
      {/* 渲染列表 */}
    </div>
  );
}
```

#### useConfigList - 配置列表 Hook

```typescript
import { useConfigList } from '@zxm-toolkit/http-client';

function ConfigListComponent() {
  const { data, isLoading, error, refresh } = useConfigList();

  return (
    <div>
      {/* 渲染配置列表 */}
    </div>
  );
}
```

## 🔧 在 Admin 项目中使用

### 1. 初始化配置

在 `apps/admin/src/app.tsx` 中初始化：

```typescript
import { initHttpClient, type IHttpError } from '@zxm-toolkit/http-client';
import { history } from '@umijs/max';
import { message } from 'antd';

// 在应用启动时初始化
// baseURL、tokenKey、loginPath 已封装到内部，使用默认值
initHttpClient({
  onError: (error: IHttpError) => {
    if (error.code >= 500) {
      message.error('服务器错误，请稍后重试');
    } else if (error.code === 403) {
      message.error('没有权限访问该资源');
    } else if (error.code === 404) {
      message.error('请求的资源不存在');
    }
  },
  onUnauthorized: () => {
    message.error('登录已过期，请重新登录');
    setTimeout(() => {
      if (window.location.pathname !== '/login') {
        history.push('/login');
      }
    }, 1000);
  },
});
```

### 2. 替换现有的 API 调用

**之前（使用 UmiJS request）：**

```typescript
import { request } from '@umijs/max';

export async function loginApi(data: ILoginFormData): Promise<ILoginResponse> {
  return request('/api/auth/login', {
    method: 'POST',
    data,
  });
}
```

**之后（使用 http-client）：**

```typescript
import { loginApi } from '@zxm-toolkit/http-client';

// 直接使用，无需重新定义
const result = await loginApi({ username: 'admin', password: '123456' });
```

### 3. 替换现有的 useSWR 使用

**之前（自定义 Hook）：**

```typescript
import useSWR from 'swr';
import { getTrackList } from '@/services/vehicle-track';

const { data, error, isLoading } = useSWR(
  ['/api/vehicle-track', queryParams],
  ([, params]) => getTrackList(params),
);
```

**之后（使用封装好的 Hook）：**

```typescript
import { useTrackList } from '@zxm-toolkit/http-client';

const { data, isLoading, error, refresh, setPage, setLimit } = useTrackList(1, 10);
```

## 📱 在 Client 项目中使用

### 1. 初始化配置

在 `apps/client/src/main.tsx` 中初始化：

```typescript
import { initHttpClient, type IHttpError } from '@zxm-toolkit/http-client';

// 初始化配置
// baseURL、timeout、tokenKey、loginPath 已封装到内部，使用默认值
initHttpClient({
  onError: (error: IHttpError) => {
    // 可以集成 Toast 组件显示错误
    console.error('请求错误:', error.message);
  },
});
```

### 2. 替换现有的 API 调用

**之前（使用自定义 api.ts）：**

```typescript
import { post } from '@/services/api';

export async function loginApi(data: ILoginFormData): Promise<ILoginResponse> {
  return post<ILoginResponse>('/auth/login', data);
}
```

**之后（使用 http-client）：**

```typescript
import { loginApi } from '@zxm-toolkit/http-client';

// 直接使用
const result = await loginApi({ username: 'admin', password: '123456' });
```

### 3. 使用 useSWR Hooks

```typescript
import { useTrackList } from '@zxm-toolkit/http-client';

function TrackPage() {
  const { data, isLoading, error, refresh } = useTrackList(1, 10);

  return (
    <div>
      {/* 渲染数据 */}
    </div>
  );
}
```

## 🎯 类型定义

所有类型定义都可以从包中导入：

```typescript
import type {
  // HTTP 客户端类型
  IHttpClientConfig,
  IRequestConfig,
  IHttpError,
  // API 类型
  ILoginFormData,
  ILoginResponse,
  IQueryTrackParams,
  ITrackListResponse,
  IQueryTripParams,
  ITripListResponse,
  ICommonConfig,
  // Hook 类型
  IUseTrackListReturn,
  IUseTripListReturn,
  IUseConfigListReturn,
} from '@zxm-toolkit/http-client';
```

## 🔐 Token 管理

HTTP 客户端会自动从 `localStorage` 读取 token（默认键名：`token`），并在请求头中添加 `Authorization: Bearer <token>`。

当收到 401 响应时，会自动清除 token 并跳转到登录页（默认路径：`/login`）。

> **注意**：token 键名和登录路径已封装到内部，使用默认值。如需自定义 401 处理逻辑，可通过 `onUnauthorized` 回调函数实现。

## 📦 构建

```bash
# 构建 http-client 包
cd packages/http-client
yarn build
```

构建产物位于 `dist/` 目录：
- `dist/index.js` - 编译后的 JavaScript 文件
- `dist/index.d.ts` - TypeScript 类型定义文件

## 🎯 最佳实践

1. **统一初始化**：在应用启动时统一初始化 HTTP 客户端配置
2. **类型安全**：使用 TypeScript 泛型指定响应数据类型
3. **错误处理**：配置 `onError` 回调统一处理错误
4. **Token 管理**：使用默认的 token 管理机制（token 键名：`token`，登录路径：`/login`），或通过 `onUnauthorized` 自定义 401 处理逻辑
5. **使用 Hooks**：优先使用封装好的 Hooks，减少重复代码
6. **API 服务**：直接使用封装好的 API 服务方法，无需重复定义
7. **配置简化**：`baseURL`、`timeout`、`tokenKey`、`loginPath` 已封装到内部，无需配置，直接使用默认值即可

## 📄 许可证

私有项目，仅供内部使用。

