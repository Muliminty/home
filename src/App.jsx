import { BrowserRouter } from 'react-router-dom';
import Router from '@/routes/index';
import { TransitionProvider } from './components/transition-provider';
import './App.css'; // 确保引入 App.css
function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Router />
      </TransitionProvider>
    </BrowserRouter>
  );
}

export default App;
