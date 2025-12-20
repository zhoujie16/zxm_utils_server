/**
 * @fileoverview 天地图瓦片层组件
 * @author Claude
 * @created 2024-01-01
 */

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * 天地图瓦片层组件 Props
 */
export interface ITiandituTileLayerProps {
  /** 地图类型：'road' 街道地图，'satellite' 卫星影像 */
  mapType: 'road' | 'satellite';
  /** 是否显示 */
  visible?: boolean;
  /** 天地图 API 密钥（必填，需在天地图官网申请） */
  apiKey?: string;
}

/**
 * 天地图瓦片层组件
 * 功能：使用天地图 WMTS 服务创建瓦片层（2000坐标）
 */
const TiandituTileLayer: React.FC<ITiandituTileLayerProps> = ({ mapType, visible = true, apiKey = 'c8dce6a03b7650fd59d029b13f63381c' }) => {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    let tileLayer: L.TileLayer;

    if (mapType === 'road') {
      // 街道地图
      tileLayer = L.tileLayer(
        `https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${apiKey}`,
        {
          attribution: '&copy; <a href="http://lbs.tianditu.gov.cn/">国家基础地理信息中心</a>',
          maxZoom: 18,
          minZoom: 1,
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        }
      );
    } else {
      // 影像地图
      tileLayer = L.tileLayer(
        `https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${apiKey}`,
        {
          attribution: '&copy; <a href="http://lbs.tianditu.gov.cn/">国家基础地理信息中心</a>',
          maxZoom: 18,
          minZoom: 1,
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
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

export default TiandituTileLayer;


