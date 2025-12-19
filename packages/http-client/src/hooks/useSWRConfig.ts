/**
 * @fileoverview SWR 全局配置
 * @author Claude
 * @created 2024-01-01
 */

import { SWRConfiguration } from 'swr';
import { getHttpClient } from '../index';

/**
 * SWR 全局 fetcher 函数
 * @param key SWR key，格式为 [url, params?] 或 string
 * @returns Promise<any>
 */
export const swrFetcher = async (key: string | [string, any?]): Promise<any> => {
  const client = getHttpClient();

  if (typeof key === 'string') {
    return client.get(key);
  }

  const [url, params] = key;
  return client.get(url, {
    params,
  });
};

/**
 * SWR 全局错误处理函数类型
 */
export type SWRErrorHandler = (error: any) => void;

/**
 * SWR 全局配置选项
 */
export interface ISWRConfig extends SWRConfiguration {
  /** 自定义错误处理函数 */
  onError?: SWRErrorHandler;
}

/**
 * 创建 SWR 配置
 * @param customConfig 自定义配置
 * @returns SWR 配置对象
 */
export function createSWRConfig(customConfig?: Partial<ISWRConfig>): ISWRConfig {
  return {
    fetcher: swrFetcher,
    // 缓存配置
    dedupingInterval: 60000, // 1分钟内相同请求去重
    focusThrottleInterval: 5000, // 聚焦时重新验证的节流间隔
    // 重新验证配置
    revalidateOnFocus: false, // 窗口聚焦时不自动重新验证
    revalidateOnReconnect: true, // 网络重连时自动重新验证
    revalidateIfStale: true, // 数据过期时重新验证
    // 错误重试配置
    errorRetryCount: 3, // 错误重试次数
    errorRetryInterval: 5000, // 错误重试间隔（毫秒）
    // 加载延迟配置
    loadingTimeout: 3000, // 加载超时时间
    // 缓存时间配置
    refreshInterval: 0, // 自动刷新间隔，0 表示不自动刷新
    // 其他配置
    shouldRetryOnError: true, // 出错时是否重试
    keepPreviousData: true, // 保留之前的数据直到新数据加载完成
    ...customConfig,
  };
}

/**
 * 默认 SWR 配置
 */
export const defaultSWRConfig = createSWRConfig();

