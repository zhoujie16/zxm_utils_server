/**
 * @fileoverview 瓦片层渲染器组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import type { MapProvider } from '../hooks/useMapProvider';
import type { MapViewType } from '../hooks/useMapViewType';
import GaodeTileLayer from '../GaodeTileLayer';

/**
 * 瓦片层渲染器组件 Props
 */
export interface ITileLayerRendererProps {
  /** 地图提供商 */
  mapProvider: MapProvider;
  /** 地图视图类型 */
  mapViewType: MapViewType;
  /** 高德地图 API 密钥 */
  gaodeApiKey?: string;
}

/**
 * 瓦片层渲染器组件
 * 功能：根据地图提供商和视图类型渲染对应的瓦片层
 */
const TileLayerRenderer: React.FC<ITileLayerRendererProps> = ({
  mapProvider,
  mapViewType,
  gaodeApiKey,
}) => {
  // 目前仅支持高德地图
  if (mapProvider === 'gaode') {
    return (
      <>
        <GaodeTileLayer
          mapType={mapViewType === 'normal' ? 'road' : 'satellite'}
          apiKey={gaodeApiKey}
        />
      </>
    );
  }

  return null;
};

export default TileLayerRenderer;


