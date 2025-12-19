/**
 * @fileoverview 车辆轨迹工具函数
 * @author Claude
 * @created 2024-01-01
 */

import { LatLngBounds } from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import type { IVehicleTrack } from '../types/vehicle-track';

/**
 * 格式化时间戳为可读时间
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的时间字符串
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('zh-CN');
};

/**
 * 将轨迹数据转换为地图坐标数组
 * @param trackData 轨迹数据数组
 * @returns 地图坐标数组
 */
export const convertTrackToPositions = (trackData: IVehicleTrack[]): LatLngExpression[] => {
  return trackData
    .filter((item) => item.lat && item.lng)
    .map((item) => [item.lat, item.lng] as LatLngExpression);
};

/**
 * 计算地图边界
 * @param positions 地图坐标数组
 * @returns 地图边界对象，如果为空则返回 null
 */
export const calculateMapBounds = (positions: LatLngExpression[]): LatLngBounds | null => {
  if (positions.length === 0) {
    return null;
  }

  const bounds = new LatLngBounds(
    positions.map((pos) => pos as [number, number]),
  );
  return bounds;
};

