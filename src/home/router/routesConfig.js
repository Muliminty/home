import React, { lazy } from 'react';

// 动态导入页面组件
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const NotFound = lazy(() => import('../pages/NotFound'));

// 路由配置数组
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
    {
        path: '*',
        element: <NotFound />,
    },
];

export default routesConfig;
