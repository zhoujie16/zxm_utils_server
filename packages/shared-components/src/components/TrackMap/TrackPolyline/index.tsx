/**
 * @fileoverview 轨迹线组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import { Polyline } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

/**
 * 轨迹线组件 Props
 */
export interface ITrackPolylineProps {
  /** 轨迹坐标数组 */
  positions: LatLngExpression[];
  /** 轨迹线颜色 */
  color?: string;
  /** 轨迹线宽度 */
  weight?: number;
  /** 轨迹线透明度 */
  opacity?: number;
}

/**
 * 轨迹线组件
 * 功能：在地图上绘制轨迹线
 */
const TrackPolyline: React.FC<ITrackPolylineProps> = ({
  positions,
  color = '#1890ff',
  weight = 3,
  opacity = 0.8,
}) => {
  if (positions.length <= 1) {
    return null;
  }

  return (
    <Polyline
      positions={positions}
      color={color}
      weight={weight}
      opacity={opacity}
    />
  );
};

export default TrackPolyline;


