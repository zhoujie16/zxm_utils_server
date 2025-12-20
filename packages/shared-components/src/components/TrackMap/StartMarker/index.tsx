/**
 * @fileoverview 起点标记组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { IVehicleTrack } from '../../../types/vehicle-track';
import { formatTime } from '../../../utils/trackUtils';
import './index.less';

/**
 * 起点标记组件 Props
 */
export interface IStartMarkerProps {
  /** 起点数据 */
  startPoint: IVehicleTrack | null;
}

/**
 * 起点标记组件
 * 功能：在地图上显示起点标记和相关信息
 */
const StartMarker: React.FC<IStartMarkerProps> = ({ startPoint }) => {
  if (!startPoint || typeof startPoint.lat !== 'number' || typeof startPoint.lng !== 'number') {
    return null;
  }

  return (
    <Marker position={[startPoint.lat, startPoint.lng]}>
      <Popup>
        <div className="track-map-marker-popup">
          <div className="track-map-marker-title">起点</div>
          <div className="track-map-marker-info">时间：{formatTime(startPoint.gpsTime)}</div>
          <div className="track-map-marker-info">速度：{startPoint.gpsSpeed} km/h</div>
          <div className="track-map-marker-info">
            坐标：({startPoint.lat.toFixed(6)}, {startPoint.lng.toFixed(6)})
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default StartMarker;

