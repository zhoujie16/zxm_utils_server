/**
 * @fileoverview 公共配置列表 Hook
 * @author Claude
 * @created 2024-01-01
 */

import useSWR from 'swr';
import { swrFetcher } from './useSWRConfig';
import { getConfigList } from '../services/common-config';
import type { ICommonConfig } from '../api-types';

/**
 * 公共配置列表 Hook 返回值类型
 */
export interface IUseConfigListReturn {
  /** 配置列表 */
  data: ICommonConfig[] | undefined;
  /** 加载状态 */
  isLoading: boolean;
  /** 错误信息 */
  error: any;
  /** 刷新数据 */
  refresh: () => void;
}

/**
 * 公共配置列表 Hook
 * @returns Hook 返回值
 */
export function useConfigList(): IUseConfigListReturn {
  const { data, error, isLoading, mutate } = useSWR<ICommonConfig[]>(
    '/common-config',
    () => getConfigList(),
    {
      revalidateOnFocus: false,
    },
  );

  // 刷新数据
  const refresh = () => {
    mutate();
  };

  return {
    data,
    isLoading,
    error,
    refresh,
  };
}

