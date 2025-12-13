/**
 * 数据库配置
 * 定义数据库连接相关配置
 * 
 * SQLite 数据库文件建议存放在项目根目录的 data/ 目录下
 * 例如: data/app.db 或 data/database.sqlite
 */
import * as path from 'path';

const getDatabasePath = (): string => {
  const dbPath = process.env.SQLITE_DATABASE || 'data/app.db';
  // 如果是相对路径，转换为绝对路径
  if (!path.isAbsolute(dbPath)) {
    return path.join(process.cwd(), dbPath);
  }
  return dbPath;
};

export const databaseConfig = {
  type: 'better-sqlite3',
  
  // 数据库文件路径（使用绝对路径）
  database: getDatabasePath(),
  
  // 是否自动同步数据库结构（开发环境可设为 true，生产环境必须为 false）
  synchronize: process.env.SQLITE_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
  
  // 是否启用 SQL 日志（开发环境可设为 true，生产环境建议为 false）
  logging: process.env.SQLITE_LOGGING === 'true' || process.env.NODE_ENV !== 'production',
};

