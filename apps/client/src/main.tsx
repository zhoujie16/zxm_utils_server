/**
 * @fileoverview 应用入口
 * @author Claude
 * @created 2024-01-01
 */

import { createRoot } from 'react-dom/client';
import { initHttpClient, type IHttpError } from '@zxm-toolkit/http-client';
import { App } from './App';
import './styles/index.less';

// 初始化 HTTP 客户端
initHttpClient({
  onError: (error: IHttpError) => {
    console.error('请求错误:', error.message);
  },
});

createRoot(document.getElementById('root')!).render(<App />);
