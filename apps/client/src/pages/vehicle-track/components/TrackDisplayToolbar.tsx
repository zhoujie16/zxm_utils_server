/**
 * @fileoverview 轨迹显示操作栏组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';
import dayjs, { type Dayjs } from 'dayjs';
import './TrackDisplayToolbar.less';

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
  /**
   * 处理开始日期变化
   */
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const startDate = value ? dayjs(value) : null;
    onDateRangeChange([startDate, dateRange?.[1] || null]);
  };

  /**
   * 处理结束日期变化
   */
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const endDate = value ? dayjs(value) : null;
    onDateRangeChange([dateRange?.[0] || null, endDate]);
  };

  /**
   * 格式化日期为 YYYY-MM-DD
   */
  const formatDate = (dayjs: Dayjs | null): string => {
    return dayjs ? dayjs.format('YYYY-MM-DD') : '';
  };

  return (
    <div className="track-display-toolbar">
      <div className="track-display-toolbar__content">
        <div className="track-display-toolbar__label">时间范围：</div>
        <div className="track-display-toolbar__date-range">
          <input
            className="track-display-toolbar__date-input"
            type="date"
            value={formatDate(dateRange?.[0] || null)}
            onChange={handleStartDateChange}
            placeholder="开始日期"
          />
          <span className="track-display-toolbar__separator">至</span>
          <input
            className="track-display-toolbar__date-input"
            type="date"
            value={formatDate(dateRange?.[1] || null)}
            onChange={handleEndDateChange}
            placeholder="结束日期"
          />
        </div>
        <button
          className={`track-display-toolbar__refresh ${loading ? 'track-display-toolbar__refresh--loading' : ''}`}
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={16} className="track-display-toolbar__refresh-icon" />
          <span>刷新</span>
        </button>
      </div>
    </div>
  );
};

export default TrackDisplayToolbar;

