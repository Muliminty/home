import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envConfig from './env';
import replaceHtmlPathPlugin from './plugin/replaceHtmlPathPlugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = envConfig[mode];
  console.log('env.VITE_BASE_URL:', env.VITE_BASE_URL);

  // 确保 env 对象的存在
  if (!env) {
    throw new Error(`环境变量配置错误: ${mode}`);
  }

  return {
    // 
    // base: env.VITE_BASE_URL,
    base: '/home/',
    plugins: [
      react(),
      // replaceHtmlPathPlugin(env.VITE_BASE_URL) // 使用自定义插件
    ],
  }
})

