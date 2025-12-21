/**
 * @fileoverview 地图控制面板组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import type { MapProvider } from '../hooks/useMapProvider';
import type { MapViewType } from '../hooks/useMapViewType';
import './index.less';

/**
 * 地图控制面板组件 Props
 */
export interface IMapControlPanelProps {
  /** 当前地图提供商 */
  mapProvider: MapProvider;
  /** 地图提供商变更回调 */
  onMapProviderChange: (provider: MapProvider) => void;
  /** 当前地图视图类型 */
  mapViewType: MapViewType;
  /** 地图视图类型切换回调 */
  onMapViewTypeToggle: () => void;
}

/**
 * 地图控制面板组件
 * 功能：提供地图提供商选择和视图类型切换功能
 */
const MapControlPanel: React.FC<IMapControlPanelProps> = ({
  mapProvider,
  onMapProviderChange,
  mapViewType,
  onMapViewTypeToggle,
}) => {
  return (
    <div className="track-map-control-panel">
      {/* 地图提供商选择器 */}
      <select
        value={mapProvider}
        onChange={(e) => onMapProviderChange(e.target.value as MapProvider)}
        className="track-map-provider-select"
        title="选择地图提供商"
      >
        <option value="gaode">高德地图</option>
      </select>

      {/* 地图视图类型切换按钮 */}
      <button
        onClick={onMapViewTypeToggle}
        className="track-map-view-toggle"
        title={mapViewType === 'normal' ? '切换到卫星地图' : '切换到普通地图'}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      </button>
    </div>
  );
};

export default MapControlPanel;


