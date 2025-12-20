/**
 * @fileoverview 时间范围选择弹窗组件
 * @author Claude
 * @created 2024-01-01
 */

import React, { useState, useEffect } from 'react';
import { Popup, Button, DatePicker } from 'antd-mobile';
import dayjs, { type Dayjs } from 'dayjs';
import './index.less';

/**
 * 时间范围选择弹窗组件 Props
 */
export interface IDateRangePickerModalProps {
  /** 是否显示 */
  visible: boolean;
  /** 当前选择的时间范围 */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  /** 确认回调 */
  onConfirm: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  /** 取消回调 */
  onCancel: () => void;
}

/**
 * 快速时间选项类型
 */
type QuickTimeOption = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'custom';

/**
 * 时间范围选择弹窗组件
 */
const DateRangePickerModal: React.FC<IDateRangePickerModalProps> = ({
  visible,
  dateRange,
  onConfirm,
  onCancel,
}) => {
  const [selectedOption, setSelectedOption] = useState<QuickTimeOption>('custom');
  const [tempStartDate, setTempStartDate] = useState<Date | null>(
    dateRange?.[0]?.toDate() || null
  );
  const [tempEndDate, setTempEndDate] = useState<Date | null>(
    dateRange?.[1]?.toDate() || null
  );
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);

  /**
   * 当弹窗打开时，初始化临时值
   */
  useEffect(() => {
    if (visible) {
      setTempStartDate(dateRange?.[0]?.toDate() || null);
      setTempEndDate(dateRange?.[1]?.toDate() || null);
      // 判断当前时间范围属于哪个快速选项
      detectQuickOption();
    }
  }, [visible, dateRange]);

  /**
   * 检测当前时间范围属于哪个快速选项
   */
  const detectQuickOption = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      setSelectedOption('custom');
      return;
    }

    const start = dateRange[0];
    const end = dateRange[1];
    const today = dayjs().startOf('day');
    const yesterday = today.subtract(1, 'day');
    const thisWeekStart = today.startOf('week');
    const thisWeekEnd = today.endOf('week');
    const lastWeekStart = thisWeekStart.subtract(1, 'week');
    const lastWeekEnd = thisWeekEnd.subtract(1, 'week');

    if (start.isSame(today, 'day') && end.isSame(today, 'day')) {
      setSelectedOption('today');
    } else if (start.isSame(yesterday, 'day') && end.isSame(yesterday, 'day')) {
      setSelectedOption('yesterday');
    } else if (start.isSame(thisWeekStart, 'day') && end.isSame(thisWeekEnd, 'day')) {
      setSelectedOption('thisWeek');
    } else if (start.isSame(lastWeekStart, 'day') && end.isSame(lastWeekEnd, 'day')) {
      setSelectedOption('lastWeek');
    } else {
      setSelectedOption('custom');
    }
  };

  /**
   * 处理快速时间选择
   */
  const handleQuickSelect = (option: QuickTimeOption) => {
    setSelectedOption(option);
    let start: Dayjs;
    let end: Dayjs;

    switch (option) {
      case 'today':
        start = dayjs().startOf('day');
        end = dayjs().endOf('day');
        break;
      case 'yesterday':
        start = dayjs().subtract(1, 'day').startOf('day');
        end = dayjs().subtract(1, 'day').endOf('day');
        break;
      case 'thisWeek':
        start = dayjs().startOf('week');
        end = dayjs().endOf('week');
        break;
      case 'lastWeek':
        start = dayjs().subtract(1, 'week').startOf('week');
        end = dayjs().subtract(1, 'week').endOf('week');
        break;
      default:
        return;
    }

    setTempStartDate(start.toDate());
    setTempEndDate(end.toDate());
  };

  /**
   * 处理确认
   */
  const handleConfirm = () => {
    if (tempStartDate && tempEndDate) {
      const startDate = dayjs(tempStartDate);
      const endDate = dayjs(tempEndDate);
      // 确保开始日期小于等于结束日期
      if (startDate.isAfter(endDate)) {
        onConfirm([endDate.startOf('day'), startDate.endOf('day')]);
      } else {
        onConfirm([startDate.startOf('day'), endDate.endOf('day')]);
      }
    } else {
      onConfirm(null);
    }
    onCancel();
  };

  /**
   * 处理取消
   */
  const handleCancel = () => {
    setTempStartDate(dateRange?.[0]?.toDate() || null);
    setTempEndDate(dateRange?.[1]?.toDate() || null);
    detectQuickOption();
    onCancel();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={handleCancel}
      onClose={handleCancel}
      position="bottom"
    >
      <div className="date-range-picker-modal">
        <div className="date-range-picker-modal__header">
          <h3 className="date-range-picker-modal__title">选择时间范围</h3>
        </div>

        <div className="date-range-picker-modal__quick-options">
          <Button
            className={`date-range-picker-modal__quick-btn ${
              selectedOption === 'today' ? 'date-range-picker-modal__quick-btn--active' : ''
            }`}
            onClick={() => handleQuickSelect('today')}
            fill="outline"
          >
            今天
          </Button>
          <Button
            className={`date-range-picker-modal__quick-btn ${
              selectedOption === 'yesterday' ? 'date-range-picker-modal__quick-btn--active' : ''
            }`}
            onClick={() => handleQuickSelect('yesterday')}
            fill="outline"
          >
            昨天
          </Button>
          <Button
            className={`date-range-picker-modal__quick-btn ${
              selectedOption === 'thisWeek' ? 'date-range-picker-modal__quick-btn--active' : ''
            }`}
            onClick={() => handleQuickSelect('thisWeek')}
            fill="outline"
          >
            本周
          </Button>
          <Button
            className={`date-range-picker-modal__quick-btn ${
              selectedOption === 'lastWeek' ? 'date-range-picker-modal__quick-btn--active' : ''
            }`}
            onClick={() => handleQuickSelect('lastWeek')}
            fill="outline"
          >
            上周
          </Button>
        </div>

        <div className="date-range-picker-modal__custom-section">
          <div className="date-range-picker-modal__custom-label">自定义时间范围</div>
          <div className="date-range-picker-modal__date-pickers">
            <div className="date-range-picker-modal__picker-item">
              <div className="date-range-picker-modal__picker-label">开始日期</div>
              <DatePicker
                visible={startPickerVisible}
                value={tempStartDate}
                onConfirm={(val: Date | null) => {
                  setTempStartDate(val);
                  setStartPickerVisible(false);
                  setSelectedOption('custom');
                }}
                onClose={() => setStartPickerVisible(false)}
                min={new Date(2020, 0, 1)}
                max={tempEndDate || new Date()}
                precision="day"
              >
                {(value: Date | null) => (
                  <Button
                    fill="none"
                    className="date-range-picker-modal__picker-button"
                    onClick={() => setStartPickerVisible(true)}
                  >
                    {value ? dayjs(value).format('YYYY-MM-DD') : '请选择'}
                  </Button>
                )}
              </DatePicker>
            </div>
            <div className="date-range-picker-modal__picker-item">
              <div className="date-range-picker-modal__picker-label">结束日期</div>
              <DatePicker
                visible={endPickerVisible}
                value={tempEndDate}
                onConfirm={(val: Date | null) => {
                  setTempEndDate(val);
                  setEndPickerVisible(false);
                  setSelectedOption('custom');
                }}
                onClose={() => setEndPickerVisible(false)}
                min={tempStartDate || new Date(2020, 0, 1)}
                max={new Date()}
                precision="day"
              >
                {(value: Date | null) => (
                  <Button
                    fill="none"
                    className="date-range-picker-modal__picker-button"
                    onClick={() => setEndPickerVisible(true)}
                  >
                    {value ? dayjs(value).format('YYYY-MM-DD') : '请选择'}
                  </Button>
                )}
              </DatePicker>
            </div>
          </div>
        </div>

        <div className="date-range-picker-modal__actions">
          <Button onClick={handleCancel} className="date-range-picker-modal__cancel-btn">
            取消
          </Button>
          <Button
            color="primary"
            onClick={handleConfirm}
            className="date-range-picker-modal__confirm-btn"
          >
            确认
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default DateRangePickerModal;

