/**
 * @fileoverview 轨迹数据处理 Hook
 * @author Claude
 * @created 2024-01-01
 */

import { useMemo } from 'react';
import { LatLngBounds } from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import type { IVehicleTrack } from '../../../types/vehicle-track';
import { convertTrackToPositions, calculateMapBounds, bd09ToGcj02 } from '../../../utils/trackUtils';

/**
 * 轨迹数据处理 Hook 返回值
 */
export interface IUseTrackDataReturn {
  /** 地图坐标数组 */
  positions: LatLngExpression[];
  /** 地图边界 */
  bounds: LatLngBounds | null;
  /** 起点数据 */
  startPoint: IVehicleTrack | null;
  /** 终点数据 */
  endPoint: IVehicleTrack | null;
  /** 默认地图中心 */
  defaultCenter: [number, number];
}

/**
 * 轨迹数据处理 Hook
 * 功能：处理轨迹数据转换、边界计算、起点终点提取
 */
export const useTrackData = (trackData: IVehicleTrack[]): IUseTrackDataReturn => {
  // 安全处理轨迹数据
  const safeTrackData = trackData || [];

  // 将轨迹数据转换为地图坐标数组
  const positions = useMemo(() => {
    return convertTrackToPositions(safeTrackData);
  }, [safeTrackData]);

  // 计算地图边界
  const bounds = useMemo(() => {
    return calculateMapBounds(positions);
  }, [positions]);

  // 获取起点和终点（优先使用GCJ-02坐标，否则转换百度坐标系）
  const { startPoint, endPoint } = useMemo(() => {
    const validTrackData = safeTrackData.filter((item) => {
      if (!item) return false;
      // 优先检查GCJ-02坐标，如果没有则检查百度坐标
      if (item.lat_gcj02 !== null && item.lat_gcj02 !== undefined && 
          item.lng_gcj02 !== null && item.lng_gcj02 !== undefined) {
        return true;
      }
      return typeof item.lat === 'number' && typeof item.lng === 'number';
    });
    
    // 处理起点坐标
    const start = validTrackData.length > 0 ? (() => {
      const item = validTrackData[0];
      // 优先使用GCJ-02坐标，如果没有则转换百度坐标系
      if (item.lat_gcj02 !== null && item.lat_gcj02 !== undefined && 
          item.lng_gcj02 !== null && item.lng_gcj02 !== undefined) {
        return { ...item, lat: item.lat_gcj02, lng: item.lng_gcj02 };
      }
      const [gcjLat, gcjLng] = bd09ToGcj02(item.lat, item.lng);
      return { ...item, lat: gcjLat, lng: gcjLng };
    })() : null;
    
    // 处理终点坐标
    const end = validTrackData.length > 0 ? (() => {
      const item = validTrackData[validTrackData.length - 1];
      // 优先使用GCJ-02坐标，如果没有则转换百度坐标系
      if (item.lat_gcj02 !== null && item.lat_gcj02 !== undefined && 
          item.lng_gcj02 !== null && item.lng_gcj02 !== undefined) {
        return { ...item, lat: item.lat_gcj02, lng: item.lng_gcj02 };
      }
      const [gcjLat, gcjLng] = bd09ToGcj02(item.lat, item.lng);
      return { ...item, lat: gcjLat, lng: gcjLng };
    })() : null;
    
    return { startPoint: start, endPoint: end };
  }, [safeTrackData]);

  // 默认地图中心（上海）
  const defaultCenter: [number, number] = useMemo(() => {
    return positions.length > 0
      ? (positions[0] as [number, number])
      : [31.1948, 121.5449];
  }, [positions]);

  return {
    positions,
    bounds,
    startPoint,
    endPoint,
    defaultCenter,
  };
};


