/**
 * @fileoverview 高德地图瓦片层组件
 * @author Claude
 * @created 2024-01-01
 */

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * 高德地图瓦片层组件 Props
 */
export interface IGaodeTileLayerProps {
  /** 地图类型：'road' 街道地图，'satellite' 卫星影像 */
  mapType: 'road' | 'satellite';
  /** 是否显示 */
  visible?: boolean;
  /** 高德地图 API 密钥（可选，虽然无 key 也能访问，但建议提供以确保稳定性和合规性，需在高德开放平台申请：https://console.amap.com/） */
  apiKey?: string;
}

/**
 * 高德地图瓦片层组件
 * 功能：使用高德地图服务创建瓦片层
 */
const GaodeTileLayer: React.FC<IGaodeTileLayerProps> = ({ mapType, visible = true, apiKey }) => {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    let tileLayer: L.TileLayer;
    const keyParam = apiKey ? `&key=${apiKey}` : '';

    if (mapType === 'road') {
      // 街道地图
      tileLayer = L.tileLayer(
        `https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}${keyParam}`,
        {
          attribution: '&copy; <a href="https://www.amap.com/">高德地图</a>',
          maxZoom: 19,
          minZoom: 1,
          subdomains: ['1', '2', '3', '4'],
        }
      );
    } else {
      // 卫星影像
      tileLayer = L.tileLayer(
        `https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}${keyParam}`,
        {
          attribution: '&copy; <a href="https://www.amap.com/">高德地图</a>',
          maxZoom: 19,
          minZoom: 1,
          subdomains: ['1', '2', '3', '4'],
        }
      );
    }

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, mapType, visible, apiKey]);

  return null;
};

export default GaodeTileLayer;



