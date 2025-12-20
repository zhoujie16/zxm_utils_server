/**
 * @fileoverview 共享组件包入口文件
 * @author Claude
 * @created 2024-01-01
 */

// 导出组件
export { default as TrackMap } from './components/TrackMap';
export type { ITrackMapProps, MapProvider, MapViewType } from './components/TrackMap';

// 导出类型
export type { IVehicleTrack } from './types/vehicle-track';

// 导出工具函数
export { formatTime, convertTrackToPositions, calculateMapBounds } from './utils/trackUtils';

// 导入 Leaflet 配置以初始化图标（副作用导入）
import './utils/leafletConfig';

