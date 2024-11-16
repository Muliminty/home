import { defineConfig } from 'vite'; // 从 Vite 导入 defineConfig 函数，用于定义 Vite 的配置。
import react from '@vitejs/plugin-react'; // 导入 React 插件，用于支持 React 的 JSX 语法。
import envConfig from './env'; // 导入环境变量配置。
import replaceHtmlPathPlugin from './plugin/replaceHtmlPathPlugin'; // 导入自定义插件，用于替换 HTML 文件中的路径。
import path from 'path';
import fs from 'fs-extra';

// 使用 defineConfig 来定义 Vite 配置，支持导入 mode 和其他参数。
export default defineConfig(({ mode }) => {
  // 获取对应模式下的环境变量配置，默认为 'development' 模式。
  const env = envConfig[mode || 'development'];
  console.log('env.VITE_BASE_URL:', env.VITE_BASE_URL);
  console.log('__dirname', __dirname)
  // 判断是否为 admin 模式，用于动态切换配置。
  const isAdmin = mode === 'admin';

  // 确保 env 对象存在，如果不存在则抛出错误。
  if (!env) {
    throw new Error(`环境变量配置错误: ${mode}`);
  }

  // 返回完整的 Vite 配置对象
  return {
    // 配置基础路径，用于解决资源加载问题，基于环境变量配置。
    base: env.VITE_BASE_URL,
    plugins: [
      // 添加 React 插件，确保 JSX 语法和其他 React 特性能够正常工作。
      react({
        babel: {
          plugins: ['babel-plugin-styled-components'],
        },
      }),
      // 使用自定义插件 replaceHtmlPathPlugin，以环境变量为参数，替换 HTML 文件中的路径。
      replaceHtmlPathPlugin(env.VITE_BASE_URL),
      {
        name: 'copy-database',
        closeBundle: async () => {
          // 复制数据库文件夹到 dist
          const src = path.resolve(__dirname, 'database');
          const dest = path.resolve(__dirname, 'dist', 'database');
          await fs.copy(src, dest);
        }
      }
    ],
    build: {
      // 配置 Rollup 的构建选项。
      rollupOptions: {
        input: {
          // 根据是否为 admin 模式，选择不同的入口文件。
          main: isAdmin ? './admin.html' : './index.html',
        },
        output: {
          // 配置生成的 JavaScript 文件名称格式，根据是否为 admin 模式生成不同的文件名。
          entryFileNames: isAdmin ? 'assets/admin-[name]-[hash].js' : 'assets/index-[name]-[hash].js',
          // 配置 chunk 文件名称格式，所有生成的 chunk 文件将遵循此格式。
          chunkFileNames: 'assets/[name]-[hash].js',
          // 配置静态资源文件名称格式，所有生成的静态资源（如图片、字体等）将遵循此格式。
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    server: {
      // port: 80, // 将端口修改为你想要的端口
      // 配置开发服务器启动时自动打开的页面，根据是否为 admin 模式打开不同的页面。
      open: isAdmin ? '/admin.html' : '/',
      // proxy: {
      //   '/github': {
      //     target: 'http://43.136.95.42:3000', // 后端服务器地址
      //     changeOrigin: true, // 更改原点
      //     rewrite: (path) => path.replace(/^\/github/, '/github'), // 保留 /github 前缀
      //   },
      //   '/localFile': {
      //     target: 'http://43.136.95.42:3000', // 后端服务器地址
      //     changeOrigin: true, // 更改原点
      //     rewrite: (path) => path.replace(/^\/localFile/, '/localFile'), // 保留 /github 前缀
      //   },
      // },
      // 确保 history API 支持，例如前端的页面刷新不会导致 404
      historyApiFallback: true // 确保路径会被重写到index.html
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },

    },
    assetsInclude: ['**/*.md'], // 将 .md 文件包含为资产

    compilerOptions: {
      "jsx": "react-jsx"
    },
    include: [
      "node_modules/styled-components",
      "src"
    ]
  };

});
