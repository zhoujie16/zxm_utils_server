/**
 * 车辆轨迹数据同步页面
 * 功能：支持选择多个月份（可跳空），将月份拆分为每7天一个周期，按周期逐个同步车辆轨迹数据
 */
import React, { useMemo } from 'react';
import { Card, Space, Button, Tag, Progress, Statistic, Row, Col, Alert } from 'antd';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMultiMonthTrackSync, type IPeriodSyncStatus } from './hooks/useMultiMonthTrackSync';
import MonthGridPicker from '@/components/MonthGridPicker';

/**
 * 车辆轨迹同步页面组件
 */
const VehicleTrackSyncPage: React.FC = () => {
  const {
    isSyncing,
    selectedMonths,
    setSelectedMonths,
    syncStatusList,
    handleSync,
    reset,
  } = useMultiMonthTrackSync();

  /**
   * 获取状态标签
   */
  const getStatusTag = (status: IPeriodSyncStatus['status']) => {
    switch (status) {
      case 'pending':
        return <Tag color="default">待同步</Tag>;
      case 'syncing':
        return (
          <Tag color="processing" icon={<LoadingOutlined spin />}>
            同步中
          </Tag>
        );
      case 'success':
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            成功
          </Tag>
        );
      case 'failed':
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            失败
          </Tag>
        );
      default:
        return null;
    }
  };

  /**
   * 计算同步进度
   */
  const calculateProgress = () => {
    if (syncStatusList.length === 0) return 0;
    const completedCount = syncStatusList.filter(
      (item) => item.status === 'success' || item.status === 'failed'
    ).length;
    return Math.round((completedCount / syncStatusList.length) * 100);
  };

  /**
   * 计算统计信息
   */
  const calculateStatistics = () => {
    const total = syncStatusList.length;
    const success = syncStatusList.filter((item) => item.status === 'success').length;
    const failed = syncStatusList.filter((item) => item.status === 'failed').length;
    const pending = syncStatusList.filter((item) => item.status === 'pending').length;
    const syncing = syncStatusList.filter((item) => item.status === 'syncing').length;

    const totalSuccess = syncStatusList
      .filter((item) => item.status === 'success')
      .reduce((sum, item) => sum + (item.success || 0), 0);

    const totalFailed = syncStatusList
      .filter((item) => item.status === 'success')
      .reduce((sum, item) => sum + (item.failed || 0), 0);

    return {
      total,
      success,
      failed,
      pending,
      syncing,
      totalSuccess,
      totalFailed,
    };
  };

  /**
   * 按月份分组同步状态
   */
  const groupedByMonth = useMemo(() => {
    const grouped: Record<string, IPeriodSyncStatus[]> = {};
    syncStatusList.forEach((item) => {
      if (!grouped[item.month]) {
        grouped[item.month] = [];
      }
      grouped[item.month].push(item);
    });
    return grouped;
  }, [syncStatusList]);

  const stats = calculateStatistics();
  const progress = calculateProgress();

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 操作区域 */}
      <Card size="small" title="数据同步">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>选择月份：</div>
            <MonthGridPicker
              value={selectedMonths}
              onChange={setSelectedMonths}
              disabled={isSyncing}
            />
          </div>
          <Space>
            <Button
              type="primary"
              icon={<SyncOutlined />}
              onClick={handleSync}
              loading={isSyncing}
              disabled={isSyncing || selectedMonths.length === 0}
            >
              开始同步
            </Button>
            {syncStatusList.length > 0 && !isSyncing && (
              <Button onClick={reset}>重置</Button>
            )}
          </Space>

          {/* 进度条 */}
          {syncStatusList.length > 0 && (
            <div>
              <Progress
                percent={progress}
                status={isSyncing ? 'active' : stats.failed > 0 ? 'exception' : 'success'}
                format={(percent) => `${percent}%`}
              />
            </div>
          )}
        </Space>
      </Card>

      {/* 统计信息 */}
      {syncStatusList.length > 0 && (
        <Card size="small" title="同步统计">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title="总周期数" value={stats.total} />
            </Col>
            <Col span={6}>
              <Statistic
                title="成功周期"
                value={stats.success}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="失败周期"
                value={stats.failed}
                valueStyle={{ color: '#cf1322' }}
                prefix={<CloseCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="总成功记录"
                value={stats.totalSuccess}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
          </Row>
          {stats.totalFailed > 0 && (
            <Alert
              message={`总失败记录：${stats.totalFailed} 条`}
              type="warning"
              style={{ marginTop: 16 }}
            />
          )}
        </Card>
      )}

      {/* 同步状态列表（按月份分组） */}
      {syncStatusList.length > 0 && (
        <Card title="同步详情">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {Object.keys(groupedByMonth)
              .sort()
              .map((month) => {
                const periods = groupedByMonth[month];
                const monthSuccess = periods.filter((p) => p.status === 'success').length;
                const monthFailed = periods.filter((p) => p.status === 'failed').length;
                const monthTotal = periods.length;

                return (
                  <Card
                    key={month}
                    size="small"
                    title={
                      <Space>
                        <span style={{ fontWeight: 500 }}>{month}</span>
                        <Tag>{monthTotal} 个周期</Tag>
                        {monthSuccess > 0 && <Tag color="success">成功: {monthSuccess}</Tag>}
                        {monthFailed > 0 && <Tag color="error">失败: {monthFailed}</Tag>}
                      </Space>
                    }
                  >
                    <Row gutter={[16, 16]}>
                      {periods.map((item: IPeriodSyncStatus) => (
                        <Col key={`${item.month}-${item.period}`} span={8}>
                          <Card
                            size="small"
                            style={{
                              border:
                                item.status === 'failed'
                                  ? '1px solid #ff4d4f'
                                  : '1px solid #d9d9d9',
                            }}
                          >
                            <Space
                              direction="vertical"
                              size="small"
                              style={{ width: '100%' }}
                            >
                              <Space>
                                <span style={{ fontWeight: 500, fontSize: 12 }}>
                                  {item.period}
                                </span>
                                {getStatusTag(item.status)}
                              </Space>
                              {item.status === 'success' && (
                                <Space>
                                  <Tag color="success">成功：{item.success || 0} 条</Tag>
                                  {item.failed && item.failed > 0 && (
                                    <Tag color="warning">失败：{item.failed} 条</Tag>
                                  )}
                                </Space>
                              )}
                              {item.status === 'failed' && item.error && (
                                <Alert
                                  message={item.error}
                                  type="error"
                                  showIcon
                                  size="small"
                                />
                              )}
                            </Space>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                );
              })}
          </Space>
        </Card>
      )}

      {/* 空状态提示 */}
      {syncStatusList.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            请选择月份后点击"开始同步"按钮
          </div>
        </Card>
      )}
    </Space>
  );
};

export default VehicleTrackSyncPage;
