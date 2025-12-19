/**
 * 车辆轨迹列表 Hook
 * 功能：管理车辆轨迹列表的数据获取、分页、筛选等逻辑
 */
import { useState, useMemo } from 'react';
import type { Dayjs } from 'dayjs';
import { useTrackList as useHttpTrackList } from '@zxm-toolkit/http-client';
import type { IQueryTrackParams, ITrackListResponse } from '@/types';

/**
 * 车辆轨迹列表 Hook 返回值类型
 */
export interface IUseTrackListReturn {
  /** 数据列表 */
  data: ITrackListResponse | undefined;
  /** 加载状态 */
  isLoading: boolean;
  /** 错误信息 */
  error: any;
  /** 刷新数据 */
  refresh: () => void;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  limit: number;
  /** 时间范围 */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  /** 设置页码 */
  setPage: (page: number) => void;
  /** 设置每页数量 */
  setLimit: (limit: number) => void;
  /** 设置时间范围 */
  setDateRange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  /** 查询参数 */
  queryParams: IQueryTrackParams;
}

/**
 * 车辆轨迹列表 Hook
 * @param initialPage 初始页码，默认为 1
 * @param initialLimit 初始每页数量，默认为 10
 * @returns Hook 返回值
 */
export const useTrackList = (
  initialPage = 1,
  initialLimit = 10,
): IUseTrackListReturn => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 计算时间戳
  const startTime = useMemo(() => {
    return dateRange && dateRange[0] ? dateRange[0].startOf('day').valueOf() : undefined;
  }, [dateRange]);

  const endTime = useMemo(() => {
    return dateRange && dateRange[1] ? dateRange[1].endOf('day').valueOf() : undefined;
  }, [dateRange]);

  // 使用封装的 Hook
  const {
    data,
    isLoading,
    error,
    refresh,
      page,
      limit,
    setPage,
    setLimit,
    setTimeRange,
    queryParams,
  } = useHttpTrackList(initialPage, initialLimit, startTime, endTime);

  // 处理时间范围变化（重置到第一页）
  const handleSetDateRange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      setTimeRange(dates[0].startOf('day').valueOf(), dates[1].endOf('day').valueOf());
    } else {
      setTimeRange(undefined, undefined);
    }
  };

  return {
    data,
    isLoading,
    error,
    refresh,
    page,
    limit,
    dateRange,
    setPage,
    setLimit,
    setDateRange: handleSetDateRange,
    queryParams,
  };
};
