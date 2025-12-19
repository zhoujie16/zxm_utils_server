/**
 * @fileoverview 车辆轨迹相关类型定义
 * @author Claude
 * @created 2024-01-01
 */

/**
 * 车辆轨迹数据实体类型
 */
export interface IVehicleTrack {
  /** ID */
  id: number;
  /** 设备IMEI */
  imei: string;
  /** 方向（度） */
  direction: number;
  /** 门时间（13位时间戳，毫秒） */
  gateTime: number;
  /** GPS模式 */
  gpsMode: number;
  /** GPS速度（km/h） */
  gpsSpeed: number;
  /** GPS时间（13位时间戳，毫秒） */
  gpsTime: number;
  /** 纬度 */
  lat: number;
  /** 经度 */
  lng: number;
  /** 定位方法 */
  posMethod: number;
  /** 定位多重标志 */
  posMulFlag: number;
  /** 定位类型 */
  posType: number;
  /** 精度 */
  precision: number;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

