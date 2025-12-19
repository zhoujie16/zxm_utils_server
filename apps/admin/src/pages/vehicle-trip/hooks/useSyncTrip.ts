/**
 * 车辆行程同步 Hook
 * 功能：管理车辆行程数据同步的逻辑
 */
import { useState } from 'react';
import { message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ISyncTripParams, ISyncTripResponse } from '@/types';
import { syncTripData } from '@zxm-toolkit/http-client';

/**
 * 车辆行程同步 Hook 返回值类型
 */
export interface IUseSyncTripReturn {
  /** 同步加载状态 */
  isSyncing: boolean;
  /** 选择的月份 */
  selectedMonth: Dayjs | null;
  /** 设置选择的月份 */
  setSelectedMonth: (month: Dayjs | null) => void;
  /** 执行同步 */
  handleSync: () => Promise<void>;
}

/**
 * 车辆行程同步 Hook
 * @param onSyncSuccess 同步成功后的回调函数（用于刷新列表）
 * @returns Hook 返回值
 */
export const useSyncTrip = (onSyncSuccess?: () => void): IUseSyncTripReturn => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());

  /**
   * 执行同步操作
   */
  const handleSync = async () => {
    if (!selectedMonth) {
      message.warning('请选择要同步的月份');
      return;
    }

    setIsSyncing(true);

    try {
      const params: ISyncTripParams = {
        month: selectedMonth.format('YYYY-MM'),
      };

      const response: ISyncTripResponse = await syncTripData(params);

      // 显示成功提示
      message.success(response.message || `同步完成：成功 ${response.success} 条，失败 ${response.failed} 条`);

      // 执行成功回调（刷新列表）
      if (onSyncSuccess) {
        onSyncSuccess();
      }
    } catch (error: any) {
      // 显示错误提示
      const errorMessage = error?.response?.data?.message || error?.message || '同步失败，请稍后重试';
      message.error(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    selectedMonth,
    setSelectedMonth,
    handleSync,
  };
};

