/**
 * @fileoverview 车辆轨迹页面
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import { useTrackDisplay } from './hooks/useTrackDisplay';
import TrackDisplayToolbar from './components/TrackDisplayToolbar';
import TrackMapContainer from './components/TrackMapContainer';
import TrackStatistics from './components/TrackStatistics';
import './index.less';

/**
 * 车辆轨迹页面组件
 */
const VehicleTrackPage: React.FC = () => {
  const { trackData, isLoading, error, refresh, dateRange, setDateRange } = useTrackDisplay();

  return (
    <div className="vehicle-track-page">
      <div className="vehicle-track-page__container">
        <TrackDisplayToolbar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRefresh={refresh}
          loading={isLoading}
        />

        <TrackMapContainer
          loading={isLoading}
          error={error}
          dateRange={dateRange}
          trackData={trackData}
        />

        <TrackStatistics trackData={trackData} />
      </div>
    </div>
  );
};

export default VehicleTrackPage;

