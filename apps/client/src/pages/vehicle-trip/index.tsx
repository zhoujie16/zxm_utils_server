/**
 * @fileoverview 车辆行程页面
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import './index.less';

/**
 * 车辆行程页面组件
 */
const VehicleTripPage: React.FC = () => {
  return (
    <div className="vehicle-trip-page">
      <div className="vehicle-trip-page__container">
        <h1 className="vehicle-trip-page__title">车辆行程</h1>
        <p className="vehicle-trip-page__subtitle">车辆行程数据管理</p>
      </div>
    </div>
  );
};

export default VehicleTripPage;

