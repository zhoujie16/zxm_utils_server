/**
 * VehicleTrip 模块
 * 车辆行程管理模块
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTripController } from './vehicle-trip.controller';
import { VehicleTripService } from './vehicle-trip.service';
import { VehicleTrip } from './vehicle-trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleTrip])],
  controllers: [VehicleTripController],
  providers: [VehicleTripService],
})
export class VehicleTripModule {}

