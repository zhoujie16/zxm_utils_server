/**
 * @fileoverview 应用入口
 * @author Claude
 * @created 2024-01-01
 */

import { createRoot, type Root } from 'react-dom/client';
import { unstableSetRender } from 'antd-mobile';
import { initHttpClient, type IHttpError } from '@zxm-toolkit/http-client';
import { App } from './App';
import 'antd-mobile/es/global';
import './styles/index.less';

// 扩展容器类型以支持 _reactRoot 属性
declare module 'react-dom/client' {
  interface Container {
    _reactRoot?: Root;
  }
}

// 配置 antd-mobile 以兼容 React 19
unstableSetRender((node, container) => {
  container._reactRoot ||= createRoot(container);
  const root = container._reactRoot;
  root.render(node);
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

// 初始化 HTTP 客户端
initHttpClient({
  onError: (error: IHttpError) => {
    console.error('请求错误:', error.message);
  },
});

createRoot(document.getElementById('root')!).render(<App />);
