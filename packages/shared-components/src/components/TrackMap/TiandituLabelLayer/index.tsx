/**
 * @fileoverview 天地图文字标注层组件
 * @author Claude
 * @created 2024-01-01
 */

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * 天地图文字标注层组件 Props
 */
export interface ITiandituLabelLayerProps {
  /** 是否显示 */
  visible?: boolean;
  /** 天地图 API 密钥（必填，需在天地图官网申请） */
  apiKey?: string;
}

/**
 * 天地图文字标注层组件
 * 功能：在天地图影像地图上叠加文字标注（道路名称、地名等）
 */
const TiandituLabelLayer: React.FC<ITiandituLabelLayerProps> = ({ visible = true, apiKey = 'c8dce6a03b7650fd59d029b13f63381c' }) => {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    // 创建文字标注层
    const labelLayer = L.tileLayer(
      `https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${apiKey}`,
      {
        attribution: '',
        maxZoom: 18,
        minZoom: 1,
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
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

export default TiandituLabelLayer;


