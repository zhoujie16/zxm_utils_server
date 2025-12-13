/**
 * Demo 服务
 * 包含 demo 模块的业务逻辑
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Demo } from './demo.entity';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';

@Injectable()
export class DemoService {
  constructor(
    @InjectRepository(Demo)
    private readonly demoRepository: Repository<Demo>,
  ) {}

  /**
   * 创建 Demo
   */
  async create(createDemoDto: CreateDemoDto): Promise<Demo> {
    const demo = this.demoRepository.create(createDemoDto);
    return await this.demoRepository.save(demo);
  }

  /**
   * 查询所有 Demo
   */
  async findAll(): Promise<Demo[]> {
    return await this.demoRepository.find();
  }

  /**
   * 根据 ID 查询 Demo
   */
  async findOne(id: number): Promise<Demo> {
    const demo = await this.demoRepository.findOne({ where: { id } });
    if (!demo) {
      throw new NotFoundException(`Demo with ID ${id} not found`);
    }
    return demo;
  }

  /**
   * 更新 Demo
   */
  async update(id: number, updateDemoDto: UpdateDemoDto): Promise<Demo> {
    const demo = await this.findOne(id);
    Object.assign(demo, updateDemoDto);
    return await this.demoRepository.save(demo);
  }

  /**
   * 删除 Demo
   */
  async remove(id: number): Promise<void> {
    const demo = await this.findOne(id);
    await this.demoRepository.remove(demo);
  }
}

