/**
 * @fileoverview HTTP 客户端类型定义
 * @author Claude
 * @created 2024-01-01
 */

import { AxiosRequestConfig } from 'axios';

/**
 * HTTP 客户端配置接口
 */
export interface IHttpClientConfig {
  /** API 基础路径 */
  baseURL?: string;
  /** 请求超时时间（毫秒） */
  timeout?: number;
  /** 默认请求头 */
  headers?: Record<string, string>;
  /** Token 存储的 key */
  tokenKey?: string;
  /** 登录页面路径 */
  loginPath?: string;
  /** 自定义错误处理函数 */
  onError?: (error: IHttpError) => void;
  /** 自定义 401 处理函数 */
  onUnauthorized?: () => void;
}

/**
 * HTTP 请求配置接口（扩展 AxiosRequestConfig）
 */
export interface IRequestConfig extends AxiosRequestConfig {
  /** 是否跳过错误处理 */
  skipErrorHandler?: boolean;
}

/**
 * HTTP 错误接口
 */
export interface IHttpError {
  /** 错误消息 */
  message: string;
  /** HTTP 状态码 */
  code: number;
  /** 响应数据 */
  data?: unknown;
  /** 原始错误对象 */
  originalError?: unknown;
}

/**
 * API 响应数据结构
 */
export interface IApiResponse<T = unknown> {
  /** 响应数据 */
  data: T;
  /** 是否成功 */
  success?: boolean;
  /** 错误码 */
  errorCode?: number;
  /** 错误消息 */
  errorMessage?: string;
}

