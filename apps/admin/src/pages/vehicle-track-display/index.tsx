/**
 * 车辆轨迹显示页面
 * 功能：根据时间范围在地图上显示车辆运动轨迹
 */
import React from 'react';
import { Space } from 'antd';
import { useTrackDisplay } from './hooks/useTrackDisplay';
import TrackDisplayToolbar from './components/TrackDisplayToolbar';
import TrackMapContainer from './components/TrackMapContainer';

/**
 * 车辆轨迹显示页面组件
 */
const VehicleTrackDisplayPage: React.FC = () => {
  const { trackData, isLoading, error, refresh, dateRange, setDateRange } = useTrackDisplay();

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
    </Space>
  );
};

export default VehicleTrackDisplayPage;

