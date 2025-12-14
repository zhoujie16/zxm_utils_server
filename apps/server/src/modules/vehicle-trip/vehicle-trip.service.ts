/**
 * VehicleTrip 服务
 * 包含车辆行程模块的业务逻辑
 */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { VehicleTrip } from './vehicle-trip.entity';
import { SyncTripDto } from './dto/sync-trip.dto';
import { QueryTripDto } from './dto/query-trip.dto';
import { CommonConfigService } from '../common-config/common-config.service';

@Injectable()
export class VehicleTripService {
  constructor(
    @InjectRepository(VehicleTrip)
    private readonly vehicleTripRepository: Repository<VehicleTrip>,
    private readonly commonConfigService: CommonConfigService,
  ) {}

  /**
   * 获取 HTTP 客户端实例（动态读取配置中的 token）
   */
  private async getHttpClient(): Promise<AxiosInstance> {
    // 从配置表读取 token
    const config = await this.commonConfigService.findByKey('WanCheBaoToken');
    if (!config) {
      throw new HttpException('万车宝 Token 配置不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!config.isEnabled) {
      throw new HttpException('万车宝 Token 配置未启用', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return axios.create({
      baseURL: 'https://online.wanchebao.com',
      headers: {
        'Host': 'online.wanchebao.com',
        'Accept': '*/*',
        'appName': '',
        'appVer': '3.0.5',
        'mobileModel': 'iPhone 13',
        'os': 'iOS',
        'mobileBrand': 'iPhone',
        'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'osVer': '18.6.2',
        'token': config.configValue,
        'User-Agent': 'Advancer AD10/3.0.5 (iPhone; iOS 18.6.2; Scale/3.00)',
        'lang': 'CN',
        'Content-Type': 'application/json',
        'Cookie': 'JSESSIONID=9BD5378F7D8AD5AC59E6A18ED16F7112',
      },
    });
  }

  /**
   * 同步指定月份的车辆行程数据
   */
  async syncTripData(syncTripDto: SyncTripDto): Promise<{ success: number; failed: number; message: string }> {
    const { month } = syncTripDto;

    // 解析月份，计算开始和结束时间戳
    const { startTime, endTime } = this.parseMonthToTimestamp(month);

    try {
      // 调用外部API获取数据
      const httpClient = await this.getHttpClient();
      const response = await httpClient.get('/v2/driveRecord/section', {
        params: {
          vehicleId: 2032011,
          page: 1,
          limit: 1000,
          startTime,
          endTime,
          lang: 'CN',
        },
      });

      if (response.data.code !== 0) {
        throw new HttpException(
          `外部API返回错误: ${response.data.msg || '未知错误'}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const tripDataList = response.data.data || [];
      let successCount = 0;
      let failedCount = 0;

      // 批量处理数据
      for (const item of tripDataList) {
        try {
          await this.saveTripData(item);
          successCount++;
        } catch (error) {
          console.error(`保存行程数据失败 (externalId: ${item.id}):`, error);
          failedCount++;
        }
      }

      return {
        success: successCount,
        failed: failedCount,
        message: `同步完成：成功 ${successCount} 条，失败 ${failedCount} 条`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `同步数据失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 解析月份字符串，返回该月的开始和结束时间戳（毫秒）
   */
  private parseMonthToTimestamp(month: string): { startTime: number; endTime: number } {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    return {
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
    };
  }

  /**
   * 保存单条行程数据
   */
  private async saveTripData(item: any): Promise<VehicleTrip> {
    // 解析 raw 字段（JSON字符串）
    let rawData: any = {};
    try {
      rawData = typeof item.raw === 'string' ? JSON.parse(item.raw) : item.raw || {};
    } catch (error) {
      console.warn(`解析 raw 字段失败:`, error);
    }

    // 将外部ID（字符串）转换为数字
    const externalId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;

    // 检查是否已存在（根据 externalId）
    const existingTrip = await this.vehicleTripRepository.findOne({
      where: { externalId },
    });

    // 构建实体数据
    const tripData: Partial<VehicleTrip> = {
      externalId,
      vehicleId: item.vehicleId,
      modelId: item.modelId,
      model: item.model,
      brandId: item.brandId,
      brand: item.brand,
      seriesId: item.seriesId,
      series: item.series,
      deviceId: item.deviceId,
      unitId: item.unitId,
      consumption: Math.round(item.consumption || 0),
      mileage: Math.round(item.mileage || 0),
      velocity: Math.round(item.velocity || 0),
      maxSpeed: Math.round(item.maxSpeed || 0),
      sharpAcceleration: item.sharpAcceleration || 0,
      sharpDeceleration: item.sharpDeceleration || 0,
      sharpTurn: item.sharpTurn || 0,
      startTime: item.startTime,
      endTime: item.endTime,
      // Raw 扁平化字段
      raw_start_time: this.parseNumber(rawData.start_time),
      raw_end_time: this.parseNumber(rawData.end_time),
      raw_te_record_trip_avg_oil: this.parseNumber(rawData.te_record_trip_avg_oil),
      raw_te_record_trip_avg_rpm: this.parseNumber(rawData.te_record_trip_avg_rpm),
      raw_te_record_trip_avg_speed: this.parseNumber(rawData.te_record_trip_avg_speed),
      raw_te_record_trip_max_rpm: this.parseNumber(rawData.te_record_trip_max_rpm),
      raw_te_record_trip_max_speed: this.parseNumber(rawData.te_record_trip_max_speed),
      raw_te_record_trip_mileage: this.parseNumber(rawData.te_record_trip_mileage),
      raw_te_record_trip_no: this.parseNumber(rawData.te_record_trip_no),
      raw_te_record_trip_oil: this.parseNumber(rawData.te_record_trip_oil),
      raw_te_record_trip_run_time: this.parseNumber(rawData.te_record_trip_run_time),
      raw_te_record_trip_start_time: this.parseNumber(rawData.te_record_trip_start_time),
      raw_te_record_trip_type: this.parseNumber(rawData.te_record_trip_type),
      raw_te_record_trip_urgent_acc_cnt: this.parseNumber(rawData.te_record_trip_urgent_acc_cnt),
      raw_te_record_trip_urgent_dec_cnt: this.parseNumber(rawData.te_record_trip_urgent_dec_cnt),
      raw_te_record_trip_urgent_turn_cnt: this.parseNumber(rawData.te_record_trip_urgent_turn_cnt),
    };

    if (existingTrip) {
      // 更新已存在的数据
      Object.assign(existingTrip, tripData);
      return await this.vehicleTripRepository.save(existingTrip);
    } else {
      // 创建新数据
      const newTrip = this.vehicleTripRepository.create(tripData);
      return await this.vehicleTripRepository.save(newTrip);
    }
  }

  /**
   * 解析数字（支持字符串和数字类型）
   */
  private parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const num = typeof value === 'string' ? parseInt(value, 10) : Number(value);
    return isNaN(num) ? 0 : num;
  }

  /**
   * 查询车辆行程数据列表（支持分页和时间范围筛选）
   */
  async findAll(queryTripDto: QueryTripDto): Promise<{
    data: VehicleTrip[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const {
      page = 1,
      limit = 10,
      startTime,
      endTime,
    } = queryTripDto;

    // 构建查询条件
    const queryBuilder = this.vehicleTripRepository.createQueryBuilder('trip');

    // 时间范围筛选
    if (startTime) {
      queryBuilder.andWhere('trip.startTime >= :startTime', { startTime });
    }
    if (endTime) {
      queryBuilder.andWhere('trip.startTime <= :endTime', { endTime });
    }

    // 排序：按开始时间倒序
    queryBuilder.orderBy('trip.startTime', 'DESC');

    // 分页
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // 并行执行查询和计数
    const [data, total] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    // 计算总页数
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
