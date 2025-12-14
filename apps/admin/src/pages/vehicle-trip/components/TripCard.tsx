/**
 * 车辆行程卡片组件
 * 功能：以卡片形式展示单个行程数据
 */
import React from 'react';
import { Card, Row, Col, Space, Typography, Tag } from 'antd';
import { ClockCircleOutlined, CarOutlined, FireOutlined, StopOutlined } from '@ant-design/icons';
import { formatTimeWithWeekday } from '@/utils/format';
import type { IVehicleTrip } from '@/types';

const { Text } = Typography;

interface TripCardProps {
  trip: IVehicleTrip;
}

/**
 * 行程数据卡片组件
 */
const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  // 计算运行时长（秒转换为小时/分钟格式）
  const formatDuration = (seconds: number) => {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  // 获取异常行为标签列表
  const getAbnormalBehaviorTags = () => {
    const tags = [];
    if (trip.sharpAcceleration > 0) {
      tags.push(
        <Tag key="acc" color="warning">急加速 {trip.sharpAcceleration}次</Tag>
      );
    }
    if (trip.sharpDeceleration > 0) {
      tags.push(
        <Tag key="dec" color="error">急减速 {trip.sharpDeceleration}次</Tag>
      );
    }
    if (trip.sharpTurn > 0) {
      tags.push(
        <Tag key="turn" color="purple">急转弯 {trip.sharpTurn}次</Tag>
      );
    }
    return tags;
  };

  return (
    <Card
      style={{ marginBottom: 16 }}
      styles={{ body: { padding: 0 } }}
    >
      {/* 卡片头部 - 时间信息 + 关键数据 */}
      <div style={{
        background: 'linear-gradient(to right, #f0f9ff, #e0f2fe)',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <Row gutter={[8, 0]} align="middle">
          <Col span={4}>
            <Space size="small">
              <ClockCircleOutlined style={{ color: '#0ea5e9', fontSize: 14 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>开始时间</Text>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{formatTimeWithWeekday(trip.startTime)}</div>
              </div>
            </Space>
          </Col>
          <Col span={4}>
            <Space size="small">
              <StopOutlined style={{ color: '#f97316', fontSize: 14 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>结束时间</Text>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{formatTimeWithWeekday(trip.endTime)}</div>
              </div>
            </Space>
          </Col>
          <Col span={4}>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>运行时间</Text>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#0ea5e9' }}>
                {formatDuration(trip.raw_te_record_trip_run_time)}
              </div>
            </div>
          </Col>
          <Col span={4}>
            <Space size="small">
              <FireOutlined style={{ color: '#ef4444', fontSize: 14 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>油耗</Text>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#ef4444' }}>
                  {trip.consumption ? (trip.consumption / 1000).toFixed(2) : '-'} 升
                </div>
              </div>
            </Space>
          </Col>
          <Col span={4}>
            <Space size="small">
              <CarOutlined style={{ color: '#10b981', fontSize: 14 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>里程</Text>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#10b981' }}>
                  {trip.mileage ? (trip.mileage / 1000).toFixed(2) : '-'} 公里
                </div>
              </div>
            </Space>
          </Col>
          <Col span={4}>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>平均油耗</Text>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                {trip.raw_te_record_trip_avg_oil ? (trip.raw_te_record_trip_avg_oil / 10).toFixed(2) : '-'} 升/100km
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 卡片主体 - 数据展示 */}
      <div style={{ padding: '16px' }}>
        {/* 第一行：性能指标 + 异常行为标签 */}
        <Row gutter={[16, 12]} align="middle">
          <Col span={4}>
            <Space direction="vertical" size={2}>
              <Text type="secondary" style={{ fontSize: 11 }}>平均速度</Text>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#3b82f6' }}>
                {trip.velocity ?? '-'}
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 2 }}>km/h</Text>
              </div>
            </Space>
          </Col>
          <Col span={4}>
            <Space direction="vertical" size={2}>
              <Text type="secondary" style={{ fontSize: 11 }}>最大速度</Text>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#f97316' }}>
                {trip.maxSpeed ?? '-'}
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 2 }}>km/h</Text>
              </div>
            </Space>
          </Col>
          <Col span={4}>
            <Space direction="vertical" size={2}>
              <Text type="secondary" style={{ fontSize: 11 }}>平均转速（rpm）</Text>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#8b5cf6' }}>
                {trip.raw_te_record_trip_avg_rpm ? trip.raw_te_record_trip_avg_rpm.toLocaleString() : '-'}
              </div>
            </Space>
          </Col>
          <Col span={4}>
            <Space direction="vertical" size={2}>
              <Text type="secondary" style={{ fontSize: 11 }}>最大转速（rpm）</Text>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#ec4899' }}>
                {trip.raw_te_record_trip_max_rpm ? trip.raw_te_record_trip_max_rpm.toLocaleString() : '-'}
              </div>
            </Space>
          </Col>
          <Col span={4}>
            {getAbnormalBehaviorTags().length > 0 ? (
              <Space size={8} wrap>
                {getAbnormalBehaviorTags()}
              </Space>
            ) : (
              <div style={{ height: 40 }} />
            )}
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default TripCard;
