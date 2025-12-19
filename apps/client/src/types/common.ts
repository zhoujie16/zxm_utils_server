/**
 * @fileoverview 通用类型定义
 * @author Claude
 * @created 2024-01-01
 */

// ==================== 登录相关类型 ====================

/**
 * 登录表单数据类型
 */
export interface ILoginFormData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 是否记住登录状态 */
  remember?: boolean;
}

/**
 * 登录响应类型
 */
export interface ILoginResponse {
  /** 访问令牌 */
  access_token: string;
  /** 用户信息 */
  user: {
    /** 用户ID */
    id: string;
    /** 用户名 */
    username: string;
    /** 访问权限 */
    access: string;
  };
}

// ==================== API 响应类型 ====================

/**
 * API 错误响应类型
 */
export interface IApiError {
  message: string;
  statusCode?: number;
}

/**
 * API 列表响应结构
 */
export interface IApiListResponse<T = any> {
  /** 数据列表 */
  data: T[];
  /** 分页信息 */
  pagination: {
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    limit: number;
    /** 总记录数 */
    total: number;
    /** 总页数 */
    totalPages: number;
  };
}

// ==================== 车辆轨迹相关类型 ====================

import type { IVehicleTrack } from '@shared-components/track-map';

/**
 * 车辆轨迹数据实体类型
 * @deprecated 请使用 @shared-components/track-map 中的 IVehicleTrack
 */
export type { IVehicleTrack };

/**
 * 查询车辆轨迹参数类型
 */
export interface IQueryTrackParams {
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
  /** 开始时间（时间戳，毫秒） */
  startTime?: number;
  /** 结束时间（时间戳，毫秒） */
  endTime?: number;
}

/**
 * 车辆轨迹列表响应类型
 */
export type ITrackListResponse = IApiListResponse<IVehicleTrack>;
