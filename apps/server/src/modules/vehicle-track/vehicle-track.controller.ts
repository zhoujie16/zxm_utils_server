/**
 * VehicleTrack 控制器
 * 处理与车辆行驶轨迹相关的 HTTP 请求
 */
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { VehicleTrackService } from './vehicle-track.service';
import { SyncTrackDto } from './dto/sync-track.dto';
import { QueryTrackDto } from './dto/query-track.dto';
import { ConvertCoordinateDto } from './dto/convert-coordinate.dto';
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

  @Post('convert-gcj02')
  @ApiOperation({ summary: '批量转换 GCJ-02 坐标', description: '批量将 BD-09 坐标转换为 GCJ-02 坐标，支持时间范围筛选' })
  @ApiBody({ type: ConvertCoordinateDto, required: false })
  @ApiResponse({
    status: 200,
    description: '转换成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'number', example: 100, description: '成功转换的记录数' },
        failed: { type: 'number', example: 0, description: '失败的记录数' },
        message: { type: 'string', example: '转换完成：成功 100 条，失败 0 条' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 500, description: '服务器内部错误' })
  async convertGcj02(@Body() convertDto?: ConvertCoordinateDto) {
    return await this.vehicleTrackService.batchConvertToGcj02(convertDto);
  }

  @Post('convert-wgs84')
  @ApiOperation({ summary: '批量转换 WGS84 坐标', description: '批量将 GCJ-02 坐标转换为 WGS84 坐标，支持时间范围筛选（需要已有 GCJ-02 坐标）' })
  @ApiBody({ type: ConvertCoordinateDto, required: false })
  @ApiResponse({
    status: 200,
    description: '转换成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'number', example: 100, description: '成功转换的记录数' },
        failed: { type: 'number', example: 0, description: '失败的记录数' },
        message: { type: 'string', example: '转换完成：成功 100 条，失败 0 条' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 500, description: '服务器内部错误' })
  async convertWgs84(@Body() convertDto?: ConvertCoordinateDto) {
    return await this.vehicleTrackService.batchConvertToWgs84(convertDto);
  }
}

