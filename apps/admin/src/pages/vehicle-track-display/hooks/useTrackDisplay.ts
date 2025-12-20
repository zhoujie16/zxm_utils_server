/**
 * 车辆轨迹显示 Hook
 * 功能：管理车辆轨迹地图显示的数据获取逻辑，支持一次性加载所有轨迹数据
 */
import { useState, useMemo, useEffect, useCallback } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import type { IVehicleTrack } from '@shared-components/track-map';
import type { IQueryTrackParams } from '@/types';
import { getTrackList } from '@zxm-toolkit/http-client';

/**
 * 车辆轨迹显示 Hook 返回值类型
 */
export interface IUseTrackDisplayReturn {
  /** 所有轨迹数据 */
  trackData: IVehicleTrack[];
  /** 加载状态 */
  isLoading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => void;
  /** 时间范围 */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  /** 设置时间范围 */
  setDateRange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
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
  const [trackData, setTrackData] = useState<IVehicleTrack[]>([]);
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
  const fetchAllTrackData = async (params: IQueryTrackParams): Promise<IVehicleTrack[]> => {
    const allData: IVehicleTrack[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await getTrackList({
        ...params,
        page,
      });

      if (response?.data) {
        allData.push(...response.data);
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
  const loadData = useCallback(async () => {
    if (!queryParams) {
      setTrackData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllTrackData(queryParams);
      // 按 gpsTime 排序（从早到晚）
      data.sort((a, b) => a.gpsTime - b.gpsTime);
      setTrackData(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取轨迹数据失败');
      setError(error);
      setTrackData([]);
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
  const refresh = useCallback(() => {
    loadData();
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

