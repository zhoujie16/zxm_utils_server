/**
 * 公共配置管理页面
 * 功能：管理系统配置的增删改查
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Switch,
  Popconfirm,
  Form,
  Input,
  message,
  Modal,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ICommonConfig } from '@/types';
import { getConfigList, createConfig, updateConfig, deleteConfig } from '@zxm-toolkit/http-client';
import { formatTime } from '@/utils/format';

const { TextArea } = Input;

const CommonConfigPage: React.FC = () => {
  // 状态管理
  const [configList, setConfigList] = useState<ICommonConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ICommonConfig | null>(null);
  const [form] = Form.useForm();

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getConfigList();
      setConfigList(data);
    } catch (error) {
      message.error('加载配置列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadData();
  }, []);

  // 处理创建/编辑
  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingConfig) {
        // 更新
        await updateConfig(editingConfig.id, values);
        message.success('配置更新成功');
      } else {
        // 创建
        await createConfig(values);
        message.success('配置创建成功');
      }
      setModalVisible(false);
      setEditingConfig(null);
      form.resetFields();
      loadData();
    } catch (error) {
      message.error(editingConfig ? '配置更新失败' : '配置创建失败');
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      await deleteConfig(id);
      message.success('配置删除成功');
      loadData();
    } catch (error) {
      message.error('配置删除失败');
    }
  };

  // 处理编辑
  const handleEdit = (config: ICommonConfig) => {
    setEditingConfig(config);
    form.setFieldsValue({
      configKey: config.configKey,
      configValue: config.configValue || '',
      description: config.description || '',
      sortOrder: config.sortOrder,
      isEnabled: config.isEnabled,
    });
    setModalVisible(true);
  };

  
  // 表格列定义
  const columns = [
    {
      title: '配置键',
      dataIndex: 'configKey',
      key: 'configKey',
      width: 200,
      ellipsis: true,
    },
    {
      title: '配置值',
      dataIndex: 'configValue',
      key: 'configValue',
      width: 300,
      ellipsis: true,
      render: (value: string) => (
        <span title={value}>{value || '-'}</span>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
      render: (value: string) => value || '-',
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      width: 80,
      align: 'center' as const,
      render: (enabled: boolean) => (
        <Switch checked={enabled} disabled />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => formatTime(time),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (time: string) => formatTime(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: ICommonConfig) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个配置吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* 操作区域 */}
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingConfig(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            新增配置
          </Button>
        </Space>

        {/* 表格区域 */}
        <Table
          columns={columns}
          dataSource={configList}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1400 }}
          size="middle"
        />
      </Space>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingConfig ? '编辑配置' : '新增配置'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingConfig(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdate}
          initialValues={{
            sortOrder: 0,
            isEnabled: true,
          }}
        >
          <Form.Item
            label="配置键"
            name="configKey"
            rules={[
              { required: true, message: '请输入配置键' },
              { max: 255, message: '配置键长度不能超过255个字符' },
              { pattern: /^[a-zA-Z0-9_.-]+$/, message: '配置键只能包含字母、数字、点、下划线和短横线' },
            ]}
          >
            <Input placeholder="例如：system.max_user_count" disabled={!!editingConfig} />
          </Form.Item>

          <Form.Item
            label="配置值"
            name="configValue"
            help="可以是任意字符串，如JSON格式"
          >
            <TextArea
              rows={4}
              placeholder='例如：{"key": "value"} 或普通字符串'
            />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
            rules={[{ max: 500, message: '描述长度不能超过500个字符' }]}
          >
            <Input placeholder="配置项的说明" />
          </Form.Item>

          <Form.Item
            label="排序顺序"
            name="sortOrder"
            rules={[{ required: true, message: '请输入排序顺序' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="启用状态"
            name="isEnabled"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingConfig(null);
                  form.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CommonConfigPage;