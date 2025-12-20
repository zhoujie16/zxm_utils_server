/**
 * @fileoverview 瓦片层渲染器组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import type { MapProvider } from '../hooks/useMapProvider';
import type { MapViewType } from '../hooks/useMapViewType';
import BingTileLayer from '../BingTileLayer';
import GaodeTileLayer from '../GaodeTileLayer';
import GaodeLabelLayer from '../GaodeLabelLayer';

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
  // 根据地图提供商显示对应的瓦片层
  if (mapProvider === 'bing') {
    return <BingTileLayer mapType={mapViewType === 'normal' ? 'road' : 'satellite'} />;
  }

  if (mapProvider === 'gaode') {
    return (
      <>
        <GaodeTileLayer
          mapType={mapViewType === 'normal' ? 'road' : 'satellite'}
          apiKey={gaodeApiKey}
        />
        {/* 高德地图卫星模式下显示文字标注 */}
        {mapViewType === 'satellite' && <GaodeLabelLayer apiKey={gaodeApiKey} />}
      </>
    );
  }

  return null;
};

export default TileLayerRenderer;


