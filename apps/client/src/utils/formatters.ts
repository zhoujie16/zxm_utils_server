/**
 * @fileoverview 格式化工具函数
 */

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(1)} ${units[index]}`;
};

/**
 * 格式化日期时间
 */
export const formatDate = (value?: string | null): string => {
  if (!value) return '-';
  return new Date(value).toLocaleString();
};
