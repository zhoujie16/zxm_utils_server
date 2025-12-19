/**
 * @fileoverview 首页
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin } from 'lucide-react';
import './index.less';

/**
 * 首页组件
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-page__container">
        <h1 className="home-page__title">首页</h1>
        <p className="home-page__subtitle">欢迎使用</p>

        <div className="home-page__functions">
          <div
            className="home-page__function-card"
            onClick={() => navigate('/vehicle-trip')}
          >
            <div className="home-page__function-icon">
              <Car size={32} />
            </div>
            <h3 className="home-page__function-title">车辆行程</h3>
            <p className="home-page__function-desc">查看和管理车辆行程数据</p>
          </div>

          <div
            className="home-page__function-card"
            onClick={() => navigate('/vehicle-track')}
          >
            <div className="home-page__function-icon">
              <MapPin size={32} />
            </div>
            <h3 className="home-page__function-title">车辆轨迹</h3>
            <p className="home-page__function-desc">查看和管理车辆轨迹数据</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

