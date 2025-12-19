/**
 * @fileoverview 轨迹地图容器组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import type { Dayjs } from 'dayjs';
import { TrackMap } from '@shared-components/track-map';
import type { IVehicleTrack } from '@shared-components/track-map';
import './TrackMapContainer.less';

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
  loading,
  error,
  dateRange,
  trackData,
}) => {
  return (
    <div className="track-map-container">
      {loading && (
        <div className="track-map-container__loading">
          <div className="track-map-container__spinner"></div>
          <span>加载中...</span>
        </div>
      )}
      
      {error && (
        <div className="track-map-container__error">
          <div className="track-map-container__error-title">加载失败</div>
          <div className="track-map-container__error-message">{error.message}</div>
        </div>
      )}

      {!loading && !error && (
        <>
          {!dateRange || !dateRange[0] || !dateRange[1] ? (
            <div className="track-map-container__empty">
              <div className="track-map-container__empty-text">请选择时间范围</div>
            </div>
          ) : trackData.length === 0 ? (
            <div className="track-map-container__empty">
              <div className="track-map-container__empty-text">该时间范围内暂无轨迹数据</div>
            </div>
          ) : (
            <TrackMap trackData={trackData} />
          )}
        </>
      )}
    </div>
  );
};

export default TrackMapContainer;

