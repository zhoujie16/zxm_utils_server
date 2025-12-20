/**
 * @fileoverview 高德地图文字标注层组件
 * @author Claude
 * @created 2024-01-01
 */

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * 高德地图文字标注层组件 Props
 */
export interface IGaodeLabelLayerProps {
  /** 是否显示 */
  visible?: boolean;
  /** 高德地图 API 密钥（可选，虽然无 key 也能访问，但建议提供以确保稳定性和合规性，需在高德开放平台申请：https://console.amap.com/） */
  apiKey?: string;
}

/**
 * 高德地图文字标注层组件
 * 功能：在高德地图卫星影像上叠加文字标注（道路名称、地名等）
 */
const GaodeLabelLayer: React.FC<IGaodeLabelLayerProps> = ({ visible = true, apiKey }) => {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    // 创建文字标注层（卫星+标注）
    const keyParam = apiKey ? `&key=${apiKey}` : '';
    const labelLayer = L.tileLayer(
      `https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}${keyParam}`,
      {
        attribution: '',
        maxZoom: 19,
        minZoom: 1,
        subdomains: ['1', '2', '3', '4'],
        opacity: 1,
      }
    );

    labelLayer.addTo(map);

    return () => {
      map.removeLayer(labelLayer);
    };
  }, [map, visible, apiKey]);

  return null;
};

export default GaodeLabelLayer;


