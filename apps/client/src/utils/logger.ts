/**
 * @fileoverview 统一日志工具，受全局调试配置控制
 * @author Claude
 * @created 2024-01-01
 */

import { debugConfig } from '../config/debug';

export interface ILogger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

const createLogger = (): ILogger => {
  const shouldLog = debugConfig.enableConsoleLog;

  if (!shouldLog) {
    const noop = () => {};

    return {
      log: noop,
      info: noop,
      warn: noop,
      error: noop,
      debug: noop,
    };
  }

  return {
    log: (...args: unknown[]) => {
      console.log(...args);
    },
    info: (...args: unknown[]) => {
      console.info(...args);
    },
    warn: (...args: unknown[]) => {
      console.warn(...args);
    },
    error: (...args: unknown[]) => {
      console.error(...args);
    },
    debug: (...args: unknown[]) => {
      console.debug(...args);
    },
  };
};

export const logger: ILogger = createLogger();


