/**
 * @fileoverview 登录页面
 * @author Claude
 * @created 2024-01-01
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { loginApi } from '@zxm-toolkit/http-client';
import { setToken } from '@/utils/auth';
import type { ILoginFormData } from '@/types/common';
import './index.less';

/**
 * 登录页面组件
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ILoginFormData>({
    username: '',
    password: '',
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  /**
   * 处理表单输入变化
   */
  const handleInputChange = (field: keyof ILoginFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 表单验证
    if (!formData.username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!formData.password.trim()) {
      setError('请输入密码');
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi({
        username: formData.username.trim(),
        password: formData.password,
      });

      // 保存 token
      setToken(response.access_token);

      // 跳转到首页
      navigate('/home', { replace: true });
    } catch (err: any) {
      let errorMessage = '登录失败，请检查用户名和密码';
      if (err?.code === 401) {
        errorMessage = '用户名或密码错误';
      } else if (err?.code === 400) {
        errorMessage = '请求参数错误，请检查输入';
      } else if (err?.code >= 500) {
        errorMessage = '服务器错误，请稍后重试';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <h1 className="login-page__title">登录</h1>
          <p className="login-page__subtitle">欢迎回来</p>
        </div>

        <form className="login-page__form" onSubmit={handleSubmit}>
          {error && <div className="login-page__error">{error}</div>}

          <div className="login-page__field">
            <label className="login-page__label">
              <User className="login-page__icon" size={20} />
              用户名
            </label>
            <input
              className="login-page__input"
              type="text"
              placeholder="请输入用户名"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="login-page__field">
            <label className="login-page__label">
              <Lock className="login-page__icon" size={20} />
              密码
            </label>
            <input
              className="login-page__input"
              type="password"
              placeholder="请输入密码"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="login-page__field">
            <label className="login-page__checkbox-label">
              <input
                className="login-page__checkbox"
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => handleInputChange('remember', e.target.checked)}
                disabled={loading}
              />
              <span>记住我</span>
            </label>
          </div>

          <button
            className="login-page__submit"
            type="submit"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

