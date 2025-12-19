/**
 * @fileoverview 通用的 useSWR Hook
 * @author Claude
 * @created 2024-01-01
 */

import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { swrFetcher, createSWRConfig, ISWRConfig } from './useSWRConfig';

/**
 * 通用的 useSWR Hook
 * @param key SWR key，可以是字符串或 [url, params] 数组
 * @param config SWR 配置选项
 * @returns SWR 响应对象
 */
export function useApi<T = any>(
  key: string | [string, any?] | null,
  config?: Partial<ISWRConfig>,
): SWRResponse<T, any> {
  const swrConfig = createSWRConfig(config);

  return useSWR<T>(key, swrFetcher, swrConfig);
}

/**
 * 带参数的 useSWR Hook
 * @param url API 地址
 * @param params 请求参数
 * @param config SWR 配置选项
 * @returns SWR 响应对象
 */
export function useApiWithParams<T = any>(
  url: string | null,
  params?: any,
  config?: Partial<ISWRConfig>,
): SWRResponse<T, any> {
  const key: string | [string, any?] | null = url ? (params ? [url, params] : url) : null;
  return useApi<T>(key, config);
}

