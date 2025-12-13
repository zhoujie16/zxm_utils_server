/**
 * 更新 Demo DTO
 * 用于更新 Demo 资源的请求数据验证
 */
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDemoDto {
  @ApiProperty({ description: '名称', example: '更新后的名称', required: false })
  name?: string;

  @ApiProperty({ description: '描述', example: '更新后的描述', required: false })
  description?: string;
}

