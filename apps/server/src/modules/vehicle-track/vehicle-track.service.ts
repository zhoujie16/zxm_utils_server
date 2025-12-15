/**
 * VehicleTrack 服务
 * 包含车辆行驶轨迹模块的业务逻辑
 */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import dayjs from 'dayjs';
import { VehicleTrack } from './vehicle-track.entity';
import { SyncTrackDto } from './dto/sync-track.dto';
import { QueryTrackDto } from './dto/query-track.dto';
import { CommonConfigService } from '../common-config/common-config.service';

@Injectable()
export class VehicleTrackService {
  constructor(
    @InjectRepository(VehicleTrack)
    private readonly vehicleTrackRepository: Repository<VehicleTrack>,
    private readonly commonConfigService: CommonConfigService,
  ) {}

  /**
   * 获取 HTTP 客户端实例（动态读取配置中的 token）
   */
  private async getHttpClient(): Promise<AxiosInstance> {
    // 从配置表读取 token
    const config = await this.commonConfigService.findByKey('TuQiangToken');
    if (!config) {
      throw new HttpException('途强 Token 配置不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!config.isEnabled) {
      throw new HttpException('途强 Token 配置未启用', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 构建 Cookie 字符串，更新 SHAREJSESSIONID
    const cookie = `checkChildAlarm=0; SHAREJSESSIONID=${config.configValue}`;

    return axios.create({
      baseURL: 'http://tuqiang123.com',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'http://tuqiang123.com',
        'Referer': 'http://tuqiang123.com/trackreplay/locus?imei=868120325700570&hrefType=1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': cookie,
      },
      // 允许不安全的 HTTPS 连接（如果需要）
      validateStatus: () => true,
    });
  }

  /**
   * 同步指定时间范围的车辆轨迹数据
   */
  async syncTrackData(syncTrackDto: SyncTrackDto): Promise<{ success: number; failed: number; message: string }> {
    const { startTime, endTime } = syncTrackDto;

    try {
      // 构建表单数据
      // URLSearchParams 会自动进行 URL 编码，不需要手动编码
      const params = new URLSearchParams();
      params.append('startTime', startTime);
      params.append('endTime', endTime);
      params.append('imei', '868120325700570');
      params.append('selectMap', 'baiduMap');
      params.append('selectType', 'gps,lbs,wifi,inertia');
      params.append('filter', 'false');

      const requestUrl = 'http://tuqiang123.com/trackreplay/initPiont';
      const requestBody = params.toString();

      // 调用外部API获取数据
      const httpClient = await this.getHttpClient();
      const response = await httpClient.post('/trackreplay/initPiont', requestBody);

      if (response.data.code !== 0 || !response.data.ok) {
        throw new HttpException(
          `外部API返回错误: ${response.data.msg || '未知错误'}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const trackDataList = response.data.data?.data || [];

      let successCount = 0;
      let failedCount = 0;

      // 批量处理数据
      for (const item of trackDataList) {
        try {
          await this.saveTrackData(item);
          successCount++;
        } catch (error) {
          console.error(`保存轨迹数据失败 (gpsTime: ${item.gpsTime}):`, error);
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
   * 保存单条轨迹数据
   */
  private async saveTrackData(item: any): Promise<VehicleTrack> {
    // 将 gpsTime 转换为时间戳用于查询
    const gpsTimeValue = item.gpsTime || '';
    const gpsTimeStamp = this.parseTimestamp(gpsTimeValue);

    // 检查是否已存在（根据 imei 和 gpsTime）
    const existingTrack = await this.vehicleTrackRepository.findOne({
      where: {
        imei: '868120325700570',
        gpsTime: gpsTimeStamp,
      },
    });

    // 构建实体数据
    const trackData: Partial<VehicleTrack> = {
      imei: '868120325700570',
      direction: this.parseNumber(item.direction),
      gateTime: this.parseTimestamp(item.gate_time || item.gateTime || ''),
      gpsMode: this.parseNumber(item.gpsMode),
      gpsSpeed: this.parseNumber(item.gpsSpeed),
      gpsTime: gpsTimeStamp,
      lat: this.parseNumber(item.lat),
      lng: this.parseNumber(item.lng),
      posMethod: this.parseNumber(item.posMethod),
      posMulFlag: this.parseNumber(item.posMulFlag),
      posType: this.parseNumber(item.posType),
      precision: this.parseNumber(item.precision),
    };

    if (existingTrack) {
      // 更新已存在的数据
      Object.assign(existingTrack, trackData);
      return await this.vehicleTrackRepository.save(existingTrack);
    } else {
      // 创建新数据
      const newTrack = this.vehicleTrackRepository.create(trackData);
      return await this.vehicleTrackRepository.save(newTrack);
    }
  }

  /**
   * 解析数字（支持字符串和数字类型）
   */
  private parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? 0 : num;
  }

  /**
   * 将日期字符串转换为13位时间戳（毫秒）
   * 支持格式：'YYYY-MM-DD HH:mm:ss' 或已经是时间戳的数字/字符串
   */
  private parseTimestamp(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    // 如果已经是数字类型的时间戳
    if (typeof value === 'number') {
      // 如果是10位时间戳（秒），转换为13位（毫秒）
      if (value.toString().length === 10) {
        return value * 1000;
      }
      // 如果已经是13位时间戳，直接返回
      return value;
    }

    // 如果是字符串类型的时间戳
    if (typeof value === 'string') {
      // 检查是否是纯数字字符串（时间戳）
      if (/^\d+$/.test(value)) {
        const numValue = parseInt(value, 10);
        // 如果是10位时间戳（秒），转换为13位（毫秒）
        if (value.length === 10) {
          return numValue * 1000;
        }
        // 如果已经是13位时间戳，直接返回
        return numValue;
      }

      // 尝试使用 dayjs 解析日期字符串
      const date = dayjs(value);
      if (date.isValid()) {
        return date.valueOf(); // dayjs.valueOf() 返回13位时间戳（毫秒）
      }
    }

    // 无法解析，返回0
    return 0;
  }

  /**
   * 查询车辆轨迹数据列表（支持分页和时间范围筛选）
   */
  async findAll(queryTrackDto: QueryTrackDto): Promise<{
    data: VehicleTrack[];
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
    } = queryTrackDto;

    // 构建查询条件
    const queryBuilder = this.vehicleTrackRepository.createQueryBuilder('track');

    // 时间范围筛选（使用 gpsTime 字段）
    if (startTime) {
      queryBuilder.andWhere('track.gpsTime >= :startTime', { startTime });
    }
    if (endTime) {
      queryBuilder.andWhere('track.gpsTime <= :endTime', { endTime });
    }

    // 排序：按 GPS 时间倒序
    queryBuilder.orderBy('track.gpsTime', 'DESC');

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

