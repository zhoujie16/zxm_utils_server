/**
 * @fileoverview 地图提供商状态管理 Hook
 * @author Claude
 * @created 2024-01-01
 */

import { useState } from 'react';

/**
 * 地图提供商类型
 */
export type MapProvider = 'gaode';

/**
 * 地图提供商状态管理 Hook 返回值
 */
export interface IUseMapProviderReturn {
  /** 当前地图提供商 */
  mapProvider: MapProvider;
  /** 设置地图提供商 */
  setMapProvider: (provider: MapProvider) => void;
}

/**
 * 地图提供商状态管理 Hook
 * 功能：管理地图提供商状态
 */
export const useMapProvider = (initialProvider: MapProvider = 'gaode'): IUseMapProviderReturn => {
  const [mapProvider, setMapProvider] = useState<MapProvider>(initialProvider);

  return {
    mapProvider,
    setMapProvider,
  };
};


