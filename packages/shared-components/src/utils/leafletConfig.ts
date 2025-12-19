/**
 * @fileoverview Leaflet 地图配置
 * @author Claude
 * @created 2024-01-01
 */

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
/**
 * 配置 Leaflet 默认图标
 */
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * 初始化 Leaflet 配置（导出函数以便按需调用）
 */
const initLeafletConfig = () => {
  // 配置已在模块加载时执行，此函数用于显式调用
};

export default initLeafletConfig;

