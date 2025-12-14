/**
 * 公共配置实体类
 * 用于存储系统级别的配置信息
 */
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('common_configs')
export class CommonConfig {
  /**
   * 主键ID
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 配置键（唯一标识）
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  configKey: string;

  /**
   * 配置值，一般为JSON字符串
   */
  @Column({ type: 'text', nullable: true })
  configValue: string;

  /**
   * 配置描述
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  /**
   * 排序顺序
   */
  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  /**
   * 是否启用
   */
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  /**
   * 创建时间
   */
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}