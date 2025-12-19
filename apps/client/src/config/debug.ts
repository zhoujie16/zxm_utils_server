/**
 * @fileoverview 调试配置，控制全局日志输出开关
 * @author Claude
 * @created 2024-01-01
 */

export interface IDebugConfig {
  enableConsoleLog: boolean;
}

const ENABLE_CONSOLE_LOG = true;

export const debugConfig: IDebugConfig = {
  enableConsoleLog: ENABLE_CONSOLE_LOG,
};


