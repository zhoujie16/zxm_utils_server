/**
 * @fileoverview 轨迹统计信息组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import type { IVehicleTrack } from '@shared-components/track-map';
import { formatTime } from '@shared-components/track-map';
import './TrackStatistics.less';

/**
 * 轨迹统计信息组件 Props
 */
export interface ITrackStatisticsProps {
  /** 轨迹数据 */
  trackData: IVehicleTrack[];
}

/**
 * 轨迹统计信息组件
 */
const TrackStatistics: React.FC<ITrackStatisticsProps> = ({ trackData }) => {
  if (trackData.length === 0) {
    return null;
  }

  const startPoint = trackData[0];
  const endPoint = trackData[trackData.length - 1];

  return (
    <div className="track-statistics">
      <div className="track-statistics__title">轨迹统计</div>
      <div className="track-statistics__content">
        <div className="track-statistics__item">
          <span className="track-statistics__label">轨迹点数：</span>
          <span className="track-statistics__value">{trackData.length} 个</span>
        </div>
        {startPoint && (
          <div className="track-statistics__item">
            <span className="track-statistics__label">起点时间：</span>
            <span className="track-statistics__value">{formatTime(startPoint.gpsTime)}</span>
          </div>
        )}
        {endPoint && (
          <div className="track-statistics__item">
            <span className="track-statistics__label">终点时间：</span>
            <span className="track-statistics__value">{formatTime(endPoint.gpsTime)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackStatistics;

