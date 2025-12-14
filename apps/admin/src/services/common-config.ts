/**
 * 公共配置服务
 * 处理与公共配置API相关的所有请求
 */
import { request } from '@umijs/max';
import type {
  ICommonConfig,
  ICreateConfigParams,
  IUpdateConfigParams,
} from '@/types';

const BASE_URL = '/api/common-config';

/**
 * 获取所有公共配置
 */
export async function getConfigList(): Promise<ICommonConfig[]> {
  return request(`${BASE_URL}`, {
    method: 'GET',
  });
}


/**
 * 创建新的公共配置
 */
export async function createConfig(params: ICreateConfigParams): Promise<ICommonConfig> {
  return request(`${BASE_URL}`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新公共配置
 */
export async function updateConfig(
  id: number,
  params: IUpdateConfigParams,
): Promise<ICommonConfig> {
  return request(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    data: params,
  });
}



/**
 * 删除公共配置
 */
export async function deleteConfig(id: number): Promise<void> {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}