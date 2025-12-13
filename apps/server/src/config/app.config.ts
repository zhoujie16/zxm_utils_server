/**
 * 应用配置
 * 定义应用程序的基础配置
 */
export const appConfig = {
  // 应用运行环境
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // HTTP 服务端口
  port: parseInt(process.env.PORT || '8010', 10),
  
  // 全局 API 前缀
  apiPrefix: process.env.API_PREFIX || 'api',
  
  // CORS 允许来源
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // 管理员账号配置（必须通过环境变量配置）
  admin: {
    username: process.env.ADMIN_USERNAME || '',
    password: process.env.ADMIN_PASSWORD || '',
  },
};

