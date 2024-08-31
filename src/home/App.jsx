import React from 'react';
import AppRouter from './router';
import './App.scss';
import ErrorBoundary from '@/components/error-boundary/index';

const App = () => {
  return (
    <div className="App">
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </div>
  );
};

export default App;
