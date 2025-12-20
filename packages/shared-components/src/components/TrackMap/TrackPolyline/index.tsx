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
 * 功能：在地图上绘制轨迹线，带黑色描边效果
 */
const TrackPolyline: React.FC<ITrackPolylineProps> = ({
  positions,
  color = '#5EC33A',
  weight = 3.5,
  opacity = 0.8,
}) => {
  if (positions.length <= 1) {
    return null;
  }

  // 描边宽度：比主线条宽 2px
  const strokeWeight = weight + 2;

  return (
    <>
      {/* 黑色描边层（底层） */}
      <Polyline
        positions={positions}
        color="#000000"
        weight={strokeWeight}
        opacity={opacity * 0.6}
      />
      {/* 主轨迹线（上层） */}
      <Polyline
        positions={positions}
        color={color}
        weight={weight}
        opacity={opacity}
      />
    </>
  );
};

export default TrackPolyline;


