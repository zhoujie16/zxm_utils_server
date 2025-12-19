/**
 * 车辆轨迹列表页面
 * 功能：展示车辆轨迹数据列表，支持分页和时间范围筛选
 */
import React from 'react';
import { Card, Space, Button, Table, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { IVehicleTrack } from '@shared-components/track-map';
import PresetDateRangePicker from '@/components/PresetDateRangePicker';
import { useTrackList } from './hooks/useTrackList';
import { trackColumns } from './config/columns';
import { DEFAULT_PAGINATION, TABLE_SIZE } from '@/constants/table';

const VehicleTrackPage: React.FC = () => {
  // 使用自定义 Hook 管理数据逻辑
  const {
    data,
    isLoading,
    refresh,
    page,
    limit,
    dateRange,
    setPage,
    setLimit,
    setDateRange,
  } = useTrackList();

  // 处理分页变化
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setLimit(newPageSize);
  };

  const trackList = data?.data || [];
  const total = data?.pagination?.total || 0;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 操作区域 */}
      <Card size="small">
        <Space>
          <span style={{ fontWeight: 500 }}>数据查询：</span>
          <PresetDateRangePicker
            value={dateRange}
            onChange={setDateRange}
            format="YYYY-MM-DD"
            placeholder={['开始日期', '结束日期']}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={refresh} loading={isLoading}>
            刷新
          </Button>
        </Space>
      </Card>

      {/* 表格区域 */}
      <Card>
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
      </Card>
    </Space>
  );
};

export default VehicleTrackPage;

