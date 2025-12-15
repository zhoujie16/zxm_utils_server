/**
 * 车辆行程列表页面
 * 功能：展示车辆行程数据列表，支持分页和时间范围筛选
 */
import React from 'react';
import { Card, Space, Button, Pagination, Spin, Empty } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { IVehicleTrip } from '@/types';
import PresetDateRangePicker from '@/components/PresetDateRangePicker';
import { useTripList } from './hooks/useTripList';
import TripCard from './components/TripCard';

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

  // 处理分页变化
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setLimit(newPageSize);
  };

  const tripList = data?.data || [];
  const total = data?.pagination?.total || 0;

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
            />
            <Button icon={<ReloadOutlined />} onClick={refresh} loading={isLoading}>
              刷新
            </Button>
          </Space>
        </div>
      </Card>

      {/* 卡片列表区域 */}
      <Card>
        <Spin spinning={isLoading}>
          {tripList.length > 0 ? (
            <>
              <div>
                {tripList.map((trip: IVehicleTrip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Pagination
                  current={page}
                  pageSize={limit}
                  total={total}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 条`}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <Empty description="暂无数据" />
          )}
        </Spin>
      </Card>
    </Space>
  );
};

export default VehicleTripPage;

