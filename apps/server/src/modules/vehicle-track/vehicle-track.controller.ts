/**
 * VehicleTrack 控制器
 * 处理与车辆行驶轨迹相关的 HTTP 请求
 */
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { VehicleTrackService } from './vehicle-track.service';
import { SyncTrackDto } from './dto/sync-track.dto';
import { QueryTrackDto } from './dto/query-track.dto';
import { VehicleTrack } from './vehicle-track.entity';

@ApiTags('vehicle-track')
@Controller('vehicle-track')
export class VehicleTrackController {
  constructor(private readonly vehicleTrackService: VehicleTrackService) {}

  @Get()
  @ApiOperation({ summary: '查询车辆轨迹数据列表', description: '获取车辆轨迹数据列表，支持分页和时间范围筛选' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/VehicleTrack' },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 100 },
            totalPages: { type: 'number', example: 10 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async findAll(@Query() queryTrackDto: QueryTrackDto) {
    return await this.vehicleTrackService.findAll(queryTrackDto);
  }

  @Post('sync')
  @ApiOperation({ summary: '同步车辆轨迹数据', description: '从外部API获取指定时间范围的车辆轨迹数据并保存到本地数据库' })
  @ApiBody({ type: SyncTrackDto })
  @ApiResponse({
    status: 200,
    description: '同步成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'number', example: 25, description: '成功保存的记录数' },
        failed: { type: 'number', example: 0, description: '失败的记录数' },
        message: { type: 'string', example: '同步完成：成功 25 条，失败 0 条' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 502, description: '外部API调用失败' })
  @ApiResponse({ status: 500, description: '服务器内部错误' })
  async syncTrackData(@Body() syncTrackDto: SyncTrackDto) {
    return await this.vehicleTrackService.syncTrackData(syncTrackDto);
  }
}

