/**
 * @fileoverview 瓦片层渲染器组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import type { MapProvider, MapViewType } from '../hooks/useMapProvider';
import DefaultTileLayer from '../DefaultTileLayer';
import BingTileLayer from '../BingTileLayer';
import TiandituTileLayer from '../TiandituTileLayer';
import TiandituLabelLayer from '../TiandituLabelLayer';
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
  /** 天地图 API 密钥 */
  tiandituApiKey?: string;
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
  tiandituApiKey,
  gaodeApiKey,
}) => {
  // 根据地图提供商显示对应的瓦片层
  if (mapProvider === 'default') {
    return <DefaultTileLayer mapType={mapViewType} />;
  }

  if (mapProvider === 'bing') {
    return <BingTileLayer mapType={mapViewType === 'normal' ? 'road' : 'satellite'} />;
  }

  if (mapProvider === 'tianditu') {
    return (
      <>
        <TiandituTileLayer
          mapType={mapViewType === 'normal' ? 'road' : 'satellite'}
          apiKey={tiandituApiKey}
        />
        {/* 天地图所有模式下都显示文字标注 */}
        <TiandituLabelLayer apiKey={tiandituApiKey} />
      </>
    );
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


