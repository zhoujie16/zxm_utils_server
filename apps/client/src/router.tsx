/**
 * @fileoverview 路由配置
 * @author Claude
 * @created 2024-01-01
 */

import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import VehicleTripPage from './pages/vehicle-trip';
import VehicleTrackPage from './pages/vehicle-track';

/**
 * 受保护的路由组件
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * 公共路由组件（已登录用户访问时重定向到首页）
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = isAuthenticated();

  if (isAuth) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

/**
 * 路由布局组件
 */
const RootLayout: React.FC = () => {
  return <Outlet />;
};

// 路由配置
const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          path: '/',
          element: <Navigate to="/home" replace />,
        },
        {
          path: '/login',
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          ),
        },
        {
          path: '/home',
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/vehicle-trip',
          element: (
            <ProtectedRoute>
              <VehicleTripPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/vehicle-track',
          element: (
            <ProtectedRoute>
              <VehicleTrackPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ],
  {
    basename: '/zxm-toolkit-client',
  }
);

// 路由提供者组件
export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
