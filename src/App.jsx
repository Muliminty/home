import { BrowserRouter } from 'react-router-dom';
import Router from '@/routes/index';
import { TransitionProvider } from './components/transition-provider';
import { ThemeProvider } from './components/theme-provider';
import './App.scss'; // 确保引入 App.css
import './assets/styles/theme.css'; // 导入主题样式

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TransitionProvider>
          {/* <CursorEffect /> */}
          <Router />
        </TransitionProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
