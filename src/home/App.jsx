import React from 'react';
import AppRouter from './router';
import './App.scss'
import ThemeSwitcher from '@/components/theme-switcher/index';
const App = () => {
  return (
    <div className="App">
      <ThemeSwitcher />
      <AppRouter />
    </div>
  );
};

export default App;
