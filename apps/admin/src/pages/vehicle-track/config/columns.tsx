/**
 * 车辆轨迹表格列配置
 * 功能：定义表格列的结构和渲染逻辑
 */
import type { ColumnsType } from 'antd/es/table';
import { formatTime } from '@/utils/format';
import type { IVehicleTrack } from '@/types';

/**
 * 车辆轨迹表格列配置
 */
export const trackColumns: ColumnsType<IVehicleTrack> = [
  {
    title: 'GPS时间',
    dataIndex: 'gpsTime',
    key: 'gpsTime',
    width: 180,
    fixed: 'left',
    render: (time: number) => formatTime(time),
  },
  {
    title: '门时间',
    dataIndex: 'gateTime',
    key: 'gateTime',
    width: 180,
    render: (time: number) => formatTime(time),
  },
  {
    title: '纬度',
    dataIndex: 'lat',
    key: 'lat',
    width: 120,
    align: 'right',
    render: (value: number) => value?.toFixed(6) ?? '-',
  },
  {
    title: '经度',
    dataIndex: 'lng',
    key: 'lng',
    width: 120,
    align: 'right',
    render: (value: number) => value?.toFixed(6) ?? '-',
  },
  {
    title: 'GPS速度（km/h）',
    dataIndex: 'gpsSpeed',
    key: 'gpsSpeed',
    width: 130,
    align: 'right',
    render: (value: number) => value?.toFixed(2) ?? '-',
  },
  {
    title: '方向（度）',
    dataIndex: 'direction',
    key: 'direction',
    width: 100,
    align: 'right',
  },
  {
    title: 'GPS模式',
    dataIndex: 'gpsMode',
    key: 'gpsMode',
    width: 100,
    align: 'center',
  },
  {
    title: '定位方法',
    dataIndex: 'posMethod',
    key: 'posMethod',
    width: 100,
    align: 'center',
  },
  {
    title: '定位类型',
    dataIndex: 'posType',
    key: 'posType',
    width: 100,
    align: 'center',
  },
  {
    title: '定位多重标志',
    dataIndex: 'posMulFlag',
    key: 'posMulFlag',
    width: 120,
    align: 'center',
  },
  {
    title: '精度',
    dataIndex: 'precision',
    key: 'precision',
    width: 80,
    align: 'center',
  },
  {
    title: '设备IMEI',
    dataIndex: 'imei',
    key: 'imei',
    width: 150,
  },
];
