import { lazy } from 'react';
import HomeLayout from '@/components/layout/home-layuot';

const routes = [
  {
    path: '/',
    element: lazy(() => import('@/page/show')),
  },
  {
    path: '/home',
    element: HomeLayout,
    children: [
      {
        title: '笔记',
        path: 'index',
        element: lazy(() => import('@/page/note')),
      },
      // 这里可以继续添加其他子路由
      {
        title: '关于',
        path: 'about',
        element: lazy(() => import('@/page/about')),
      }
    ]
  },
  {
    path: '*',
    element: lazy(() => import('@/page/404')),
  }
];

export default routes; 