/**
 * 多月份车辆轨迹同步 Hook
 * 功能：管理多个月份的车辆轨迹数据同步逻辑，将月份拆分为每日一个周期
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import type { ISyncTrackParams, ISyncTrackResponse } from '@/types';
import { syncTrackData } from '@zxm-toolkit/http-client';

/**
 * 单个周期同步状态
 */
export interface IPeriodSyncStatus {
  /** 所属月份（格式：YYYY-MM） */
  month: string;
  /** 周期标识（如 "2025-12-01 ~ 2025-12-07"） */
  period: string;
  /** 开始时间字符串（格式：YYYY-MM-DD HH:mm:ss） */
  startTime: string;
  /** 结束时间字符串（格式：YYYY-MM-DD HH:mm:ss） */
  endTime: string;
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
 * 多月份轨迹同步 Hook 返回值类型
 */
export interface IUseMultiMonthTrackSyncReturn {
  /** 是否正在同步 */
  isSyncing: boolean;
  /** 选择的月份列表（格式：['YYYY-MM', ...]） */
  selectedMonths: string[];
  /** 设置选择的月份列表 */
  setSelectedMonths: (months: string[]) => void;
  /** 同步状态列表 */
  syncStatusList: IPeriodSyncStatus[];
  /** 执行同步 */
  handleSync: () => Promise<void>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 将月份拆分为多个1天周期
 * @param month 月份（格式：YYYY-MM）
 * @returns 周期列表
 */
const splitMonthIntoPeriods = (month: string): Array<{ startTime: string; endTime: string; period: string }> => {
  const [year, monthNum] = month.split('-').map(Number);
  
  // 计算月份的开始和结束日期
  const startDate = dayjs(`${year}-${String(monthNum).padStart(2, '0')}-01`);
  const endDate = startDate.endOf('month');
  
  const periods: Array<{ startTime: string; endTime: string; period: string }> = [];
  let currentStart = startDate;
  
  while (currentStart.isBefore(endDate) || currentStart.isSame(endDate, 'day')) {
    // 当前周期为当日
    const periodEnd = currentStart;
    const actualEnd = periodEnd.isAfter(endDate) ? endDate : periodEnd;
    
    // 格式化时间
    const startTimeStr = currentStart.format('YYYY-MM-DD HH:mm:ss');
    const endTimeStr = actualEnd.format('YYYY-MM-DD 23:59:59');
    
    // 生成周期标识
    const periodLabel = currentStart.format('YYYY-MM-DD') + ' ~ ' + actualEnd.format('YYYY-MM-DD');
    
    periods.push({
      startTime: startTimeStr,
      endTime: endTimeStr,
      period: periodLabel,
    });
    
    // 下一个周期从当前周期结束的第二天开始
    const nextStart = actualEnd.add(1, 'day').startOf('day');
    
    // 如果下一个周期的开始时间已经超过月份结束时间，则退出循环
    if (nextStart.isAfter(endDate)) {
      break;
    }
    
    currentStart = nextStart;
  }
  
  return periods;
};

/**
 * 多月份车辆轨迹同步 Hook
 * @returns Hook 返回值
 */
export const useMultiMonthTrackSync = (): IUseMultiMonthTrackSyncReturn => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [syncStatusList, setSyncStatusList] = useState<IPeriodSyncStatus[]>([]);

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

    // 将所有月份拆分为周期，并初始化同步状态列表
    const allPeriods: IPeriodSyncStatus[] = [];
    months.forEach((month) => {
      const periods = splitMonthIntoPeriods(month);
      periods.forEach((period) => {
        allPeriods.push({
          month,
          period: period.period,
          startTime: period.startTime,
          endTime: period.endTime,
          status: 'pending',
        });
      });
    });

    setSyncStatusList(allPeriods);
    setIsSyncing(true);

    // 按周期顺序逐个同步
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < allPeriods.length; i++) {
      const period = allPeriods[i];

      // 更新当前周期状态为同步中
      setSyncStatusList((prev) =>
        prev.map((item) =>
          item.month === period.month && item.period === period.period
            ? { ...item, status: 'syncing' }
            : item
        )
      );

      try {
        const params: ISyncTrackParams = {
          startTime: period.startTime,
          endTime: period.endTime,
        };

        const response: ISyncTrackResponse = await syncTrackData(params);

        // 更新当前周期状态为成功
        setSyncStatusList((prev) =>
          prev.map((item) =>
            item.month === period.month && item.period === period.period
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
        // 更新当前周期状态为失败
        const errorMessage = error?.response?.data?.message || error?.message || '同步失败';
        setSyncStatusList((prev) =>
          prev.map((item) =>
            item.month === period.month && item.period === period.period
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
    const totalPeriods = allPeriods.length;
    if (failedCount === 0) {
      message.success(`所有周期同步完成：成功 ${totalPeriods} 个周期`);
    } else {
      message.warning(`同步完成：成功 ${successCount} 个周期，失败 ${failedCount} 个周期`);
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
