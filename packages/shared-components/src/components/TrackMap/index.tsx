/**
 * @fileoverview 轨迹地图组件
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import { MapContainer } from 'react-leaflet';
import type { IVehicleTrack } from '../../types/vehicle-track';
import { useTrackData } from './hooks/useTrackData';
import { useMapProvider, type MapProvider } from './hooks/useMapProvider';
import { useMapViewType, type MapViewType } from './hooks/useMapViewType';
import MapControlPanel from './MapControlPanel';
import TileLayerRenderer from './TileLayerRenderer';
import MapBoundsUpdater from './MapBoundsUpdater';
import TrackPolyline from './TrackPolyline';
import StartMarker from './StartMarker';
import EndMarker from './EndMarker';
import '../../utils/leafletConfig';
import 'leaflet/dist/leaflet.css';
import './index.less';

/**
 * 轨迹地图组件 Props
 */
export interface ITrackMapProps {
  /** 轨迹数据数组 */
  trackData: IVehicleTrack[];
  /** 地图高度（可选，默认 600px） */
  height?: number | string;
  /** 轨迹线颜色（可选，默认 #1890ff） */
  lineColor?: string;
  /** 轨迹线宽度（可选，默认 3） */
  lineWeight?: number;
  /** 轨迹线透明度（可选，默认 0.8） */
  lineOpacity?: number;
  /** 天地图 API 密钥（可选，使用天地图时必须提供，需在天地图官网申请：http://lbs.tianditu.gov.cn/） */
  tiandituApiKey?: string;
  /** 高德地图 API 密钥（可选，虽然无 key 也能访问，但建议提供以确保稳定性和合规性，需在高德开放平台申请：https://console.amap.com/） */
  gaodeApiKey?: string;
}

/**
 * 格式化高度值
 * @param height 高度值（数字或字符串）
 * @returns 格式化后的高度字符串
 */
const formatHeight = (height: number | string): string => {
  return typeof height === 'number' ? `${height}px` : height;
};

/**
 * 轨迹地图组件
 * 功能：在地图上显示车辆轨迹，自动计算边界、起点和终点
 */
const TrackMap: React.FC<ITrackMapProps> = ({
  trackData = [],
  height = 600,
  lineColor = '#1890ff',
  lineWeight = 3,
  lineOpacity = 0.8,
  tiandituApiKey,
  gaodeApiKey,
}) => {
  // 使用 hooks 管理数据
  const { positions, bounds, startPoint, endPoint, defaultCenter } = useTrackData(trackData);
  const { mapProvider, setMapProvider } = useMapProvider('gaode');
  const { mapViewType, toggleMapViewType } = useMapViewType('normal');

  const mapHeight = formatHeight(height);

  return (
    <div className="track-map-container" style={{ height: mapHeight }}>
      <MapControlPanel
        mapProvider={mapProvider}
        onMapProviderChange={setMapProvider}
        mapViewType={mapViewType}
        onMapViewTypeToggle={toggleMapViewType}
      />
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="track-map"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayerRenderer
          mapProvider={mapProvider}
          mapViewType={mapViewType}
          tiandituApiKey={tiandituApiKey}
          gaodeApiKey={gaodeApiKey}
        />
        <MapBoundsUpdater bounds={bounds} />
        <TrackPolyline
          positions={positions}
          color={lineColor}
          weight={lineWeight}
          opacity={lineOpacity}
        />
        <StartMarker startPoint={startPoint} />
        <EndMarker endPoint={endPoint} startPoint={startPoint} />
      </MapContainer>
    </div>
  );
};

export default TrackMap;
export type { MapProvider, MapViewType };
