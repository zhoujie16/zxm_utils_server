/**
 * @fileoverview Bing 地图瓦片层组件
 * @author Claude
 * @created 2024-01-01
 */

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { gcj02ToWgs84 } from '../../../utils/trackUtils';

/**
 * 将 x, y, z 转换为 Bing 地图的 quadkey
 * @param x 瓦片 X 坐标
 * @param y 瓦片 Y 坐标
 * @param z 缩放级别
 * @returns quadkey 字符串
 */
const tileToQuadKey = (x: number, y: number, z: number): string => {
  let quadkey = '';
  for (let i = z; i > 0; i--) {
    let bit = 0;
    const mask = 1 << (i - 1);
    if ((x & mask) !== 0) bit++;
    if ((y & mask) !== 0) bit += 2;
    quadkey += bit.toString();
  }
  return quadkey;
};

/**
 * Bing 地图瓦片层组件 Props
 */
export interface IBingTileLayerProps {
  /** 地图类型：'road' 街道地图，'satellite' 卫星影像 */
  mapType: 'road' | 'satellite';
  /** 是否显示 */
  visible?: boolean;
}

/**
 * Bing 地图瓦片层组件
 * 功能：使用 Leaflet 原生 API 创建支持 quadkey 格式的 Bing 地图瓦片层
 * 注意：必应地图卫星影像使用 WGS84 坐标，需要将 GCJ-02 坐标转换为 WGS84
 */
const BingTileLayer: React.FC<IBingTileLayerProps> = ({ mapType, visible = true }) => {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    // 创建自定义的 TileLayer 类
    const BingTileLayerClass = L.TileLayer.extend({
      getTileUrl: function (coords: { x: number; y: number; z: number }) {
        let quadkey: string;
        
        if (mapType === 'road') {
          // 街道地图（火星坐标 GCJ-02）- 直接使用传入的坐标
          quadkey = tileToQuadKey(coords.x, coords.y, coords.z);
          return `https://t1.dynamic.tiles.ditu.live.com/comp/ch/${quadkey}?mkt=zh-CN&ur=CN&it=G,RL&n=z&og=804&cstl=vb`;
        } else {
          // 卫星影像（WGS84 坐标）- 需要将 GCJ-02 坐标转换为 WGS84
          // Leaflet 内部使用 WGS84，但传入的坐标是 GCJ-02（被当作 WGS84 处理）
          // 需要将瓦片坐标转换为经纬度，然后转换为真正的 WGS84 坐标，再计算正确的瓦片坐标
          const n = Math.pow(2, coords.z);
          // 将瓦片坐标转换为经纬度（Leaflet 认为这是 WGS84，但实际是 GCJ-02）
          const gcjLng = (coords.x / n) * 360 - 180;
          const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * coords.y / n)));
          const gcjLat = (latRad * 180) / Math.PI;
          
          // 将 GCJ-02 坐标转换为真正的 WGS84 坐标
          const [wgsLat, wgsLng] = gcj02ToWgs84(gcjLat, gcjLng);
          
          // 使用 WGS84 坐标计算正确的瓦片坐标
          const wgsX = Math.floor((wgsLng + 180) / 360 * n);
          const wgsLatRad = (wgsLat * Math.PI) / 180;
          const wgsY = Math.floor((1 - Math.log(Math.tan(wgsLatRad) + 1 / Math.cos(wgsLatRad)) / Math.PI) / 2 * n);
          
          quadkey = tileToQuadKey(wgsX, wgsY, coords.z);
          
          // 使用子域名轮询
          const subdomain = (coords.x + coords.y) % 4;
          return `http://ecn.t${subdomain}.tiles.virtualearth.net/tiles/a${quadkey}.jpeg?g=1`;
        }
      },
    });

    // 创建瓦片层实例（第一个参数是 URL 模板，这里用空字符串，因为我们在 getTileUrl 中自定义了 URL）
    const tileLayer = new (BingTileLayerClass as any)('', {
      attribution: '&copy; <a href="https://www.microsoft.com/">Microsoft</a>',
      maxZoom: 19,
      minZoom: 1,
    });

    // 添加到地图
    tileLayer.addTo(map);

    // 清理函数：移除瓦片层
    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, mapType, visible]);

  return null;
};

export default BingTileLayer;



