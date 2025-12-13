import { request } from '@umijs/max';
import { message } from 'antd';

/**
 * SWR 全局 fetcher 函数
 * @param key SWR key，格式为 [url, params?]
 * @returns Promise<any>
 */
export const swrFetcher = async (key: string | [string, any?]): Promise<any> => {
  if (typeof key === 'string') {
    return request(key);
  }

  const [url, params] = key;
  return request(url, {
    method: 'GET',
    params,
  });
};

/**
 * SWR 全局错误处理函数
 * @param error 错误对象
 */
export const swrOnError = (error: any) => {
  console.error('SWR Error:', error);

  // 根据错误类型显示不同的错误信息
  if (error?.response?.status === 401) {
    message.error('登录已过期，请重新登录');
  } else if (error?.response?.status === 403) {
    message.error('没有权限访问该资源');
  } else if (error?.response?.status === 404) {
    message.error('请求的资源不存在');
  } else if (error?.response?.status >= 500) {
    message.error('服务器错误，请稍后重试');
  } else {
    message.error('请求失败，请检查网络连接');
  }
};

/**
 * SWR 全局配置选项
 */
export const swrConfig = {
  fetcher: swrFetcher,
  onError: swrOnError,

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
};
