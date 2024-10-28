import React, { lazy } from 'react';


const Home = lazy(() => import('../page/home/index.jsx')); // 使用相对路径
const About = lazy(() => import('../page/about/index.jsx')); // 使用相对路径
const Blog = lazy(() => import('../page/blog/index.jsx')); // 使用相对路径
const APITest = lazy(() => import('../page/apiTest/index.jsx')); // 使用相对路径
const Note = lazy(() => import('../page/note/index.jsx')); // 使用相对路径
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
    path: '/Blog',
    element: <Blog />,
  },
  {
    path: '/Note',
    element: <Note />,
  }
];

export default routesConfig;
