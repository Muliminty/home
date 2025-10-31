// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import { Buffer } from 'buffer';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/home/', // GitHub Pages 子路径
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src', // 这里是设置别名，将 @ 映射到 src 目录
    },
  },
  define: {
    'global': 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer'],
  },
});
