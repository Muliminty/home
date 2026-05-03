export const siteConfig = {
  title: 'Muliminty',
  // description: '这里是 Muliminty 的个人站点',
  author: 'muliminty',
  github: 'https://github.com/muliminty',
  email: 'muliminty@example.com',
  defaultOgImage: '/home/default-og.png',
  projects: [
    { name: 'home', url: 'https://github.com/muliminty/home', description: '个人公开时间线站点' },
    { name: 'dotfiles', url: 'https://github.com/muliminty/dotfiles', description: 'macOS 开发环境配置' },
  ],

  /** GitHub 热力图配置 */
  heatmap: {
    username: 'muliminty',
    weeks: 53,
    thresholds: [1, 4, 8, 13],
    colors: ['#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280', '#374151'],
  },

  /** 首页代码块配置 */
  codeProfile: {
    /** 双主题: Shiki 生成 light/dark 两套色值，通过 prefers-color-scheme 自动切换 */
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    language: 'javascript',
    filepath: 'src/content/profile.js',

    /** 代码块动画总时长（毫秒），注释+代码依次动画 */
    animationDuration: 1200,

    /** 技术栈 — name → brand color */
    techs: {
      React: '#61dafb',
      Vue: '#42b883',
      Astro: '#ff5d01',
      TypeScript: '#3178c6',
      'Node.js': '#5fa04e',
      Hono: '#e36002',
      Express: '#000000',
      Tailwind: '#06b6d4',
      Vite: '#646cff',
      Git: '#f05032',
      JavaScript: '#f7df1e',
      HTML: '#e34f26',
      CSS: '#1572b6',
      ESLint: '#4b32c3',
      Prettier: '#f7b93e',
      NuxtJS: '#00dc82',
      Tauri: '#24c8db',
      ThreeJS: '#000000',
      Flutter: '#02569b',
    } as Record<string, string>,

    /** 分类标签 — 在注释中加粗显示 */
    categories: ['技术栈', '工具', '正在学习'],

    /** 站点 — key → favicon 域名 */
    sites: {
      github: 'github.com',
      zhihu: 'zhihu.com',
      xiaohongshu: 'xiaohongshu.com',
    } as Record<string, string>,
  },
};
