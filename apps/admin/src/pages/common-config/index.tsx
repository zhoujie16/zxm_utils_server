/**
 * 公共配置管理页面
 * 功能：管理固定业务配置项
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Switch,
  Tag,
  Typography,
} from 'antd';
import { CopyOutlined, EditOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import type { ICommonConfig } from '@/types';
import {
  createConfig,
  getConfigList,
  refreshConfigToken,
  updateConfig,
} from '@zxm-toolkit/http-client';
import './index.less';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

interface IConfigMeta {
  key: string;
  title: string;
  description: string;
  refreshReserved: boolean;
  refreshEnabled?: boolean;
  editableExtra?: boolean;
}

interface IConfigFormValues {
  configValue?: string;
  configExtra?: string;
  isEnabled: boolean;
}

const CONFIG_ITEMS: IConfigMeta[] = [
  {
    key: 'WanCheBaoToken',
    title: '万车宝 Token',
    description: '用于同步万车宝车辆、行程和轨迹数据。',
    refreshReserved: true,
  },
  {
    key: 'TuQiangToken',
    title: '途强 Token',
    description: '用于同步途强平台车辆和定位数据。',
    refreshReserved: true,
    refreshEnabled: true,
    editableExtra: true,
  },
  {
    key: 'BaiduMapApiKey',
    title: '百度地图 API Key',
    description: '用于地图展示、逆地理编码等百度地图能力。',
    refreshReserved: false,
  },
];

const CommonConfigPage: React.FC = () => {
  const [configList, setConfigList] = useState<ICommonConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshingKey, setRefreshingKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeta, setEditingMeta] = useState<IConfigMeta | null>(null);
  const [form] = Form.useForm<IConfigFormValues>();

  const configMap = useMemo(() => {
    return configList.reduce<Record<string, ICommonConfig>>((map, config) => {
      map[config.configKey] = config;
      return map;
    }, {});
  }, [configList]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getConfigList();
      setConfigList(data);
    } catch (error) {
      message.error('加载业务配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = async (value?: string) => {
    if (!value) {
      message.warning('当前配置值为空');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      message.success('已复制到剪贴板');
    } catch (error) {
      message.error('复制失败，请手动复制');
    }
  };

  const handleEdit = (meta: IConfigMeta) => {
    const config = configMap[meta.key];
    setEditingMeta(meta);
    form.setFieldsValue({
      configValue: config?.configValue || '',
      configExtra: config?.configExtra || '',
      isEnabled: config?.isEnabled ?? true,
    });
    setModalVisible(true);
  };

  const handleSave = async (values: IConfigFormValues) => {
    if (!editingMeta) {
      return;
    }

    const currentConfig = configMap[editingMeta.key];
    const extraPayload = editingMeta.editableExtra ? { configExtra: values.configExtra || '' } : {};
    setSaving(true);
    try {
      if (currentConfig) {
        await updateConfig(currentConfig.id, {
          configValue: values.configValue || '',
          ...extraPayload,
          isEnabled: values.isEnabled,
        });
      } else {
        await createConfig({
          configKey: editingMeta.key,
          configValue: values.configValue || '',
          ...extraPayload,
          description: editingMeta.description,
          sortOrder: CONFIG_ITEMS.findIndex(item => item.key === editingMeta.key),
          isEnabled: values.isEnabled,
        });
      }

      message.success('配置保存成功');
      setModalVisible(false);
      setEditingMeta(null);
      form.resetFields();
      loadData();
    } catch (error) {
      message.error('配置保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (meta: IConfigMeta, enabled: boolean) => {
    const config = configMap[meta.key];
    if (!config) {
      message.warning('请先配置该项内容');
      return;
    }

    try {
      await updateConfig(config.id, { isEnabled: enabled });
      message.success(enabled ? '配置已启用' : '配置已停用');
      loadData();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleRefreshToken = async (meta: IConfigMeta) => {
    setRefreshingKey(meta.key);
    try {
      await refreshConfigToken(meta.key);
      message.success(`${meta.title} 更新成功`);
      loadData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '一键更新失败';
      message.error(errorMessage);
    } finally {
      setRefreshingKey(null);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMeta(null);
    form.resetFields();
  };

  return (
    <Space direction='vertical' size='middle' className='common-config-page'>
      <Card size='small'>
        <div className='common-config-page__toolbar'>
          <div>
            <div className='common-config-page__title'>业务配置</div>
            <Text type='secondary'>管理系统运行所需的固定平台凭证和地图密钥。</Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新
          </Button>
        </div>
      </Card>

      <Spin spinning={loading}>
        <div className='common-config-page__list'>
          {CONFIG_ITEMS.map(meta => {
            const config = configMap[meta.key];
            const configured = Boolean(config?.configValue);
            const enabled = config?.isEnabled ?? true;

            return (
              <Card
                key={meta.key}
                className='common-config-page__item'
                title={
                  <Space size='small' wrap>
                    <span>{meta.title}</span>
                    {configured ? <Tag color='green'>已配置</Tag> : <Tag>未配置</Tag>}
                    {enabled ? <Tag color='blue'>启用中</Tag> : <Tag color='default'>已停用</Tag>}
                  </Space>
                }
                extra={
                  <Space wrap>
                    {meta.refreshReserved && (
                      <Button
                        icon={<SyncOutlined />}
                        disabled={!meta.refreshEnabled}
                        loading={refreshingKey === meta.key}
                        onClick={() => handleRefreshToken(meta)}
                      >
                        一键更新
                      </Button>
                    )}
                    <Button icon={<CopyOutlined />} onClick={() => handleCopy(config?.configValue)}>
                      复制
                    </Button>
                    <Button type='primary' icon={<EditOutlined />} onClick={() => handleEdit(meta)}>
                      编辑
                    </Button>
                  </Space>
                }
              >
                <Space direction='vertical' size='middle' className='common-config-page__content'>
                  <Text type='secondary'>{meta.description}</Text>
                  {configured ? (
                    <Paragraph className='common-config-page__value' copyable={false}>
                      {config?.configValue}
                    </Paragraph>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无配置值' />
                  )}
                  <div className='common-config-page__status'>
                    <Text>启用状态</Text>
                    <Switch
                      checked={enabled}
                      checkedChildren='启用'
                      unCheckedChildren='停用'
                      onChange={checked => handleToggleEnabled(meta, checked)}
                    />
                  </div>
                </Space>
              </Card>
            );
          })}
        </div>
      </Spin>

      <Modal
        title={editingMeta ? `编辑${editingMeta.title}` : '编辑配置'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSave}
          initialValues={{ configValue: '', configExtra: '', isEnabled: true }}
        >
          <Form.Item label='配置值' name='configValue'>
            <TextArea rows={6} placeholder='请输入配置值' />
          </Form.Item>

          {editingMeta?.editableExtra && (
            <Form.Item
              label='扩展配置 JSON'
              name='configExtra'
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve();
                    }
                    try {
                      JSON.parse(value);
                      return Promise.resolve();
                    } catch (error) {
                      return Promise.reject(new Error('请输入有效的 JSON 字符串'));
                    }
                  },
                },
              ]}
            >
              <TextArea
                rows={5}
                placeholder='例如：{"loginApiData":"ver=1&method=login&account=..."}'
              />
            </Form.Item>
          )}

          <Form.Item label='启用状态' name='isEnabled' valuePropName='checked'>
            <Switch checkedChildren='启用' unCheckedChildren='停用' />
          </Form.Item>

          <Form.Item className='common-config-page__modal-actions'>
            <Space>
              <Button onClick={closeModal}>取消</Button>
              <Button type='primary' htmlType='submit' loading={saving}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default CommonConfigPage;
