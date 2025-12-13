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

// ==================== API 响应类型 ====================

/**
 * 通用 API 响应类型
 */
export interface IApiResponse<T = any> {
  /** 请求是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 响应消息 */
  message: string;
}

/**
 * 嵌套的 API 响应类型（实际API返回的结构）
 */
export interface INestedApiResponse<T = any> {
  /** 请求是否成功 */
  success: boolean;
  /** 嵌套的响应数据 */
  data?: {
    /** 实际数据 */
    data?: T;
  };
  /** 响应消息 */
  message: string;
}

/**
 * 分页响应类型
 */
export interface IPaginationResponse<T = any> {
  /** 请求是否成功 */
  success: boolean;
  /** 数据列表 */
  data?: T[];
  /** 分页信息 */
  pagination?: {
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    limit: number;
    /** 总记录数 */
    total: number;
    /** 总页数 */
    totalPages: number;
  };
  /** 响应消息 */
  message: string;
}

/**
 * 嵌套的分页响应类型（实际API返回的结构）
 */
export interface INestedPaginationResponse<T = any> {
  /** 请求是否成功 */
  success: boolean;
  /** 嵌套的响应数据 */
  data?: {
    /** 数据列表 */
    data?: T[];
    /** 分页信息 */
    pagination?: {
      /** 当前页码 */
      page: number;
      /** 每页数量 */
      limit: number;
      /** 总记录数 */
      total: number;
      /** 总页数 */
      totalPages: number;
    };
  };
  /** 响应消息 */
  message: string;
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
  /** 原始数据字段（带raw_前缀） */
  raw_start_time: number;
  raw_end_time: number;
  raw_te_record_trip_avg_oil: number;
  raw_te_record_trip_avg_rpm: number;
  raw_te_record_trip_avg_speed: number;
  raw_te_record_trip_max_rpm: number;
  raw_te_record_trip_max_speed: number;
  raw_te_record_trip_mileage: number;
  raw_te_record_trip_no: number;
  raw_te_record_trip_oil: number;
  raw_te_record_trip_run_time: number;
  raw_te_record_trip_start_time: number;
  raw_te_record_trip_type: number;
  raw_te_record_trip_urgent_acc_cnt: number;
  raw_te_record_trip_urgent_dec_cnt: number;
  raw_te_record_trip_urgent_turn_cnt: number;
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
