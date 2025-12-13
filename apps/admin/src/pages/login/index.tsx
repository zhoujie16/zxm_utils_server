/**
 * 登录页面组件
 * 功能：提供用户登录功能
 */
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import React from 'react';
import type { ILoginFormData } from '@/types';
import { loginApi } from '@/services/login';
import './index.less';

const ILoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: ILoginFormData) => {
    setLoading(true);
    try {
      // 调用实际的登录API
      const response = await loginApi(values);

      // 验证响应数据
      if (!response || !response.access_token || !response.user) {
        throw new Error('登录响应数据格式错误');
      }

      // 设置token到localStorage
      localStorage.setItem('token', response.access_token);

      // 更新全局状态
      await setInitialState(s => ({
        ...s,
        currentUser: response.user,
      }));

      message.success('登录成功');
      // 延迟跳转，确保状态已更新
      setTimeout(() => {
        history.push('/home');
      }, 100);
    } catch (error: any) {
      // 根据错误类型显示不同的错误信息
      let errorMessage = '登录失败，请检查用户名和密码';
      
      if (error?.response?.status === 401) {
        errorMessage = '用户名或密码错误';
      } else if (error?.response?.status === 400) {
        errorMessage = '请求参数错误，请检查输入';
      } else if (error?.response?.status >= 500) {
        errorMessage = '服务器错误，请稍后重试';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <Card className='login-card'>
        <div className='login-header'>
          <h1>Admin Template</h1>
          <p>管理系统登录</p>
        </div>

        <Form form={form} name='login' onFinish={handleSubmit} autoComplete='off' size='large'>
          <Form.Item name='username' rules={[{ required: true, message: '请输入用户名!' }]}>
            <Input prefix={<UserOutlined />} placeholder='用户名' />
          </Form.Item>

          <Form.Item name='password' rules={[{ required: true, message: '请输入密码!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder='密码' />
          </Form.Item>

          <Form.Item>
            <div className='login-form-footer'>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a href='#' className='forgot-password-link'>
                忘记密码?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              className='login-submit-button'
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ILoginPage;
