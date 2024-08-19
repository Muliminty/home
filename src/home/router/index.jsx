import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routesConfig from './routesConfig';
const basename = import.meta.env.BASE_URL || '/';
const AppRouter = () => (
    <Router basename={basename}>
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {routesConfig.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Routes>
        </Suspense>
    </Router>
);

export default AppRouter;
