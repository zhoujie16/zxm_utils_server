/**
 * @fileoverview 车辆轨迹列表 Hook
 * @author Claude
 * @created 2024-01-01
 */

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { getTrackList } from '../services/vehicle-track';
import type { IQueryTrackParams, ITrackListResponse } from '../api-types';

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
  /** 开始时间（时间戳，毫秒） */
  startTime: number | undefined;
  /** 结束时间（时间戳，毫秒） */
  endTime: number | undefined;
  /** 设置页码 */
  setPage: (page: number) => void;
  /** 设置每页数量 */
  setLimit: (limit: number) => void;
  /** 设置时间范围 */
  setTimeRange: (startTime?: number, endTime?: number) => void;
  /** 查询参数 */
  queryParams: IQueryTrackParams;
}

/**
 * 车辆轨迹列表 Hook
 * @param initialPage 初始页码，默认为 1
 * @param initialLimit 初始每页数量，默认为 10
 * @param initialStartTime 初始开始时间
 * @param initialEndTime 初始结束时间
 * @returns Hook 返回值
 */
export function useTrackList(
  initialPage = 1,
  initialLimit = 10,
  initialStartTime?: number,
  initialEndTime?: number,
): IUseTrackListReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [startTime, setStartTime] = useState<number | undefined>(initialStartTime);
  const [endTime, setEndTime] = useState<number | undefined>(initialEndTime);

  // 构建查询参数
  const queryParams: IQueryTrackParams = useMemo(() => {
    const params: IQueryTrackParams = {
      page,
      limit,
    };

    if (startTime !== undefined) {
      params.startTime = startTime;
    }
    if (endTime !== undefined) {
      params.endTime = endTime;
    }

    return params;
  }, [page, limit, startTime, endTime]);

  // 使用 SWR 获取数据
  const { data, error, isLoading, mutate } = useSWR<ITrackListResponse>(
    ['/vehicle-track', queryParams],
    ([, params]) => getTrackList(params as IQueryTrackParams),
    {
      revalidateOnFocus: false,
    },
  );

  // 刷新数据
  const refresh = () => {
    mutate();
  };

  // 设置时间范围
  const setTimeRange = (newStartTime?: number, newEndTime?: number) => {
    setStartTime(newStartTime);
    setEndTime(newEndTime);
    setPage(1); // 重置到第一页
  };

  return {
    data,
    isLoading,
    error,
    refresh,
    page,
    limit,
    startTime,
    endTime,
    setPage,
    setLimit,
    setTimeRange,
    queryParams,
  };
}

