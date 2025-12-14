/**
 * 公共配置模块
 * 系统配置管理模块
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonConfigController } from './common-config.controller';
import { CommonConfigService } from './common-config.service';
import { CommonConfig } from './common-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommonConfig])],
  controllers: [CommonConfigController],
  providers: [CommonConfigService],
  exports: [CommonConfigService],
})
export class CommonConfigModule {}