/**
 * @fileoverview 车辆轨迹服务 API
 * @author Claude
 * @created 2024-01-01
 */

import { get, post } from '../index';
import type {
  IQueryTrackParams,
  ITrackListResponse,
  ISyncTrackParams,
  ISyncTrackResponse,
} from '../api-types';

const BASE_URL = '/vehicle-track';

/**
 * 查询车辆轨迹数据列表
 * @param params 查询参数
 * @returns 车辆轨迹列表响应
 */
export async function getTrackList(params: IQueryTrackParams): Promise<ITrackListResponse> {
  return get<ITrackListResponse>(BASE_URL, {
    params,
  });
}

/**
 * 同步车辆轨迹数据
 * @param params 同步参数
 * @returns 同步结果响应
 */
export async function syncTrackData(params: ISyncTrackParams): Promise<ISyncTrackResponse> {
  return post<ISyncTrackResponse>(`${BASE_URL}/sync`, params);
}

