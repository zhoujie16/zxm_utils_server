/**
 * 车辆轨迹列表 Hook
 * 功能：管理车辆轨迹列表的数据获取、分页、筛选等逻辑
 */
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import type { Dayjs } from 'dayjs';
import type { IQueryTrackParams, ITrackListResponse } from '@/types';
import { getTrackList } from '@/services/vehicle-track';

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
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 构建查询参数
  const queryParams: IQueryTrackParams = useMemo(() => {
    const params: IQueryTrackParams = {
      page,
      limit,
    };

    // 时间范围筛选
    if (dateRange && dateRange[0] && dateRange[1]) {
      params.startTime = dateRange[0].startOf('day').valueOf();
      params.endTime = dateRange[1].endOf('day').valueOf();
    }

    return params;
  }, [page, limit, dateRange]);

  // 使用 SWR 获取数据
  const { data, error, isLoading, mutate } = useSWR<ITrackListResponse>(
    ['/api/vehicle-track', queryParams],
    ([, params]) => getTrackList(params as IQueryTrackParams),
    {
      revalidateOnFocus: false,
    },
  );

  // 刷新数据
  const refresh = () => {
    mutate();
  };

  // 处理时间范围变化（重置到第一页）
  const handleSetDateRange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    setPage(1);
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
