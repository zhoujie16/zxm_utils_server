/**
 * 坐标转换抽屉组件
 * 功能：提供批量转换 BD-09 到 GCJ-02 坐标的功能
 */
import React from 'react';
import { Drawer } from 'antd';
import Gcj02Tab from './Gcj02Tab';
import type { Dayjs } from 'dayjs';

/**
 * 坐标转换抽屉组件 Props
 */
export interface ICoordinateConvertDrawerProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 时间范围（从父组件传入，用于筛选和转换） */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  /** 刷新主列表的回调 */
  onRefresh?: () => void;
}

/**
 * 坐标转换抽屉组件
 */
const CoordinateConvertDrawer: React.FC<ICoordinateConvertDrawerProps> = ({
  open,
  onClose,
  dateRange,
  onRefresh,
}) => {

  return (
    <Drawer
      title="坐标转换"
      width={1200}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      <Gcj02Tab dateRange={dateRange} onRefresh={onRefresh} />
    </Drawer>
  );
};

export default CoordinateConvertDrawer;

