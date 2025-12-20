/**
 * @fileoverview 默认地图瓦片层组件（OpenStreetMap）
 * @author Claude
 * @created 2024-01-01
 */

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * 默认地图瓦片层组件 Props
 */
export interface IDefaultTileLayerProps {
  /** 地图类型：'normal' 普通地图，'satellite' 卫星地图 */
  mapType: 'normal' | 'satellite';
  /** 是否显示 */
  visible?: boolean;
}

/**
 * 默认地图瓦片层组件
 * 功能：使用 OpenStreetMap 作为默认地图瓦片层
 */
const DefaultTileLayer: React.FC<IDefaultTileLayerProps> = ({ mapType, visible = true }) => {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    let tileLayer: L.TileLayer;

    if (mapType === 'normal') {
      // OpenStreetMap 普通地图
      tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1,
      });
    } else {
      // Esri 卫星影像
      tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        maxZoom: 19,
        minZoom: 1,
      });
    }

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, mapType, visible]);

  return null;
};

export default DefaultTileLayer;


