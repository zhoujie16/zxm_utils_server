/**
 * 轨迹显示操作栏组件
 * 功能：提供时间范围选择和刷新操作
 */
import React from 'react';
import { Card, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import PresetDateRangePicker from '@/components/PresetDateRangePicker';

/**
 * 操作栏组件 Props
 */
export interface ITrackDisplayToolbarProps {
  /** 时间范围 */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  /** 设置时间范围 */
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  /** 刷新数据 */
  onRefresh: () => void;
  /** 加载状态 */
  loading?: boolean;
}

/**
 * 轨迹显示操作栏组件
 */
const TrackDisplayToolbar: React.FC<ITrackDisplayToolbarProps> = ({
  dateRange,
  onDateRangeChange,
  onRefresh,
  loading = false,
}) => {
  return (
    <Card size="small">
      <Space>
        <span style={{ fontWeight: 500 }}>时间范围：</span>
        <PresetDateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          format="YYYY-MM-DD"
          placeholder={['开始日期', '结束日期']}
          allowClear
        />
        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
          刷新
        </Button>
      </Space>
    </Card>
  );
};

export default TrackDisplayToolbar;

