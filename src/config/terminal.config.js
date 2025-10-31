/**
 * 终端风格主页配置文件
 * 修改此文件来个性化你的网站
 */

export const terminalConfig = {
  // ==================== 基础配置 ====================
  
  // 网站标题和介绍
  site: {
    title: 'Terminal Home',
    subtitle: '欢迎来到我的个人网站',
    prompt: '你可以输入 help 查看可用命令',
  },

  // ==================== 主题配置 ====================
  
  theme: {
    // 主色调（终端绿）
    primaryColor: '#00ff00',
    // 文字颜色
    textColor: '#ffffff',
    // 背景渐变
    backgroundGradient: {
      start: '#0a0a0a',
      middle: '#1a1a2e',
      end: '#0a0a0a',
    },
    // 网格线颜色
    gridColor: 'rgba(0, 255, 0, 0.03)',
    // 边框颜色
    borderColor: 'rgba(0, 255, 0, 0.2)',
    // 背景高亮颜色
    bgHighlight: 'rgba(0, 255, 0, 0.05)',
    // 悬停高亮颜色
    bgHover: 'rgba(0, 255, 0, 0.1)',
    // 滚动条颜色
    scrollbarColor: 'rgba(0, 255, 0, 0.3)',
    // 粒子效果配置
    particles: {
      enabled: true,
      count: 50,
      minSize: 0.5,
      maxSize: 1.5,
      minSpeed: 0.2,
      maxSpeed: 0.7,
      minOpacity: 0.2,
      maxOpacity: 0.5,
    },
  },

  // ==================== 个人信息 ====================
  
  about: {
    name: 'Your Name',
    job: '前端开发工程师',
    skills: 'React, JavaScript, TypeScript, Node.js',
    bio: '热爱编程，专注于前端开发，喜欢探索新技术和最佳实践。这个网站使用 React + Vite 构建，展示终端风格的交互界面。',
  },

  // ==================== 项目列表 ====================
  
  projects: [
    { 
      name: 'Terminal Portfolio', 
      desc: '一个终端样式的个人主页，使用React和Vite构建', 
      tech: 'React, Vite, SCSS',
      icon: '💻',
      link: '#'
    },
    { 
      name: 'Task Manager', 
      desc: '一个功能完整的任务管理系统，支持实时协作', 
      tech: 'React, Node.js, MongoDB',
      icon: '📋',
      link: '#'
    },
    { 
      name: 'Weather App', 
      desc: '实时天气查询应用，支持全球多个城市', 
      tech: 'React, API',
      icon: '🌤️',
      link: '#'
    },
  ],

  // ==================== 联系方式 ====================
  
  links: [
    { name: 'GitHub', url: 'https://github.com', icon: '🐱' },
    { name: '博客', url: 'https://blog.example.com', icon: '📝' },
    { name: '邮箱', url: 'mailto:your@email.com', icon: '📧' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
  ],

  // ==================== 博客配置 ====================
  
  blog: {
    // 博客文件夹路径（相对于 src 目录）
    contentPath: 'content/blogs',
    // 是否启用博客功能
    enabled: true,
    // 博客标题
    title: '📖 技术博客',
    // 默认日期格式
    dateFormat: 'YYYY-MM-DD',
  },

  // ==================== 命令配置 ====================
  
  commands: {
    // 启用的命令列表
    enabled: ['about', 'projects', 'blogs', 'read', 'tag', 'help', 'link', 'clear', 'history'],
    // 命令别名映射
    aliases: {
      'tags': 'tag',
      'ls': 'blogs',
      'cat': 'read',
    },
  },

  // ==================== 快捷键配置 ====================
  
  shortcuts: {
    clear: ['Control', 'KeyL'],      // Ctrl+L 清屏
    escape: ['Escape'],              // ESC 清空输入
    historyUp: ['ArrowUp'],          // ↑ 上一条历史
    historyDown: ['ArrowDown'],      // ↓ 下一条历史
  },

  // ==================== 高级配置 ====================
  
  terminal: {
    // 粒子效果
    enableParticles: true,
    // 显示顶部提示
    showTip: true,
    // 命令历史最大数量
    maxHistoryCount: 100,
    // 显示命令历史
    showHistory: true,
    // ASCII 艺术欢迎信息
    asciiArt: `
▗▖  ▗▖▗▖ ▗▖▗▖   ▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▖  ▗▖
▐▛▚▞▜▌▐▌ ▐▌▐▌     █  ▐▛▚▞▜▌  █  ▐▛▚▖▐▌  █   ▝▚▞▘ 
▐▌  ▐▌▐▌ ▐▌▐▌     █  ▐▌  ▐▌  █  ▐▌ ▝▜▌  █    ▐▌  
▐▌  ▐▌▝▚▄▞▘▐▙▄▄▖▗▄█▄▖▐▌  ▐▌▗▄█▄▖▐▌  ▐▌  █    ▐▌  
`,
  },

  // ==================== 部署配置 ====================
  
  deploy: {
    // GitHub Pages 部署路径（如果是根目录则设为 '/'）
    basePath: '/home/',
    // 构建输出目录
    outputDir: 'dist',
  },
};

// 默认配置（用于开发环境）
export const defaultConfig = terminalConfig;

