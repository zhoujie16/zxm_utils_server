/**
 * @fileoverview 车辆行程服务 API
 * @author Claude
 * @created 2024-01-01
 */

import { get, post } from '../index';
import type {
  IQueryTripParams,
  ITripListResponse,
  ISyncTripParams,
  ISyncTripResponse,
} from '../api-types';

const BASE_URL = '/vehicle-trip';

/**
 * 查询车辆行程数据列表
 * @param params 查询参数
 * @returns 车辆行程列表响应
 */
export async function getTripList(params: IQueryTripParams): Promise<ITripListResponse> {
  return get<ITripListResponse>(BASE_URL, {
    params,
  });
}

/**
 * 同步车辆行程数据
 * @param params 同步参数
 * @returns 同步结果响应
 */
export async function syncTripData(params: ISyncTripParams): Promise<ISyncTripResponse> {
  return post<ISyncTripResponse>(`${BASE_URL}/sync`, params);
}

