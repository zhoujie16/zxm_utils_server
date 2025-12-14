/**
 * VehicleTrack 模块
 * 车辆行驶轨迹管理模块
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTrackController } from './vehicle-track.controller';
import { VehicleTrackService } from './vehicle-track.service';
import { VehicleTrack } from './vehicle-track.entity';
import { CommonConfigModule } from '../common-config/common-config.module';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleTrack]), CommonConfigModule],
  controllers: [VehicleTrackController],
  providers: [VehicleTrackService],
})
export class VehicleTrackModule {}

