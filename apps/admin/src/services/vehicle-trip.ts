/**
 * 车辆行程 API 服务
 */
import { request } from '@umijs/max';
import type { IQueryTripParams, ITripListResponse, ISyncTripParams, ISyncTripResponse } from '@/types';

/**
 * 查询车辆行程数据列表
 * @param params 查询参数
 * @returns 车辆行程列表响应
 */
export async function getTripList(params: IQueryTripParams): Promise<ITripListResponse> {
  return request('/api/vehicle-trip', {
    method: 'GET',
    params,
  });
}

/**
 * 同步车辆行程数据
 * @param params 同步参数
 * @returns 同步结果响应
 */
export async function syncTripData(params: ISyncTripParams): Promise<ISyncTripResponse> {
  return request('/api/vehicle-trip/sync', {
    method: 'POST',
    data: params,
  });
}

