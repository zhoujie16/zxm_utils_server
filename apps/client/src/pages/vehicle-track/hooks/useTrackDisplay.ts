/**
 * @fileoverview 车辆轨迹显示 Hook
 * @author Claude
 * @created 2024-01-01
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import type { IVehicleTrack as ISharedVehicleTrack } from '@shared-components/track-map';
import type { IVehicleTrack, IQueryTrackParams } from '@zxm-toolkit/http-client';
import { getTrackList } from '@zxm-toolkit/http-client';

/**
 * 车辆轨迹显示 Hook 返回值类型
 */
export interface IUseTrackDisplayReturn {
  /** 所有轨迹数据 */
  trackData: ISharedVehicleTrack[];
  /** 加载状态 */
  isLoading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => Promise<ISharedVehicleTrack[]>;
  /** 时间范围 */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  /** 设置时间范围 */
  setDateRange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
}

/**
 * 将 http-client 的 IVehicleTrack 转换为 shared-components 的 IVehicleTrack
 */
function convertToSharedTrack(track: IVehicleTrack): ISharedVehicleTrack | null {
  // 确保坐标有效
  if (
    typeof track.lat !== 'number' ||
    typeof track.lng !== 'number' ||
    isNaN(track.lat) ||
    isNaN(track.lng)
  ) {
    return null;
  }

  return {
    id: track.id,
    imei: track.deviceId || '',
    direction: track.direction || 0,
    gateTime: track.timestamp,
    gpsMode: 0, // 默认值，如果 API 没有返回
    gpsSpeed: track.speed || 0,
    gpsTime: track.timestamp,
    lat: track.lat,
    lng: track.lng,
    posMethod: 0, // 默认值
    posMulFlag: 0, // 默认值
    posType: 0, // 默认值
    precision: 0, // 默认值
    createdAt: track.createdAt,
    updatedAt: track.updatedAt,
  };
}

/**
 * 车辆轨迹显示 Hook
 * @returns Hook 返回值
 */
export const useTrackDisplay = (): IUseTrackDisplayReturn => {
  // 默认选择今天的时间范围
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [trackData, setTrackData] = useState<ISharedVehicleTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 构建查询参数
   */
  const queryParams: IQueryTrackParams | null = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return null;
    }

    return {
      startTime: dateRange[0].startOf('day').valueOf(),
      endTime: dateRange[1].endOf('day').valueOf(),
      limit: 100, // 每页最大100条
    };
  }, [dateRange]);

  /**
   * 获取所有轨迹数据（分页加载）
   */
  const fetchAllTrackData = async (params: IQueryTrackParams): Promise<ISharedVehicleTrack[]> => {
    const allData: ISharedVehicleTrack[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await getTrackList({
        ...params,
        page,
      });

      if (response?.data) {
        const convertedData = response.data
          .map(convertToSharedTrack)
          .filter((item): item is ISharedVehicleTrack => item !== null);
        // 调试信息：检查转换后的数据
        if (convertedData.length === 0 && response.data.length > 0) {
          console.warn('轨迹数据转换后为空，原始数据示例:', response.data[0]);
        }
        allData.push(...convertedData);
        const totalPages = response.pagination?.totalPages || 0;
        hasMore = page < totalPages;
        page++;
      } else {
        hasMore = false;
      }
    }

    return allData;
  };

  /**
   * 加载数据
   */
  const loadData = useCallback(async (): Promise<ISharedVehicleTrack[]> => {
    if (!queryParams) {
      setTrackData([]);
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllTrackData(queryParams);
      // 按 gpsTime 排序（从早到晚）
      data.sort((a, b) => a.gpsTime - b.gpsTime);
      setTrackData(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取轨迹数据失败');
      setError(error);
      setTrackData([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  /**
   * 时间范围变化时自动加载数据
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * 刷新数据
   */
  const refresh = useCallback(async (): Promise<ISharedVehicleTrack[]> => {
    return await loadData();
  }, [loadData]);

  return {
    trackData,
    isLoading,
    error,
    refresh,
    dateRange,
    setDateRange,
  };
};

