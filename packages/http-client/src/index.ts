/**
 * @fileoverview HTTP 客户端主入口文件
 * @author Claude
 * @created 2024-01-01
 */

import { HttpClient } from './http-client';
import { HttpRequestError } from './http-client';
import type { IHttpClientConfig, IRequestConfig, IHttpError, IApiResponse } from './types';

// 创建默认实例
let defaultClient: HttpClient | null = null;

/**
 * 初始化 HTTP 客户端
 */
export function initHttpClient(config?: IHttpClientConfig): HttpClient {
  defaultClient = new HttpClient(config);
  return defaultClient;
}

/**
 * 获取默认 HTTP 客户端实例
 */
export function getHttpClient(): HttpClient {
  if (!defaultClient) {
    defaultClient = new HttpClient();
  }
  return defaultClient;
}

/**
 * GET 请求
 */
export function get<T = unknown>(url: string, config?: IRequestConfig): Promise<T> {
  return getHttpClient().get<T>(url, config);
}

/**
 * POST 请求
 */
export function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: IRequestConfig,
): Promise<T> {
  return getHttpClient().post<T>(url, data, config);
}

/**
 * PUT 请求
 */
export function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: IRequestConfig,
): Promise<T> {
  return getHttpClient().put<T>(url, data, config);
}

/**
 * PATCH 请求
 */
export function patch<T = unknown>(
  url: string,
  data?: unknown,
  config?: IRequestConfig,
): Promise<T> {
  return getHttpClient().patch<T>(url, data, config);
}

/**
 * DELETE 请求
 */
export function del<T = unknown>(url: string, config?: IRequestConfig): Promise<T> {
  return getHttpClient().delete<T>(url, config);
}

// 导出类型和类
export { HttpClient, HttpRequestError };
export type { IHttpClientConfig, IRequestConfig, IHttpError, IApiResponse };

// 导出 API 服务
export * from './services';

// 导出 Hooks
export * from './hooks';

// 导出 API 类型
export * from './api-types';

