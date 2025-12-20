/**
 * @fileoverview 地图视图类型状态管理 Hook
 * @author Claude
 * @created 2024-01-01
 */

import { useState, useCallback } from 'react';

/**
 * 地图视图类型
 */
export type MapViewType = 'normal' | 'satellite';

/**
 * 地图视图类型状态管理 Hook 返回值
 */
export interface IUseMapViewTypeReturn {
  /** 当前地图视图类型 */
  mapViewType: MapViewType;
  /** 切换地图视图类型 */
  toggleMapViewType: () => void;
}

/**
 * 地图视图类型状态管理 Hook
 * 功能：管理地图视图类型状态
 */
export const useMapViewType = (initialViewType: MapViewType = 'normal'): IUseMapViewTypeReturn => {
  const [mapViewType, setMapViewType] = useState<MapViewType>(initialViewType);

  const toggleMapViewType = useCallback(() => {
    setMapViewType((prev) => (prev === 'normal' ? 'satellite' : 'normal'));
  }, []);

  return {
    mapViewType,
    toggleMapViewType,
  };
};



