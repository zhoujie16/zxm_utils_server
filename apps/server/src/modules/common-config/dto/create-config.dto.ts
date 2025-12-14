/**
 * 创建公共配置DTO
 */
import { IsString, IsOptional, IsNumber, IsBoolean, MaxLength, Min } from 'class-validator';

export class CreateConfigDto {
  /**
   * 配置键（唯一标识）
   */
  @IsString()
  @MaxLength(255)
  configKey: string;

  /**
   * 配置值，一般为JSON字符串
   */
  @IsOptional()
  @IsString()
  configValue?: string;

  /**
   * 配置描述
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  /**
   * 排序顺序
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  /**
   * 是否启用
   */
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}