// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import { createRoot } from 'react-dom/client';
import App from './App';

// 替换 React 19 的 render 方法
const root = createRoot(document.getElementById('root'));
root.render(<App />);