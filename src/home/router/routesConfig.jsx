import React, { lazy } from 'react';

// const Home = lazy(() => import('@/home/page/home/index.jsx')); // 使用 @/home 别名
// const About = lazy(() => import('@/home/page/about/index.jsx')); // 使用 @/home 别名

const Home = lazy(() => import('../page/home/index.jsx')); // 使用相对路径
const About = lazy(() => import('../page/about/index.jsx')); // 使用相对路径
const routesConfig = [
  {
    path: '/',
    element: <Home />,
    exact: true,
  },
  {
    path: '/about',
    element: <About />,
  },
];

export default routesConfig;