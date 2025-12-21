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
 * 将火星坐标系（GCJ-02）转换为WGS84坐标系
 * 
 * 注意：算法转换存在精度限制，通常会有1-5米的误差，这是正常现象。
 * 如果需要更高精度，建议使用专业的坐标转换API。
 * 
 * @param gcjLat GCJ-02纬度
 * @param gcjLng GCJ-02经度
 * @returns [WGS84纬度, WGS84经度]
 */
export const gcj02ToWgs84 = (gcjLat: number, gcjLng: number): [number, number] => {
  const a = 6378245.0; // 长半轴
  const ee = 0.00669342162296594323; // 偏心率平方
  
  let dLat = transformLat(gcjLng - 105.0, gcjLat - 35.0);
  let dLng = transformLng(gcjLng - 105.0, gcjLat - 35.0);
  const radLat = (gcjLat / 180.0) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  const wgsLat = gcjLat - dLat;
  const wgsLng = gcjLng - dLng;
  return [wgsLat, wgsLng];
};

/**
 * 纬度转换辅助函数
 */
const transformLat = (lng: number, lat: number): number => {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0) / 3.0;
  return ret;
};

/**
 * 经度转换辅助函数
 */
const transformLng = (lng: number, lat: number): number => {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0) / 3.0;
  return ret;
};

/**
 * 将轨迹数据转换为地图坐标数组（优先使用GCJ-02坐标，否则自动转换百度坐标系为火星坐标系）
 * @param trackData 轨迹数据数组
 * @returns 地图坐标数组（火星坐标系 GCJ-02）
 */
export const convertTrackToPositions = (trackData: IVehicleTrack[]): LatLngExpression[] => {
  return trackData
    .filter((item) => {
      // 优先检查GCJ-02坐标，如果没有则检查百度坐标
      if (item.lat_gcj02 !== null && item.lat_gcj02 !== undefined && 
          item.lng_gcj02 !== null && item.lng_gcj02 !== undefined) {
        return true;
      }
      return item.lat && item.lng;
    })
    .map((item) => {
      // 优先使用GCJ-02坐标，如果没有则转换百度坐标系
      if (item.lat_gcj02 !== null && item.lat_gcj02 !== undefined && 
          item.lng_gcj02 !== null && item.lng_gcj02 !== undefined) {
        return [item.lat_gcj02, item.lng_gcj02] as LatLngExpression;
      }
      // 回退：将百度坐标系转换为火星坐标系
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

