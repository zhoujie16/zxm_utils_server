/**
 * @fileoverview 轨迹地图组件
 * @author Claude
 * @created 2024-01-01
 */

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import type { IVehicleTrack } from '../../types/vehicle-track';
import { convertTrackToPositions, calculateMapBounds, formatTime } from '../../utils/trackUtils';
import MapBoundsUpdater from './MapBoundsUpdater';
import '../../utils/leafletConfig';
import 'leaflet/dist/leaflet.css';

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
}

/**
 * 轨迹地图组件
 * 功能：在地图上显示车辆轨迹，自动计算边界、起点和终点
 */
const TrackMap: React.FC<ITrackMapProps> = ({
  trackData,
  height = 600,
  lineColor = '#1890ff',
  lineWeight = 3,
  lineOpacity = 0.8,
}) => {
  /**
   * 将轨迹数据转换为地图坐标数组
   */
  const positions = useMemo(() => {
    return convertTrackToPositions(trackData);
  }, [trackData]);

  /**
   * 计算地图边界
   */
  const bounds = useMemo(() => {
    return calculateMapBounds(positions);
  }, [positions]);

  /**
   * 获取起点和终点
   */
  const startPoint = trackData[0];
  const endPoint = trackData[trackData.length - 1];

  /**
   * 默认地图中心（上海）
   */
  const defaultCenter: [number, number] = positions.length > 0
    ? (positions[0] as [number, number])
    : [31.1948, 121.5449];

  /**
   * 格式化高度
   */
  const mapHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div style={{ height: mapHeight, width: '100%', position: 'relative' }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsUpdater bounds={bounds} />

        {/* 绘制轨迹线 */}
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            color={lineColor}
            weight={lineWeight}
            opacity={lineOpacity}
          />
        )}

        {/* 起点标记 */}
        {startPoint && (
          <Marker position={[startPoint.lat, startPoint.lng]}>
            <Popup>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>起点</div>
                <div>时间：{formatTime(startPoint.gpsTime)}</div>
                <div>速度：{startPoint.gpsSpeed} km/h</div>
                <div>坐标：({startPoint.lat.toFixed(6)}, {startPoint.lng.toFixed(6)})</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 终点标记 */}
        {endPoint && endPoint.id !== startPoint?.id && (
          <Marker position={[endPoint.lat, endPoint.lng]}>
            <Popup>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>终点</div>
                <div>时间：{formatTime(endPoint.gpsTime)}</div>
                <div>速度：{endPoint.gpsSpeed} km/h</div>
                <div>坐标：({endPoint.lat.toFixed(6)}, {endPoint.lng.toFixed(6)})</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default TrackMap;

