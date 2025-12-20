/**
 * @fileoverview Vite 构建配置，启用 React 插件和 Less 预处理
 * @author Claude
 * @created 2024-01-01
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: '/zxm-toolkit-client/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared-components/track-map': resolve(__dirname, '../../packages/shared-components/src'),
      '@zxm-toolkit/http-client': resolve(__dirname, '../../packages/http-client/src'),
    },
  },
  server: {
    port: 8009,
    proxy: {
      // localhost:8009/api/** -> http://localhost:8010/api/**
      '/api': {
        target: 'http://localhost:8010',
        changeOrigin: true,
        rewrite: (path) => path,
      },
      // localhost:8009/zxm-toolkit-client/api/** -> http://localhost:8010/api/**
      '/zxm-toolkit-client/api': {
        target: 'http://localhost:8010',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zxm-toolkit-client/, ''),
      },
    },
  },
});
