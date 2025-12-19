/**
 * @fileoverview HTTP 客户端核心实现
 * @author Claude
 * @created 2024-01-01
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { IHttpClientConfig, IRequestConfig, IHttpError } from './types';
import { DEFAULT_CONFIG } from './config';

/**
 * HTTP 请求错误类
 */
export class HttpRequestError extends Error implements IHttpError {
  public code: number;
  public data?: unknown;
  public originalError?: unknown;

  constructor(message: string, code: number = 500, data?: unknown, originalError?: unknown) {
    super(message);
    this.name = 'HttpRequestError';
    this.code = code;
    this.data = data;
    this.originalError = originalError;
  }
}

/**
 * HTTP 客户端类
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;
  private config: Required<IHttpClientConfig>;

  constructor(config?: IHttpClientConfig) {
    // 合并配置，baseURL、timeout、tokenKey、loginPath 使用默认值，不对外暴露
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      headers: {
        ...DEFAULT_CONFIG.headers,
        ...config?.headers,
      },
    } as Required<IHttpClientConfig>;

    // 创建 axios 实例
    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    });

    // 设置拦截器
    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 添加 Authorization header
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 直接返回响应数据
        return response.data;
      },
      (error: AxiosError) => {
        return this.handleError(error);
      },
    );
  }

  /**
   * 获取 Token
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.config.tokenKey);
  }

  /**
   * 清除 Token
   */
  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.config.tokenKey);
    }
  }

  /**
   * 处理错误
   */
  private handleError(error: AxiosError): Promise<never> {
    const response = error.response;
    const requestConfig = error.config as IRequestConfig;

    // 如果配置了跳过错误处理，直接抛出原始错误
    if (requestConfig?.skipErrorHandler) {
      const message = response?.data
        ? ((response.data as { message?: string }).message || response.statusText)
        : error.message || '请求失败';
      const code = response?.status || 500;
      throw new HttpRequestError(message, code, response?.data, error);
    }

    // 处理 401 未授权错误
    if (response?.status === 401) {
      this.clearToken();
      if (this.config.onUnauthorized) {
        this.config.onUnauthorized();
      } else if (typeof window !== 'undefined') {
        window.location.replace(this.config.loginPath);
      }
    }

    // 构建错误消息
    const message = response?.data
      ? ((response.data as { message?: string }).message || response.statusText)
      : error.message || '请求失败';

    const code = response?.status || 500;

    // 调用自定义错误处理函数
    if (this.config.onError) {
      const httpError: IHttpError = {
        message,
        code,
        data: response?.data,
        originalError: error,
      };
      this.config.onError(httpError);
    }

    // 抛出错误
    throw new HttpRequestError(message, code, response?.data, error);
  }

  /**
   * GET 请求
   */
  public get<T = unknown>(url: string, config?: IRequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config);
  }

  /**
   * POST 请求
   */
  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: IRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.post(url, data, config);
  }

  /**
   * PUT 请求
   */
  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: IRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.put(url, data, config);
  }

  /**
   * PATCH 请求
   */
  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: IRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.patch(url, data, config);
  }

  /**
   * DELETE 请求
   */
  public delete<T = unknown>(url: string, config?: IRequestConfig): Promise<T> {
    return this.axiosInstance.delete(url, config);
  }

  /**
   * 获取 axios 实例（用于特殊场景）
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * 更新配置
   * baseURL、timeout、tokenKey、loginPath 不允许更新，使用默认值
   */
  public updateConfig(config: Partial<IHttpClientConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      headers: {
        ...this.config.headers,
        ...config.headers,
      },
    };

    // 更新 axios 实例配置（仅更新 headers）
    if (config.headers) {
      Object.assign(this.axiosInstance.defaults.headers, config.headers);
    }
  }
}

