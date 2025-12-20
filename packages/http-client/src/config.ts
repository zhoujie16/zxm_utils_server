/**
 * @fileoverview HTTP 客户端默认配置
 * @author Claude
 * @created 2024-01-01
 */

import { IHttpClientConfig } from './types';

/**
 * 默认配置
 */
export const DEFAULT_CONFIG: IHttpClientConfig = {
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
  tokenKey: 'token',
  loginPath: '/login',
};

