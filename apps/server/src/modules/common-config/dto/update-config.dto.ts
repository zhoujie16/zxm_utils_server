/**
 * 更新公共配置DTO
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigDto } from './create-config.dto';

export class UpdateConfigDto extends PartialType(CreateConfigDto) {}