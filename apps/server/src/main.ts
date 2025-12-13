/**
 * 应用入口文件
 * 启动 NestJS 应用
 */
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// 加载 .env 文件（必须在其他导入之前执行）
dotenv.config({ path: resolve(__dirname, '../.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 设置全局 API 前缀
  app.setGlobalPrefix(appConfig.apiPrefix);
  
  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // 启用 CORS
  app.enableCors({
    origin: appConfig.corsOrigin,
  });
  
  // 配置 Swagger（生产环境禁用）
  if (appConfig.nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NestJS Demo API')
      .setDescription('NestJS Demo 项目 API 文档')
      .setVersion('1.0')
      .addTag('demo', 'Demo 相关接口')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    console.log(`Swagger API 文档: http://localhost:${appConfig.port}/docs`);
  }
  
  await app.listen(appConfig.port);
  console.log(`Application is running on: http://localhost:${appConfig.port}/${appConfig.apiPrefix}`);
}
bootstrap();
