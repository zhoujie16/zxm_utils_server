/**
 * 轨迹统计信息组件
 * 功能：显示轨迹统计信息
 */
import React from 'react';
import { Card, Space } from 'antd';
import type { IVehicleTrack } from '@shared-components/track-map';
import { formatTime } from '@shared-components/track-map';

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
    <Card size="small" title="轨迹统计">
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div>轨迹点数：{trackData.length} 个</div>
        {startPoint && (
          <div>起点时间：{formatTime(startPoint.gpsTime)}</div>
        )}
        {endPoint && (
          <div>终点时间：{formatTime(endPoint.gpsTime)}</div>
        )}
      </Space>
    </Card>
  );
};

export default TrackStatistics;

