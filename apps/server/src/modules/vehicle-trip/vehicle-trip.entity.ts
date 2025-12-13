/**
 * VehicleTrip 实体
 * 车辆行程数据表结构定义
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('vehicle_trip')
export class VehicleTrip {
  @ApiProperty({ description: 'ID', example: 559 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '外部系统ID', example: 1999486241237065700 })
  @Index()
  @Column({ type: 'bigint' })
  externalId: number;

  @ApiProperty({ description: '车辆ID', example: 2032011 })
  @Index()
  @Column({ type: 'integer' })
  vehicleId: number;

  @ApiProperty({ description: '车型ID', example: 14493 })
  @Column({ type: 'integer' })
  modelId: number;

  @ApiProperty({ description: '车型名称', example: '2013款 1.6L 自动舒适版' })
  @Column({ type: 'varchar', length: 200 })
  model: string;

  @ApiProperty({ description: '品牌ID', example: 1 })
  @Column({ type: 'integer' })
  brandId: number;

  @ApiProperty({ description: '品牌名称', example: '大众' })
  @Column({ type: 'varchar', length: 100 })
  brand: string;

  @ApiProperty({ description: '系列ID', example: 145 })
  @Column({ type: 'integer' })
  seriesId: number;

  @ApiProperty({ description: '系列名称', example: 'Polo' })
  @Column({ type: 'varchar', length: 100 })
  series: string;

  @ApiProperty({ description: '设备ID', example: 'AD20-N0UE4310122' })
  @Index()
  @Column({ type: 'varchar', length: 100 })
  deviceId: string;

  @ApiProperty({ description: '单位ID', example: 806 })
  @Index()
  @Column({ type: 'integer' })
  unitId: number;

  @ApiProperty({ description: '油耗（毫升）', example: 2585 })
  @Column({ type: 'integer' })
  consumption: number;

  @ApiProperty({ description: '里程（米）', example: 42313 })
  @Column({ type: 'integer' })
  mileage: number;

  @ApiProperty({ description: '平均速度（km/h）', example: 47 })
  @Column({ type: 'integer' })
  velocity: number;

  @ApiProperty({ description: '最大速度（km/h）', example: 104 })
  @Column({ type: 'integer' })
  maxSpeed: number;

  @ApiProperty({ description: '急加速次数', example: 0 })
  @Column({ type: 'integer' })
  sharpAcceleration: number;

  @ApiProperty({ description: '急减速次数', example: 0 })
  @Column({ type: 'integer' })
  sharpDeceleration: number;

  @ApiProperty({ description: '急转弯次数', example: 0 })
  @Column({ type: 'integer' })
  sharpTurn: number;

  @ApiProperty({ description: '开始时间（时间戳，毫秒）', example: 1765546341000 })
  @Index()
  @Column({ type: 'bigint' })
  startTime: number;

  @ApiProperty({ description: '结束时间（时间戳，毫秒）', example: 1765549540000 })
  @Column({ type: 'bigint' })
  endTime: number;

  @ApiProperty({ description: '创建时间', example: '2025-12-13T01:42:59.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2025-12-13T01:42:59.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Raw 扁平化字段
  @ApiProperty({ description: '原始开始时间（时间戳，毫秒）', example: 1765546341000 })
  @Column({ type: 'bigint' })
  raw_start_time: number;

  @ApiProperty({ description: '原始结束时间（时间戳，毫秒）', example: 1765549540000 })
  @Column({ type: 'bigint' })
  raw_end_time: number;

  @ApiProperty({ description: '原始平均油耗（毫升）', example: 61 })
  @Column({ type: 'integer' })
  raw_te_record_trip_avg_oil: number;

  @ApiProperty({ description: '原始平均转速（rpm）', example: 1473 })
  @Column({ type: 'integer' })
  raw_te_record_trip_avg_rpm: number;

  @ApiProperty({ description: '原始平均速度（km/h）', example: 47 })
  @Column({ type: 'integer' })
  raw_te_record_trip_avg_speed: number;

  @ApiProperty({ description: '原始最大转速（rpm）', example: 2783 })
  @Column({ type: 'integer' })
  raw_te_record_trip_max_rpm: number;

  @ApiProperty({ description: '原始最大速度（km/h）', example: 104 })
  @Column({ type: 'integer' })
  raw_te_record_trip_max_speed: number;

  @ApiProperty({ description: '原始里程（米）', example: 42313 })
  @Column({ type: 'integer' })
  raw_te_record_trip_mileage: number;

  @ApiProperty({ description: '原始单位ID', example: 806 })
  @Column({ type: 'integer' })
  raw_te_record_trip_no: number;

  @ApiProperty({ description: '原始油耗（毫升）', example: 2585 })
  @Column({ type: 'integer' })
  raw_te_record_trip_oil: number;

  @ApiProperty({ description: '原始运行时间（秒）', example: 3199 })
  @Column({ type: 'integer' })
  raw_te_record_trip_run_time: number;

  @ApiProperty({ description: '原始开始时间（时间戳，毫秒）', example: 1765546341000 })
  @Column({ type: 'bigint' })
  raw_te_record_trip_start_time: number;

  @ApiProperty({ description: '原始行程类型', example: 0 })
  @Column({ type: 'integer' })
  raw_te_record_trip_type: number;

  @ApiProperty({ description: '原始急加速次数', example: 0 })
  @Column({ type: 'integer' })
  raw_te_record_trip_urgent_acc_cnt: number;

  @ApiProperty({ description: '原始急减速次数', example: 0 })
  @Column({ type: 'integer' })
  raw_te_record_trip_urgent_dec_cnt: number;

  @ApiProperty({ description: '原始急转弯次数', example: 0 })
  @Column({ type: 'integer' })
  raw_te_record_trip_urgent_turn_cnt: number;
}

