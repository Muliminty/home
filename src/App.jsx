import { BrowserRouter } from 'react-router-dom';
import Router from '@/routes/index';
import './App.scss'; // 确保引入 App.css
import './assets/styles/theme.css'; // 导入主题样式

function App() {
  return (
    <BrowserRouter basename="/home">
      <Router />

    </BrowserRouter>
  );
}

export default App;
