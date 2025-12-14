/**
 * 公共配置控制器
 * 处理与系统配置相关的 HTTP 请求
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommonConfigService } from './common-config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CommonConfig } from './common-config.entity';

@ApiTags('common-config')
@Controller('common-config')
export class CommonConfigController {
  constructor(private readonly commonConfigService: CommonConfigService) {}

  @Get()
  @ApiOperation({
    summary: '获取所有配置',
    description: '获取系统中的所有配置项，按排序顺序排序'
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [CommonConfig],
  })
  async findAll() {
    return await this.commonConfigService.findAll();
  }

  @Get('key/:configKey')
  @ApiOperation({
    summary: '根据配置键获取配置',
    description: '根据配置键获取对应的配置项'
  })
  @ApiParam({ name: 'configKey', description: '配置键' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: CommonConfig,
  })
  async findByKey(@Param('configKey') configKey: string) {
    return await this.commonConfigService.findByKey(configKey);
  }

  @Get(':id')
  @ApiOperation({
    summary: '根据ID获取配置',
    description: '根据指定的ID获取单个配置项'
  })
  @ApiParam({ name: 'id', description: '配置项ID' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: CommonConfig,
  })
  @ApiResponse({ status: 404, description: '配置项不存在' })
  async findOne(@Param('id') id: string) {
    return await this.commonConfigService.findOne(+id);
  }

  @Post()
  @ApiOperation({
    summary: '创建新配置',
    description: '创建一个新的系统配置项'
  })
  @ApiBody({ type: CreateConfigDto })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    type: CommonConfig,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '配置键已存在' })
  async create(@Body() createConfigDto: CreateConfigDto) {
    return await this.commonConfigService.create(createConfigDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '更新配置',
    description: '更新指定ID的配置项信息'
  })
  @ApiParam({ name: 'id', description: '配置项ID' })
  @ApiBody({ type: UpdateConfigDto })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: CommonConfig,
  })
  @ApiResponse({ status: 404, description: '配置项不存在' })
  @ApiResponse({ status: 409, description: '配置键已存在' })
  async update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigDto) {
    return await this.commonConfigService.update(+id, updateConfigDto);
  }

  
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '删除配置',
    description: '删除指定ID的配置项'
  })
  @ApiParam({ name: 'id', description: '配置项ID' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 404, description: '配置项不存在' })
  async remove(@Param('id') id: string) {
    return await this.commonConfigService.remove(+id);
  }
}