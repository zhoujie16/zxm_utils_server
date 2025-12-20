/**
 * @fileoverview 轨迹显示操作栏组件
 * @author Claude
 * @created 2024-01-01
 */

import React, { useState } from 'react';
import { Button, Toast } from 'antd-mobile';
import dayjs, { type Dayjs } from 'dayjs';
import DateRangePickerModal from '../../../../components/DateRangePickerModal';
import './index.less';

/**
 * 操作栏组件 Props
 */
export interface ITrackDisplayToolbarProps {
  /** 时间范围 */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  /** 设置时间范围 */
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  /** 刷新数据 */
  onRefresh: () => Promise<unknown[]>;
  /** 加载状态 */
  loading?: boolean;
  /** 轨迹数据 */
  trackData?: unknown[];
}

/**
 * 轨迹显示操作栏组件
 */
const TrackDisplayToolbar: React.FC<ITrackDisplayToolbarProps> = ({
  dateRange,
  onDateRangeChange,
  onRefresh,
  loading = false,
  trackData = [],
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * 格式化日期显示文本
   */
  const formatDisplayText = (): string => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return '请选择时间范围';
    }
    return `${dateRange[0].format('YYYY-MM-DD')} 至 ${dateRange[1].format('YYYY-MM-DD')}`;
  };

  /**
   * 处理确认时间选择
   */
  const handleConfirm = (dates: [Dayjs | null, Dayjs | null] | null) => {
    onDateRangeChange(dates);
    setModalVisible(false);
  };

  /**
   * 处理取消时间选择
   */
  const handleCancel = () => {
    setModalVisible(false);
  };

  /**
   * 处理刷新
   */
  const handleRefresh = async () => {
    try {
      const data = await onRefresh();
      // 检查是否有数据
      if (!data || data.length === 0) {
        Toast.show({
          content: '暂无轨迹数据',
          position: 'bottom',
        });
      } else {
        Toast.show({
          content: '刷新成功',
          position: 'bottom',
        });
      }
    } catch (error) {
      Toast.show({
        content: '刷新失败，请重试',
        position: 'bottom',
      });
    }
  };

  return (
    <div className="track-display-toolbar">
      <div className="track-display-toolbar__content">
        <div className="track-display-toolbar__date-text">{formatDisplayText()}</div>
        <Button
          color="primary"
          onClick={() => setModalVisible(true)}
          className="track-display-toolbar__modify-btn"
        >
          修改
        </Button>
        <Button
          color="primary"
          loading={loading}
          onClick={handleRefresh}
          className="track-display-toolbar__refresh"
        >
          刷新
        </Button>
      </div>
      <DateRangePickerModal
        visible={modalVisible}
        dateRange={dateRange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default TrackDisplayToolbar;

