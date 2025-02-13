import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from '@/components/Loading';
import routes from './config';

// 递归生成路由
const generateRoutes = (routes) => {
  return routes.map((route) => {
    const Component = route.element;
    
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={<Component />}>
          {generateRoutes(route.children)}
        </Route>
      );
    }
    
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Suspense fallback={<Loading />}>
            <Component />
          </Suspense>
        }
      />
    );
  });
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {generateRoutes(routes)}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;