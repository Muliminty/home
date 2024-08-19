import React, { lazy } from 'react';

const Home = lazy(() => import('../page/home/index.jsx'));
const About = lazy(() => import('../page/about/index.jsx'));

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
