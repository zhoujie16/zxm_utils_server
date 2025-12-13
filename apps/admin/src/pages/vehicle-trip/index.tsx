/**
 * 车辆行程列表页面
 * 功能：展示车辆行程数据列表，支持分页和时间范围筛选
 */
import React from 'react';
import { Table, Card, DatePicker, Space, Button } from 'antd';
import { ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { DEFAULT_PAGINATION, TABLE_SIZE } from '@/constants/table';
import type { IVehicleTrip } from '@/types';
import PresetDateRangePicker from '@/components/PresetDateRangePicker';
import { useTripList } from './hooks/useTripList';
import { useSyncTrip } from './hooks/useSyncTrip';
import { tripColumns } from './config/columns';

const VehicleTripPage: React.FC = () => {
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
  } = useTripList();

  // 使用同步 Hook 管理同步逻辑
  const {
    isSyncing,
    selectedMonth,
    setSelectedMonth,
    handleSync,
  } = useSyncTrip(refresh);

  // 处理分页变化
  const handleTableChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setLimit(newPageSize);
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 操作区域 */}
      <Card size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* 查询筛选区域 - 左侧 */}
          <Space>
            <span style={{ fontWeight: 500 }}>数据查询：</span>
            <PresetDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
              allowClear
              disabled={isSyncing}
            />
            <Button icon={<ReloadOutlined />} onClick={refresh} loading={isLoading} disabled={isSyncing}>
              刷新
            </Button>
          </Space>

          {/* 同步数据区域 - 右侧 */}
          <Space>
            <span style={{ fontWeight: 500 }}>数据同步：</span>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={setSelectedMonth}
              format="YYYY-MM"
              placeholder="选择月份"
              allowClear={false}
              disabled={isSyncing}
            />
            <Button
              type="primary"
              icon={<SyncOutlined />}
              onClick={handleSync}
              loading={isSyncing}
              disabled={isSyncing}
            >
              同步数据
            </Button>
          </Space>
        </div>
      </Card>

      {/* 表格区域 */}
      <Card>
        <Table<IVehicleTrip>
          rowKey="id"
          columns={tripColumns}
          dataSource={data?.data || []}
          loading={isLoading || isSyncing}
          size={TABLE_SIZE}
          scroll={{ x: 4000 }}
          pagination={{
            ...DEFAULT_PAGINATION,
            current: page,
            pageSize: limit,
            total: data?.pagination?.total || 0,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
        />
      </Card>
    </Space>
  );
};

export default VehicleTripPage;

