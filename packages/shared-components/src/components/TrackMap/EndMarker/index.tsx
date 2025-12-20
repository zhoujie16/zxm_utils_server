/**
 * @fileoverview 终点标记组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { IVehicleTrack } from '../../../types/vehicle-track';
import { formatTime } from '../../../utils/trackUtils';
import './index.less';

/**
 * 终点标记组件 Props
 */
export interface IEndMarkerProps {
  /** 终点数据 */
  endPoint: IVehicleTrack | null;
  /** 起点数据（用于判断是否显示终点） */
  startPoint: IVehicleTrack | null;
}

/**
 * 终点标记组件
 * 功能：在地图上显示终点标记和相关信息
 */
const EndMarker: React.FC<IEndMarkerProps> = ({ endPoint, startPoint }) => {
  if (
    !endPoint ||
    endPoint.id === startPoint?.id ||
    typeof endPoint.lat !== 'number' ||
    typeof endPoint.lng !== 'number'
  ) {
    return null;
  }

  return (
    <Marker position={[endPoint.lat, endPoint.lng]}>
      <Popup>
        <div className="track-map-marker-popup">
          <div className="track-map-marker-title">终点</div>
          <div className="track-map-marker-info">时间：{formatTime(endPoint.gpsTime)}</div>
          <div className="track-map-marker-info">速度：{endPoint.gpsSpeed} km/h</div>
          <div className="track-map-marker-info">
            坐标：({endPoint.lat.toFixed(6)}, {endPoint.lng.toFixed(6)})
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default EndMarker;

