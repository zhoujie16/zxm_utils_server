/**
 * 通用接口定义
 * 存放共享的接口类型
 */

// 示例接口
export interface ICommonResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

