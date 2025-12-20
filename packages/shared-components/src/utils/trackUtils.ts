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
 * 将百度坐标系（BD-09）转换为火星坐标系（GCJ-02）
 * 
 * 注意：由于BD-09坐标系在GCJ-02基础上进行了二次加密，算法转换存在精度限制，
 * 通常会有10-30米的误差，这是正常现象。如果需要更高精度，建议：
 * 1. 使用百度坐标转换API（需要百度API密钥）
 * 2. 针对特定区域建立误差校正模型
 * 
 * @param bdLat 百度纬度
 * @param bdLng 百度经度
 * @returns [GCJ-02纬度, GCJ-02经度]
 */
export const bd09ToGcj02 = (bdLat: number, bdLng: number): [number, number] => {
  const x = bdLng - 0.0065;
  const y = bdLat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI / 180.0);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI / 180.0);
  const gcjLng = z * Math.cos(theta);
  const gcjLat = z * Math.sin(theta);
  return [gcjLat, gcjLng];
};

/**
 * 将轨迹数据转换为地图坐标数组（自动转换百度坐标系为火星坐标系）
 * @param trackData 轨迹数据数组（百度坐标系 BD-09）
 * @returns 地图坐标数组（火星坐标系 GCJ-02）
 */
export const convertTrackToPositions = (trackData: IVehicleTrack[]): LatLngExpression[] => {
  return trackData
    .filter((item) => item.lat && item.lng)
    .map((item) => {
      // 将百度坐标系转换为火星坐标系
      const [gcjLat, gcjLng] = bd09ToGcj02(item.lat, item.lng);
      return [gcjLat, gcjLng] as LatLngExpression;
    });
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

