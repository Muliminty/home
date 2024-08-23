import React from 'react';
import AppRouter from './router';
import './App.scss';
import ThemeSwitcher from '@/components/theme-switcher/index';
import ErrorBoundary from '@/components/error-boundary/index';

const App = () => {
  return (
    <div className="App">
      <ErrorBoundary>
        <ThemeSwitcher />
        <AppRouter />
      </ErrorBoundary>
    </div>
  );
};

export default App;
