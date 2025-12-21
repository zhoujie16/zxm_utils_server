/**
 * 坐标转换抽屉组件
 * 功能：提供批量转换坐标的功能，使用 Tabs 分别展示缺少 GCJ-02 和 WGS84 坐标的数据
 */
import React, { useState, useMemo } from 'react';
import { Drawer, Tabs, Table, Button, Space, Spin, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import type { IVehicleTrack } from '@shared-components/track-map';
import { useTrackList as useHttpTrackList, convertGcj02Coordinates, convertWgs84Coordinates } from '@zxm-toolkit/http-client';
import { trackColumns } from '../config/columns';
import { DEFAULT_PAGINATION, TABLE_SIZE } from '@/constants/table';
import type { Dayjs } from 'dayjs';

const { TabPane } = Tabs;

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
  const [activeTab, setActiveTab] = useState<string>('gcj02');
  const [convertingGcj02, setConvertingGcj02] = useState(false);
  const [convertingWgs84, setConvertingWgs84] = useState(false);

  // 计算时间戳
  const startTime = useMemo(() => {
    return dateRange && dateRange[0] ? dateRange[0].startOf('day').valueOf() : undefined;
  }, [dateRange]);

  const endTime = useMemo(() => {
    return dateRange && dateRange[1] ? dateRange[1].endOf('day').valueOf() : undefined;
  }, [dateRange]);

  // 缺少 GCJ-02 坐标的数据列表
  const {
    data: gcj02Data,
    isLoading: gcj02Loading,
    refresh: refreshGcj02,
    page: gcj02Page,
    limit: gcj02Limit,
    setPage: setGcj02Page,
    setLimit: setGcj02Limit,
  } = useHttpTrackList(1, 10, startTime, endTime, true, false);

  // 缺少 WGS84 坐标的数据列表
  const {
    data: wgs84Data,
    isLoading: wgs84Loading,
    refresh: refreshWgs84,
    page: wgs84Page,
    limit: wgs84Limit,
    setPage: setWgs84Page,
    setLimit: setWgs84Limit,
  } = useHttpTrackList(1, 10, startTime, endTime, false, true);

  // 处理 GCJ-02 分页变化
  const handleGcj02PageChange = (newPage: number, newPageSize: number) => {
    setGcj02Page(newPage);
    setGcj02Limit(newPageSize);
  };

  // 处理 WGS84 分页变化
  const handleWgs84PageChange = (newPage: number, newPageSize: number) => {
    setWgs84Page(newPage);
    setWgs84Limit(newPageSize);
  };

  // 转换 GCJ-02 坐标
  const handleConvertGcj02 = async () => {
    try {
      setConvertingGcj02(true);
      const params = startTime && endTime ? { startTime, endTime } : undefined;
      const result = await convertGcj02Coordinates(params);
      message.success(result.message);
      refreshGcj02();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      message.error(`转换失败: ${error.message || '未知错误'}`);
    } finally {
      setConvertingGcj02(false);
    }
  };

  // 转换 WGS84 坐标
  const handleConvertWgs84 = async () => {
    try {
      setConvertingWgs84(true);
      const params = startTime && endTime ? { startTime, endTime } : undefined;
      const result = await convertWgs84Coordinates(params);
      message.success(result.message);
      refreshWgs84();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      message.error(`转换失败: ${error.message || '未知错误'}`);
    } finally {
      setConvertingWgs84(false);
    }
  };

  const gcj02List = gcj02Data?.data || [];
  const gcj02Total = gcj02Data?.pagination?.total || 0;

  const wgs84List = wgs84Data?.data || [];
  const wgs84Total = wgs84Data?.pagination?.total || 0;

  return (
    <Drawer
      title="坐标转换"
      width={1200}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={`缺少 GCJ-02 坐标 (${gcj02Total})`} key="gcj02">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>共 {gcj02Total} 条记录需要转换</span>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={handleConvertGcj02}
                loading={convertingGcj02}
                disabled={gcj02Total === 0}
              >
                转换 GCJ-02 坐标
              </Button>
            </div>
            <Spin spinning={gcj02Loading}>
              <Table<IVehicleTrack>
                columns={trackColumns}
                dataSource={gcj02List}
                rowKey="id"
                size={TABLE_SIZE}
                loading={gcj02Loading}
                scroll={{ x: 'max-content' }}
                pagination={{
                  ...DEFAULT_PAGINATION,
                  current: gcj02Page,
                  pageSize: gcj02Limit,
                  total: gcj02Total,
                  onChange: handleGcj02PageChange,
                  onShowSizeChange: handleGcj02PageChange,
                }}
              />
            </Spin>
          </Space>
        </TabPane>
        <TabPane tab={`缺少 WGS84 坐标 (${wgs84Total})`} key="wgs84">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>共 {wgs84Total} 条记录需要转换</span>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={handleConvertWgs84}
                loading={convertingWgs84}
                disabled={wgs84Total === 0}
              >
                转换 WGS84 坐标
              </Button>
            </div>
            <Spin spinning={wgs84Loading}>
              <Table<IVehicleTrack>
                columns={trackColumns}
                dataSource={wgs84List}
                rowKey="id"
                size={TABLE_SIZE}
                loading={wgs84Loading}
                scroll={{ x: 'max-content' }}
                pagination={{
                  ...DEFAULT_PAGINATION,
                  current: wgs84Page,
                  pageSize: wgs84Limit,
                  total: wgs84Total,
                  onChange: handleWgs84PageChange,
                  onShowSizeChange: handleWgs84PageChange,
                }}
              />
            </Spin>
          </Space>
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default CoordinateConvertDrawer;

