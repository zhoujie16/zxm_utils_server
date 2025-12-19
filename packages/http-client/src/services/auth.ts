/**
 * @fileoverview 认证服务 API
 * @author Claude
 * @created 2024-01-01
 */

import { post } from '../index';
import type { ILoginFormData, ILoginResponse } from '../api-types';

/**
 * 登录接口
 * @param data 登录表单数据
 * @returns 登录响应数据
 */
export async function loginApi(data: ILoginFormData): Promise<ILoginResponse> {
  return post<ILoginResponse>('/auth/login', data);
}

