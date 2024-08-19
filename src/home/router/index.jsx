import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routesConfig from './routesConfig';

const AppRouter = () => (
    <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {routesConfig.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                        exact={route.exact}
                    />
                ))}
            </Routes>
        </React.Suspense>
    </Router>
);

export default AppRouter;
