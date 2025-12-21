/**
 * 缺少 GCJ-02 坐标 Tab 组件
 * 功能：展示和转换缺少 GCJ-02 坐标的轨迹数据
 */
import React, { useMemo } from 'react';
import { Space, Button, Table, Spin, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import type { IVehicleTrack } from '@shared-components/track-map';
import { useTrackList as useHttpTrackList, convertGcj02Coordinates } from '@zxm-toolkit/http-client';
import { trackColumns } from '../config/columns';
import { DEFAULT_PAGINATION, TABLE_SIZE } from '@/constants/table';
import type { Dayjs } from 'dayjs';

/**
 * GCJ-02 Tab 组件 Props
 */
export interface IGcj02TabProps {
  /** 时间范围（从父组件传入，用于筛选和转换） */
  dateRange: [Dayjs | null, Dayjs | null] | null;
  /** 刷新主列表的回调 */
  onRefresh?: () => void;
}

/**
 * 缺少 GCJ-02 坐标 Tab 组件
 */
const Gcj02Tab: React.FC<IGcj02TabProps> = ({ dateRange, onRefresh }) => {
  // 计算时间戳
  const startTime = useMemo(() => {
    return dateRange && dateRange[0] ? dateRange[0].startOf('day').valueOf() : undefined;
  }, [dateRange]);

  const endTime = useMemo(() => {
    return dateRange && dateRange[1] ? dateRange[1].endOf('day').valueOf() : undefined;
  }, [dateRange]);

  // 缺少 GCJ-02 坐标的数据列表
  const {
    data,
    isLoading,
    refresh,
    page,
    limit,
    setPage,
    setLimit,
  } = useHttpTrackList(1, 10, startTime, endTime, true, undefined);

  // 处理分页变化
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setLimit(newPageSize);
  };

  // 转换 GCJ-02 坐标
  const handleConvert = async () => {
    try {
      const params = startTime && endTime ? { startTime, endTime } : undefined;
      const result = await convertGcj02Coordinates(params);
      message.success(result.message);
      refresh();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      message.error(`转换失败: ${error.message || '未知错误'}`);
    }
  };

  const trackList = data?.data || [];
  const total = data?.pagination?.total || 0;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>共 {total} 条记录需要转换</span>
        <Button
          type="primary"
          icon={<SyncOutlined />}
          onClick={handleConvert}
          disabled={total === 0}
        >
          转换 GCJ-02 坐标
        </Button>
      </div>
      <Spin spinning={isLoading}>
        <Table<IVehicleTrack>
          columns={trackColumns}
          dataSource={trackList}
          rowKey="id"
          size={TABLE_SIZE}
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          pagination={{
            ...DEFAULT_PAGINATION,
            current: page,
            pageSize: limit,
            total,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
        />
      </Spin>
    </Space>
  );
};

export default Gcj02Tab;