/**
 * 创建 Demo DTO
 * 用于创建 Demo 资源的请求数据验证
 */
import { ApiProperty } from '@nestjs/swagger';

export class CreateDemoDto {
  @ApiProperty({ description: '名称', example: '测试 Demo' })
  name: string;

  @ApiProperty({ description: '描述', example: '这是一个测试 Demo', required: false })
  description?: string;
}

