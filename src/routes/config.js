import { lazy } from 'react';
// import HomeLayout from '@/components/layout/home-layuot';

const routes = [
  {
    path: '/',
    element: lazy(() => import('@/page/home')),
  },
  {
    path: '/about',
    element: lazy(() => import('@/page/about')),
  },
  {
    path: '/note',
    element: lazy(() => import('@/page/note')),
  },
  {
    path: '*',
    element: lazy(() => import('@/page/404')),
  },
];

export default routes; 