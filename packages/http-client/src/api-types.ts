/**
 * @fileoverview API 相关类型定义
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
    /** 邮箱 */
    email?: string;
    /** 访问权限 */
    access: string;
  };
}

// ==================== API 响应类型 ====================

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

/**
 * 车辆轨迹数据实体类型
 */
export interface IVehicleTrack {
  /** ID */
  id: number;
  /** 外部系统ID */
  externalId?: number;
  /** 车辆ID */
  vehicleId?: number;
  /** 设备ID */
  deviceId: string;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 速度（km/h） */
  speed: number;
  /** 方向角（度） */
  direction: number;
  /** 时间戳（毫秒） */
  timestamp: number;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

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

/**
 * 同步车辆轨迹数据请求参数类型
 */
export interface ISyncTrackParams {
  /** 开始时间（格式：YYYY-MM-DD HH:mm:ss） */
  startTime: string;
  /** 结束时间（格式：YYYY-MM-DD HH:mm:ss） */
  endTime: string;
}

/**
 * 同步车辆轨迹数据响应类型
 */
export interface ISyncTrackResponse {
  /** 成功保存的记录数 */
  success: number;
  /** 失败的记录数 */
  failed: number;
  /** 同步结果消息 */
  message: string;
}

// ==================== 车辆行程相关类型 ====================

/**
 * 车辆行程数据实体类型
 */
export interface IVehicleTrip {
  /** ID */
  id: number;
  /** 外部系统ID */
  externalId: number;
  /** 车辆ID */
  vehicleId: number;
  /** 车型ID */
  modelId: number;
  /** 车型名称 */
  model: string;
  /** 品牌ID */
  brandId: number;
  /** 品牌名称 */
  brand: string;
  /** 系列ID */
  seriesId: number;
  /** 系列名称 */
  series: string;
  /** 设备ID */
  deviceId: string;
  /** 单位ID */
  unitId: number;
  /** 油耗（毫升） */
  consumption: number;
  /** 里程（米） */
  mileage: number;
  /** 平均速度（km/h） */
  velocity: number;
  /** 最大速度（km/h） */
  maxSpeed: number;
  /** 急加速次数 */
  sharpAcceleration: number;
  /** 急减速次数 */
  sharpDeceleration: number;
  /** 急转弯次数 */
  sharpTurn: number;
  /** 开始时间（时间戳，毫秒） */
  startTime: number;
  /** 结束时间（时间戳，毫秒） */
  endTime: number;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 查询车辆行程参数类型
 */
export interface IQueryTripParams {
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
 * 车辆行程列表响应类型
 */
export type ITripListResponse = IApiListResponse<IVehicleTrip>;

/**
 * 同步车辆行程数据请求参数类型
 */
export interface ISyncTripParams {
  /** 月份（格式：YYYY-MM） */
  month: string;
}

/**
 * 同步车辆行程数据响应类型
 */
export interface ISyncTripResponse {
  /** 成功保存的记录数 */
  success: number;
  /** 失败的记录数 */
  failed: number;
  /** 同步结果消息 */
  message: string;
}

// ==================== 公共配置相关类型 ====================

/**
 * 公共配置数据实体类型
 */
export interface ICommonConfig {
  /** ID */
  id: number;
  /** 配置键（唯一标识） */
  configKey: string;
  /** 配置值，一般为JSON字符串 */
  configValue?: string;
  /** 配置描述 */
  description?: string;
  /** 排序顺序 */
  sortOrder: number;
  /** 是否启用 */
  isEnabled: boolean;
  /** 创建时间（ISO 8601 格式） */
  createdAt: string;
  /** 更新时间（ISO 8601 格式） */
  updatedAt: string;
}

/**
 * 创建公共配置参数类型
 */
export interface ICreateConfigParams {
  /** 配置键（唯一标识） */
  configKey: string;
  /** 配置值，一般为JSON字符串 */
  configValue?: string;
  /** 配置描述 */
  description?: string;
  /** 排序顺序 */
  sortOrder?: number;
  /** 是否启用 */
  isEnabled?: boolean;
}

/**
 * 更新公共配置参数类型
 */
export interface IUpdateConfigParams {
  /** 配置键（唯一标识） */
  configKey?: string;
  /** 配置值，一般为JSON字符串 */
  configValue?: string;
  /** 配置描述 */
  description?: string;
  /** 排序顺序 */
  sortOrder?: number;
  /** 是否启用 */
  isEnabled?: boolean;
}

