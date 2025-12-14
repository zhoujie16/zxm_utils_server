/**
 * 多月份车辆行程同步 Hook
 * 功能：管理多个月份的车辆行程数据同步逻辑
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import type { ISyncTripParams, ISyncTripResponse } from '@/types';
import { syncTripData } from '@/services/vehicle-trip';

/**
 * 单个月份同步状态
 */
export interface IMonthSyncStatus {
  /** 月份（格式：YYYY-MM） */
  month: string;
  /** 同步状态：pending-待同步, syncing-同步中, success-成功, failed-失败 */
  status: 'pending' | 'syncing' | 'success' | 'failed';
  /** 成功数量 */
  success?: number;
  /** 失败数量 */
  failed?: number;
  /** 错误信息 */
  error?: string;
}

/**
 * 多月份同步 Hook 返回值类型
 */
export interface IUseMultiMonthSyncReturn {
  /** 是否正在同步 */
  isSyncing: boolean;
  /** 选择的月份列表（格式：['YYYY-MM', ...]） */
  selectedMonths: string[];
  /** 设置选择的月份列表 */
  setSelectedMonths: (months: string[]) => void;
  /** 同步状态列表 */
  syncStatusList: IMonthSyncStatus[];
  /** 执行同步 */
  handleSync: () => Promise<void>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 多月份车辆行程同步 Hook
 * @returns Hook 返回值
 */
export const useMultiMonthSync = (): IUseMultiMonthSyncReturn => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [syncStatusList, setSyncStatusList] = useState<IMonthSyncStatus[]>([]);

  /**
   * 执行同步操作
   */
  const handleSync = useCallback(async () => {
    if (selectedMonths.length === 0) {
      message.warning('请选择要同步的月份');
      return;
    }

    // 对月份进行排序（按时间顺序）
    const months = [...selectedMonths].sort();

    // 初始化同步状态列表
    const initialStatusList: IMonthSyncStatus[] = months.map((month) => ({
      month,
      status: 'pending',
    }));
    setSyncStatusList(initialStatusList);
    setIsSyncing(true);

    // 按月份顺序逐个同步
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < months.length; i++) {
      const month = months[i];

      // 更新当前月份状态为同步中
      setSyncStatusList((prev) =>
        prev.map((item) => (item.month === month ? { ...item, status: 'syncing' } : item))
      );

      try {
        const params: ISyncTripParams = {
          month,
        };

        const response: ISyncTripResponse = await syncTripData(params);

        // 更新当前月份状态为成功
        setSyncStatusList((prev) =>
          prev.map((item) =>
            item.month === month
              ? {
                  ...item,
                  status: 'success',
                  success: response.success,
                  failed: response.failed,
                }
              : item
          )
        );
        successCount++;
      } catch (error: any) {
        // 更新当前月份状态为失败
        const errorMessage = error?.response?.data?.message || error?.message || '同步失败';
        setSyncStatusList((prev) =>
          prev.map((item) =>
            item.month === month
              ? {
                  ...item,
                  status: 'failed',
                  error: errorMessage,
                }
              : item
          )
        );
        failedCount++;
      }
    }

    // 显示汇总结果
    if (failedCount === 0) {
      message.success(`所有月份同步完成：成功 ${months.length} 个月份`);
    } else {
      message.warning(`同步完成：成功 ${successCount} 个月份，失败 ${failedCount} 个月份`);
    }

    setIsSyncing(false);
  }, [selectedMonths]);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setSyncStatusList([]);
    setSelectedMonths([]);
  }, []);

  return {
    isSyncing,
    selectedMonths,
    setSelectedMonths,
    syncStatusList,
    handleSync,
    reset,
  };
};

