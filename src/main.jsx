import { Buffer } from 'buffer';

// 全局注入 Buffer，让 gray-matter 可以在浏览器中使用
window.Buffer = Buffer;
globalThis.Buffer = Buffer;

// Single Page Apps for GitHub Pages - 路由恢复
(function(l) {
  if (l.search[1] === '/' ) {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location))

import { createRoot } from 'react-dom/client';
import App from './App';

// 替换 React 19 的 render 方法
const root = createRoot(document.getElementById('root'));
root.render(<App />);