/**
 * @fileoverview 轨迹地图容器组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import type { Dayjs } from 'dayjs';
import { TrackMap } from '@shared-components/track-map';
import type { IVehicleTrack } from '@shared-components/track-map';
import './index.less';

/**
 * 轨迹地图容器组件 Props
 */
export interface ITrackMapContainerProps {
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 时间范围 */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  /** 轨迹数据数组 */
  trackData: IVehicleTrack[];
}

/**
 * 轨迹地图容器组件
 */
const TrackMapContainer: React.FC<ITrackMapContainerProps> = ({
  dateRange,
  trackData,
}) => {
  const resolvedTrackData =
    dateRange && dateRange[0] && dateRange[1] ? trackData : [];

  return (
    <div className="track-map-container">
      <TrackMap trackData={resolvedTrackData} />
    </div>
  );
};

export default TrackMapContainer;

