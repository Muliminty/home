import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from './config';



const Loading = () => 'Loading...'
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
    <Routes>
      {generateRoutes(routes)}
    </Routes>
  );
};

export default Router;