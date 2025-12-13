/**
 * Demo 控制器
 * 处理与 demo 相关的 HTTP 请求
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DemoService } from './demo.service';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { Demo } from './demo.entity';

@ApiTags('demo')
@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @ApiOperation({ summary: '创建 Demo', description: '创建一个新的 Demo 记录' })
  @ApiResponse({ status: 201, description: '创建成功', type: Demo })
  @ApiBody({ type: CreateDemoDto })
  @Post()
  async create(@Body() createDemoDto: CreateDemoDto): Promise<Demo> {
    return await this.demoService.create(createDemoDto);
  }

  @ApiOperation({ summary: '查询所有 Demo', description: '获取所有 Demo 记录列表' })
  @ApiResponse({ status: 200, description: '查询成功', type: [Demo] })
  @Get()
  async findAll(): Promise<Demo[]> {
    return await this.demoService.findAll();
  }

  @ApiOperation({ summary: '根据 ID 查询 Demo', description: '根据 ID 获取单个 Demo 记录' })
  @ApiParam({ name: 'id', description: 'Demo ID', example: 1 })
  @ApiResponse({ status: 200, description: '查询成功', type: Demo })
  @ApiResponse({ status: 404, description: 'Demo 不存在' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Demo> {
    return await this.demoService.findOne(id);
  }

  @ApiOperation({ summary: '更新 Demo', description: '根据 ID 更新 Demo 记录' })
  @ApiParam({ name: 'id', description: 'Demo ID', example: 1 })
  @ApiBody({ type: UpdateDemoDto })
  @ApiResponse({ status: 200, description: '更新成功', type: Demo })
  @ApiResponse({ status: 404, description: 'Demo 不存在' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDemoDto: UpdateDemoDto,
  ): Promise<Demo> {
    return await this.demoService.update(id, updateDemoDto);
  }

  @ApiOperation({ summary: '删除 Demo', description: '根据 ID 删除 Demo 记录' })
  @ApiParam({ name: 'id', description: 'Demo ID', example: 1 })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: 'Demo 不存在' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.demoService.remove(id);
  }
}

