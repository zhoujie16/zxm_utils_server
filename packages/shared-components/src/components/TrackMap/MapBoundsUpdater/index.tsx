/**
 * @fileoverview 地图边界适配组件
 * @author Claude
 * @created 2024-01-01
 */

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';

/**
 * 地图边界适配组件 Props
 */
export interface IMapBoundsUpdaterProps {
  /** 地图边界 */
  bounds: LatLngBounds | null;
}

/**
 * 地图边界适配组件
 * 功能：根据边界自动调整地图视野
 */
const MapBoundsUpdater: React.FC<IMapBoundsUpdaterProps> = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, bounds]);

  return null;
};

export default MapBoundsUpdater;


