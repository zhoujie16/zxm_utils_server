# @shared-components/track-map

共享的车辆轨迹地图组件包，供 admin 和 client 项目使用。

## 安装

在项目根目录执行：

```bash
yarn install
```

## 使用

### 基础用法

```typescript
import { TrackMap } from '@shared-components/track-map';
import type { IVehicleTrack } from '@shared-components/track-map';

const trackData: IVehicleTrack[] = [
  {
    id: 1,
    lat: 31.1948,
    lng: 121.5449,
    gpsTime: 1704067200000,
    gpsSpeed: 60,
    // ... 其他字段
  },
  // ... 更多轨迹点
];

<TrackMap trackData={trackData} />
```

### 自定义样式

```typescript
<TrackMap
  trackData={trackData}
  height={800}
  lineColor="#ff0000"
  lineWeight={5}
  lineOpacity={0.9}
/>
```

### 导入类型

```typescript
import type { IVehicleTrack, ITrackMapProps } from '@shared-components/track-map';
```

### 导入工具函数

```typescript
import { formatTime, convertTrackToPositions, calculateMapBounds } from '@shared-components/track-map';
```

## API

### TrackMap 组件

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| trackData | `IVehicleTrack[]` | 必需 | 轨迹数据数组 |
| height | `number \| string` | `600` | 地图高度 |
| lineColor | `string` | `'#1890ff'` | 轨迹线颜色 |
| lineWeight | `number` | `3` | 轨迹线宽度 |
| lineOpacity | `number` | `0.8` | 轨迹线透明度 |

### 类型定义

#### IVehicleTrack

车辆轨迹数据实体类型，包含完整的轨迹点信息。

### 工具函数

- `formatTime(timestamp: number): string` - 格式化时间戳
- `convertTrackToPositions(trackData: IVehicleTrack[]): LatLngExpression[]` - 转换为地图坐标数组
- `calculateMapBounds(positions: LatLngExpression[]): LatLngBounds | null` - 计算地图边界

## 注意事项

1. 使用前需要确保已安装 `leaflet`、`react-leaflet` 和 `@types/leaflet`
2. 组件会自动导入 `leaflet/dist/leaflet.css`，无需手动导入
3. Leaflet 图标配置会在组件导入时自动初始化

