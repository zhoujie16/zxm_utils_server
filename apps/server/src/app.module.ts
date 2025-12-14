/**
 * 应用根模块
 * 注册所有业务模块和全局配置
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from './modules/demo/demo.module';
import { LoginModule } from './modules/login/login.module';
import { VehicleTripModule } from './modules/vehicle-trip/vehicle-trip.module';
import { VehicleTrackModule } from './modules/vehicle-track/vehicle-track.module';
import { AuthModule } from './common/auth/auth.module';
import { databaseConfig } from './config/database.config';
import { Demo } from './modules/demo/demo.entity';
import { VehicleTrip } from './modules/vehicle-trip/vehicle-trip.entity';
import { VehicleTrack } from './modules/vehicle-track/vehicle-track.entity';
import { CommonConfigModule } from './modules/common-config/common-config.module';
import { CommonConfig } from './modules/common-config/common-config.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: databaseConfig.type as any,
      database: databaseConfig.database,
      synchronize: databaseConfig.synchronize,
      logging: databaseConfig.logging,
      entities: [Demo, VehicleTrip, VehicleTrack, CommonConfig],
      autoLoadEntities: true,
    }),
    AuthModule,
    DemoModule,
    LoginModule,
    VehicleTripModule,
    VehicleTrackModule,
    CommonConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
