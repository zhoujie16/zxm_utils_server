/**
 * @fileoverview 公共配置服务 API
 * @author Claude
 * @created 2024-01-01
 */

import { get, post, patch, del } from '../index';
import type {
  ICommonConfig,
  ICreateConfigParams,
  IUpdateConfigParams,
} from '../api-types';

const BASE_URL = '/common-config';

/**
 * 获取所有公共配置
 * @returns 公共配置列表
 */
export async function getConfigList(): Promise<ICommonConfig[]> {
  return get<ICommonConfig[]>(BASE_URL);
}

/**
 * 根据配置键获取公共配置
 * @param key 配置键
 * @returns 公共配置数据
 */
export async function getConfigByKey(key: string): Promise<ICommonConfig> {
  return get<ICommonConfig>(`${BASE_URL}/${key}`);
}

/**
 * 创建新的公共配置
 * @param params 创建参数
 * @returns 创建的公共配置
 */
export async function createConfig(params: ICreateConfigParams): Promise<ICommonConfig> {
  return post<ICommonConfig>(BASE_URL, params);
}

/**
 * 更新公共配置
 * @param id 配置ID
 * @param params 更新参数
 * @returns 更新后的公共配置
 */
export async function updateConfig(
  id: number,
  params: IUpdateConfigParams,
): Promise<ICommonConfig> {
  return patch<ICommonConfig>(`${BASE_URL}/${id}`, params);
}

/**
 * 删除公共配置
 * @param id 配置ID
 */
export async function deleteConfig(id: number): Promise<void> {
  return del<void>(`${BASE_URL}/${id}`);
}

