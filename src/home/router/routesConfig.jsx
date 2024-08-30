import React, { lazy } from 'react';


const Home = lazy(() => import('../page/home/index.jsx')); // 使用相对路径
const About = lazy(() => import('../page/about/index.jsx')); // 使用相对路径
const Blog = lazy(() => import('../page/blog/index.jsx')); // 使用相对路径
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
    path:'/Blog',
    element: <Blog />,
  }
];

export default routesConfig;
