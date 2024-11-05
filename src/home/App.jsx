import React from 'react';
import ErrorBoundary from '@/components/error-boundary/index';
import AppRouter from './router';
import './App.scss';
import 'react-photo-view/dist/react-photo-view.css';
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
