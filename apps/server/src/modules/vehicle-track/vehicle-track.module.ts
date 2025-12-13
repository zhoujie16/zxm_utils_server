/**
 * VehicleTrack 模块
 * 车辆行驶轨迹管理模块
 */
import { Module } from '@nestjs/common';
import { VehicleTrackController } from './vehicle-track.controller';
import { VehicleTrackService } from './vehicle-track.service';

@Module({
  controllers: [VehicleTrackController],
  providers: [VehicleTrackService],
})
export class VehicleTrackModule {}

