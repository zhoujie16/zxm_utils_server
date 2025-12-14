/**
 * 车辆轨迹 API 服务
 */
import { request } from '@umijs/max';
import type { IQueryTrackParams, ITrackListResponse, ISyncTrackParams, ISyncTrackResponse } from '@/types';

/**
 * 查询车辆轨迹数据列表
 * @param params 查询参数
 * @returns 车辆轨迹列表响应
 */
export async function getTrackList(params: IQueryTrackParams): Promise<ITrackListResponse> {
  return request('/api/vehicle-track', {
    method: 'GET',
    params,
  });
}

/**
 * 同步车辆轨迹数据
 * @param params 同步参数
 * @returns 同步结果响应
 */
export async function syncTrackData(params: ISyncTrackParams): Promise<ISyncTrackResponse> {
  return request('/api/vehicle-track/sync', {
    method: 'POST',
    data: params,
  });
}
