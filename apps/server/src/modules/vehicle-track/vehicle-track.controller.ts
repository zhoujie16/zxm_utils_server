/**
 * VehicleTrack 控制器
 * 处理与车辆行驶轨迹相关的 HTTP 请求
 */
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleTrackService } from './vehicle-track.service';

@ApiTags('vehicle-track')
@Controller('vehicle-track')
export class VehicleTrackController {
  constructor(private readonly vehicleTrackService: VehicleTrackService) {}
}

