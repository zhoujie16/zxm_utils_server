/**
 * 公共配置服务
 * 处理与公共配置API相关的所有请求
 */
import { request } from '@umijs/max';
import type {
  ICommonConfig,
  ICreateConfigParams,
  IUpdateConfigParams,
  IUpdateSortParams,
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
 * 根据ID获取公共配置
 */
export async function getConfigById(id: number): Promise<ICommonConfig> {
  return request(`${BASE_URL}/${id}`, {
    method: 'GET',
  });
}

/**
 * 根据配置键获取公共配置
 */
export async function getConfigByKey(configKey: string): Promise<ICommonConfig | null> {
  return request(`${BASE_URL}/key/${configKey}`, {
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
 * 切换配置启用状态
 */
export async function toggleConfigEnabled(id: number): Promise<ICommonConfig> {
  return request(`${BASE_URL}/${id}/toggle`, {
    method: 'PATCH',
  });
}

/**
 * 批量更新排序
 */
export async function updateSortOrder(params: IUpdateSortParams): Promise<{ success: boolean; message: string }> {
  return request(`${BASE_URL}/sort`, {
    method: 'POST',
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