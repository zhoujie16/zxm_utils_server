/**
 * @name umi 的路由配置
 * @description 基础模板路由配置
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  // 登录页面 (无布局)
  {
    path: '/login',
    component: './login',
    layout: false,
  },

  // 主应用路由
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: '首页',
    icon: 'HomeOutlined',
    component: './home',
  },
  {
    path: '/vehicle-trip',
    name: '车辆行程',
    icon: 'CarOutlined',
    component: './vehicle-trip',
  },
  {
    path: '/vehicle-track',
    name: '车辆轨迹',
    icon: 'CarOutlined',
    component: './vehicle-track',
  },

  // 404页面
  {
    path: '*',
    component: './404',
    layout: false,
  },
];

