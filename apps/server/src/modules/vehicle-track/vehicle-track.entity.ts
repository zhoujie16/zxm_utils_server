/**
 * VehicleTrack 实体
 * 车辆轨迹数据表结构定义
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('vehicle_track')
@Unique(['imei', 'gpsTime']) // 唯一约束：imei + gpsTime 组合必须唯一，防止重复数据
export class VehicleTrack {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '设备IMEI', example: '868120325700570' })
  @Index()
  @Column({ type: 'varchar', length: 50, default: '868120325700570' })
  imei: string;

  @ApiProperty({ description: '方向（度）', example: 0 })
  @Column({ type: 'integer', default: 0 })
  direction: number;

  @ApiProperty({ description: '门时间（13位时间戳）', example: 1736822394000 })
  @Index()
  @Column({ type: 'bigint' })
  gateTime: number;

  @ApiProperty({ description: 'GPS模式', example: 0 })
  @Column({ type: 'integer', default: 0 })
  gpsMode: number;

  @ApiProperty({ description: 'GPS速度（km/h）', example: 8.0 })
  @Column({ type: 'real', default: 0 })
  gpsSpeed: number;

  @ApiProperty({ description: 'GPS时间（13位时间戳）', example: 1736822392000 })
  @Index()
  @Column({ type: 'bigint' })
  gpsTime: number;

  @ApiProperty({ description: '纬度', example: 31.194825142366195 })
  @Column({ type: 'real' })
  lat: number;

  @ApiProperty({ description: '经度', example: 121.54489237789676 })
  @Column({ type: 'real' })
  lng: number;

  @ApiProperty({ description: '定位方法', example: 0 })
  @Column({ type: 'integer', default: 0 })
  posMethod: number;

  @ApiProperty({ description: '定位多重标志', example: 0 })
  @Column({ type: 'integer', default: 0 })
  posMulFlag: number;

  @ApiProperty({ description: '定位类型', example: 1 })
  @Column({ type: 'integer', default: 1 })
  posType: number;

  @ApiProperty({ description: '精度', example: 0 })
  @Column({ type: 'integer', default: 0 })
  precision: number;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
