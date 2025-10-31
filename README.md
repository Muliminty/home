# 🖥️ Terminal 个人主页

一个炫酷的终端风格个人主页，使用 React + Vite 构建。

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 特性

- 🎨 **炫酷的终端UI** - 经典的绿色主题，科幻感十足
- ✨ **粒子背景动画** - Canvas实时渲染，流畅的粒子效果
- 📱 **完全响应式** - 完美适配桌面、平板、手机
- ⌨️ **键盘快捷键** - 提升交互效率
- 🎯 **命令系统** - 类似真实终端的命令体验
- 💫 **光晕效果** - 霓虹灯般的视觉效果

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📖 使用指南

### 可用命令

| 命令 | 描述 | 快捷键 |
|------|------|--------|
| `help` | 显示帮助信息 | - |
| `about` | 查看个人简介 | - |
| `projects` | 浏览项目列表 | - |
| `blogs` | 查看技术博客 | - |
| `link` | 联系方式 | - |
| `history` | 命令历史 | - |
| `clear` | 清空屏幕 | `Ctrl+L` |

### 键盘快捷键

- `Ctrl+L` - 快速清屏
- `ESC` - 清空当前输入
- `↑↓` - 在help中导航
- `Enter` - 执行命令
- `Tab` - 自动补全（开发中）

## 🎨 界面预览

### 主要特性
- **粒子背景** - 绿色粒子飘落效果
- **渐变背景** - 深色渐变+栅格线
- **光晕效果** - 所有文本都有霓虹灯效果
- **自定义滚动条** - 绿色主题

### 交互效果
- 命令卡片悬停高亮
- 光标闪烁动画
- 平滑过渡动画
- 响应式布局

## 🛠️ 技术栈

- **React** - UI框架
- **Vite** - 构建工具
- **SCSS** - 样式预处理
- **Canvas API** - 粒子动画
- **React Router** - 路由管理

## 📁 项目结构

```
src/
├── components/
│   └── terminal/
│       ├── index.jsx           # 主组件
│       ├── CommandInput.jsx    # 命令输入
│       ├── CommandOutput.jsx   # 命令输出
│       ├── commands/           # 命令集合
│       │   ├── about.js        # 关于我
│       │   ├── blogs.js        # 博客列表
│       │   ├── help.jsx        # 帮助系统
│       │   ├── link.jsx        # 联系方式
│       │   └── projects.js     # 项目展示
│       └── terminal.scss       # 样式文件
├── hooks/                      # 自定义Hooks
├── page/                       # 页面组件
├── routes/                     # 路由配置
└── assets/                     # 静态资源
```

## 🎯 自定义配置

### 修改个人信息

编辑 `src/components/terminal/commands/about.js`:

```javascript
{
  name: 'Your Name',
  职业: '前端开发工程师',
  skill: 'React, JavaScript, TypeScript',
}
```

### 添加项目

编辑 `src/components/terminal/commands/projects.js`:

```javascript
{
  name: '项目名称',
  desc: '项目描述',
  tech: 'React, Node.js',
  icon: '💻',
  link: 'https://your-project.com'
}
```

### 修改主题色

编辑 `src/components/terminal/terminal.scss`:

```scss
// 修改绿色主题色
color: #00ff00;  // 改为你喜欢的颜色
```

## 🔧 开发

### 代码规范

项目使用 ESLint 进行代码检查：

```bash
npm run lint
```

### 文件命名

- 组件：PascalCase（如 `Terminal.jsx`）
- 工具函数：camelCase（如 `formatDate.js`）
- 样式文件：kebab-case 或与组件同名

## 📝 更新日志

### v1.1.0 (最新)
- ✨ 添加粒子背景动画
- ✨ 添加光晕和阴影效果
- ✨ 改进所有命令的UI
- ✨ 添加键盘快捷键支持
- ✨ 添加清屏和历史命令
- ✨ 添加帮助系统导航
- ✨ 优化响应式设计
- ✨ 添加自定义滚动条
- ✨ 添加顶部提示栏

### v1.0.0
- 🎉 初始版本发布
- ✅ 基础命令系统
- ✅ 终端UI设计

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- React 团队
- Vite 团队
- 所有开源贡献者

## 📮 联系方式

- GitHub: [@yourname](https://github.com)
- Email: your@email.com
- Blog: https://yourblog.com

---

**⭐ 如果这个项目对你有帮助，请给个Star！**
