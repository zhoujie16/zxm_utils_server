/**
 * 公共配置服务
 * 处理系统配置的业务逻辑
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonConfig } from './common-config.entity';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class CommonConfigService {
  constructor(
    @InjectRepository(CommonConfig)
    private readonly commonConfigRepository: Repository<CommonConfig>,
  ) {}

  /**
   * 获取所有配置（按排序顺序排序）
   */
  async findAll(): Promise<CommonConfig[]> {
    return await this.commonConfigRepository.find({
      order: {
        sortOrder: 'ASC',
        id: 'ASC',
      },
    });
  }

  /**
   * 根据ID获取配置
   */
  async findOne(id: number): Promise<CommonConfig> {
    const config = await this.commonConfigRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(`配置项 ID ${id} 不存在`);
    }

    return config;
  }

  /**
   * 根据配置键获取配置
   */
  async findByKey(configKey: string): Promise<CommonConfig | null> {
    return await this.commonConfigRepository.findOne({
      where: { configKey },
    });
  }

  /**
   * 创建新配置
   */
  async create(createConfigDto: CreateConfigDto): Promise<CommonConfig> {
    // 检查配置键是否已存在
    const existingConfig = await this.findByKey(createConfigDto.configKey);
    if (existingConfig) {
      throw new ConflictException(`配置键 "${createConfigDto.configKey}" 已存在`);
    }

    const config = this.commonConfigRepository.create(createConfigDto);
    return await this.commonConfigRepository.save(config);
  }

  /**
   * 更新配置
   */
  async update(id: number, updateConfigDto: UpdateConfigDto): Promise<CommonConfig> {
    const config = await this.findOne(id);

    // 如果更新了配置键，检查新键是否已存在
    if (updateConfigDto.configKey && updateConfigDto.configKey !== config.configKey) {
      const existingConfig = await this.findByKey(updateConfigDto.configKey);
      if (existingConfig) {
        throw new ConflictException(`配置键 "${updateConfigDto.configKey}" 已存在`);
      }
    }

    Object.assign(config, updateConfigDto);
    return await this.commonConfigRepository.save(config);
  }

  /**
   * 删除配置
   */
  async remove(id: number): Promise<void> {
    const config = await this.findOne(id);
    await this.commonConfigRepository.remove(config);
  }

  /**
   * 切换配置启用状态
   */
  async toggleEnabled(id: number): Promise<CommonConfig> {
    const config = await this.findOne(id);
    config.isEnabled = !config.isEnabled;
    return await this.commonConfigRepository.save(config);
  }

  /**
   * 批量更新排序
   */
  async updateSortOrder(updates: { id: number; sortOrder: number }[]): Promise<void> {
    await this.commonConfigRepository.manager.transaction(async (transactionManager) => {
      for (const update of updates) {
        await transactionManager.update(
          CommonConfig,
          { id: update.id },
          { sortOrder: update.sortOrder }
        );
      }
    });
  }
}