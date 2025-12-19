/**
 * 轨迹地图容器组件
 * 功能：包含地图展示、加载状态、错误处理等逻辑
 */
import React from 'react';
import { Card, Spin, Alert, Empty } from 'antd';
import type { Dayjs } from 'dayjs';
import { TrackMap } from '@shared-components/track-map';
import type { IVehicleTrack } from '@shared-components/track-map';

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
    <Card>
      <Spin spinning={loading}>
        {error && (
          <Alert
            message="加载失败"
            description={error.message}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {!dateRange || !dateRange[0] || !dateRange[1] ? (
          <Empty description="请选择时间范围" style={{ padding: '60px 0' }} />
        ) : trackData.length === 0 ? (
          <Empty description="该时间范围内暂无轨迹数据" style={{ padding: '60px 0' }} />
        ) : (
          <TrackMap trackData={trackData} />
        )}
      </Spin>
    </Card>
  );
};

export default TrackMapContainer;

