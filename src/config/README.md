# 终端风格主页配置指南

这个配置文件允许你完全自定义终端风格主页的外观和行为。

## 📁 配置文件位置

`src/config/terminal.config.js`

## 🎨 配置项说明

### 1. 基础配置

```javascript
site: {
  title: 'Terminal Home',           // 网站标题
  subtitle: '欢迎来到我的个人网站',  // 副标题
  prompt: '你可以输入 help 查看可用命令', // 提示信息
}
```

### 2. 主题配置

自定义颜色方案：

```javascript
theme: {
  primaryColor: '#00ff00',          // 主色调（终端绿）
  textColor: '#ffffff',             // 文字颜色
  backgroundGradient: {              // 背景渐变
    start: '#0a0a0a',
    middle: '#1a1a2e',
    end: '#0a0a0a',
  },
  // ... 更多颜色配置
}
```

**粒子效果配置：**

```javascript
particles: {
  enabled: true,        // 是否启用粒子效果
  count: 50,           // 粒子数量
  minSize: 0.5,        // 最小尺寸
  maxSize: 1.5,        // 最大尺寸
  minSpeed: 0.2,       // 最小速度
  maxSpeed: 0.7,       // 最大速度
  minOpacity: 0.2,     // 最小透明度
  maxOpacity: 0.5,     // 最大透明度
}
```

### 3. 个人信息

```javascript
about: {
  name: 'Your Name',              // 姓名
  job: '前端开发工程师',            // 职业
  skills: 'React, JavaScript...', // 技能（逗号分隔）
  bio: '热爱编程...',              // 个人简介
}
```

### 4. 项目列表

```javascript
projects: [
  {
    name: '项目名称',
    desc: '项目描述',
    tech: 'React, Vite',           // 技术栈
    icon: '💻',                    // 图标（emoji）
    link: 'https://...'            // 项目链接
  },
  // 添加更多项目...
]
```

### 5. 联系方式

```javascript
links: [
  { 
    name: 'GitHub',                           // 名称
    url: 'https://github.com',                // 链接
    icon: '🐱'                                // 图标
  },
  // 添加更多联系方式...
]
```

### 6. 博客配置

```javascript
blog: {
  contentPath: 'content/blogs',    // 博客文件路径
  enabled: true,                   // 是否启用博客
  title: '📖 技术博客',            // 博客标题
  dateFormat: 'YYYY-MM-DD',        // 日期格式
}
```

### 7. 命令配置

```javascript
commands: {
  // 启用的命令
  enabled: ['about', 'projects', 'blogs', 'help', ...],
  
  // 命令别名
  aliases: {
    'tags': 'tag',
    'ls': 'blogs',
    'cat': 'read',
  },
}
```

### 8. 快捷键

```javascript
shortcuts: {
  clear: ['Control', 'KeyL'],     // Ctrl+L 清屏
  escape: ['Escape'],             // ESC 清空
  historyUp: ['ArrowUp'],         // 上一条命令
  historyDown: ['ArrowDown'],     // 下一条命令
}
```

### 9. 终端高级配置

```javascript
terminal: {
  enableParticles: true,          // 启用粒子效果
  showTip: true,                  // 显示顶部提示
  maxHistoryCount: 100,           // 命令历史最大数量
  showHistory: true,              // 显示命令历史
  asciiArt: `你的ASCII艺术`,      // ASCII欢迎信息
}
```

### 10. 部署配置

```javascript
deploy: {
  basePath: '/home/',             // GitHub Pages子路径
  outputDir: 'dist',              // 构建输出目录
}
```

## 🎨 主题配色方案示例

### 经典终端绿（默认）
```javascript
primaryColor: '#00ff00',
backgroundGradient: {
  start: '#0a0a0a',
  middle: '#1a1a2e',
  end: '#0a0a0a',
}
```

### 赛博朋克紫
```javascript
primaryColor: '#b300ff',
backgroundGradient: {
  start: '#0a0a0a',
  middle: '#1a0a2e',
  end: '#0a0a0a',
}
```

### 未来感蓝
```javascript
primaryColor: '#00d4ff',
backgroundGradient: {
  start: '#0a0a0a',
  middle: '#1a1a3e',
  end: '#0a0a0a',
}
```

### 暖色橙
```javascript
primaryColor: '#ff8800',
backgroundGradient: {
  start: '#0a0a0a',
  middle: '#2e1a1a',
  end: '#0a0a0a',
}
```

## 📝 使用示例

修改配置文件后：

1. 保存文件
2. 开发服务器会自动重载
3. 查看效果

**注意**：某些配置修改后需要重启开发服务器。

## 🔧 高级自定义

如需更高级的自定义，可以：

1. 修改 `src/components/terminal/terminal.scss` 调整样式
2. 修改 `src/components/terminal/commands/` 下的命令组件
3. 添加自定义命令

## 💡 提示

- 使用 https://www.ascii-art-generator.org/ 生成自定义ASCII艺术
- 使用 https://emojipedia.org/ 查找合适的图标
- 颜色可以使用颜色选择器如 https://coolors.co/

## 📚 更多信息

查看项目主 README 获取更多信息。

