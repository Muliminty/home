# 📖 MDX博客功能说明

## ✅ 已实现的功能

### 1. 文章管理系统

已创建3篇示例MDX文章：
- 📝 **如何使用React构建终端风格的网站** - 从技术栈到实现的完整指南
- 📚 **React状态管理的最佳实践** - Context API到Redux的状态管理方案
- ⚡ **前端性能优化实战** - 10个让你的应用更快的技巧

**文章位置**：`src/content/blogs/`

### 2. 博客渲染器

使用 `react-markdown` 实现：
- ✅ 完整的Markdown语法支持
- ✅ 代码高亮（基于 react-syntax-highlighter）
- ✅ 终端主题样式适配
- ✅ 响应式设计

**组件**：`BlogRenderer.jsx`

### 3. 终端命令

新增 `read` 命令：
```bash
read 1  # 读取文章1
read 2  # 读取文章2
read 3  # 读取文章3
```

博客列表命令：
```bash
blogs   # 显示所有博客列表
```

### 4. 样式设计

**终端主题配色**：
- 🟢 标题：绿色发光效果
- ⚪ 正文：浅灰色，易读
- 🎨 代码块：深色背景+语法高亮
- 💫 链接：青色，悬停效果

## 📁 项目结构

```
src/
├── content/
│   └── blogs/
│       ├── 如何使用React构建终端风格的网站.md
│       ├── React状态管理的最佳实践.md
│       └── 前端性能优化实战.md
└── components/
    └── terminal/
        └── commands/
            ├── blogs.jsx          # 博客列表和读取逻辑
            ├── BlogRenderer.jsx   # MD渲染组件
            └── BlogRenderer.scss  # 渲染器样式
```

## 🎨 样式特性

### 标题样式
```scss
h1: 大标题，绿色发光，底部边框
h2: 中标题，左侧绿色边框
h3: 小标题，浅绿色
```

### 代码块
- 深色背景 `#1a1a2e`
- 绿色边框
- 语法高亮（使用 Prism 主题）
- 圆角设计

### 链接
- 青色 `#00ffff`
- 悬停变绿色
- 发光效果

### 列表
- 绿色项目符号
- 适当间距

### 表格
- 深色背景
- 绿色边框
- 悬停高亮

## 🚀 使用方法

### 查看博客列表
```bash
blogs
```

### 阅读文章
```bash
read 1
read 2
read 3
```

### 查看帮助
```bash
help
```

## 📦 依赖包

已安装：
- `react-markdown` - Markdown渲染
- `remark-gfm` - GitHub风格Markdown支持
- `react-syntax-highlighter` - 代码高亮
- `rehype-highlight` - 代码高亮增强

## 🔧 技术实现

### 文件导入
使用 Vite 的 `?raw` 后缀直接导入MD文件内容：
```javascript
import blog1 from '../../../content/blogs/article.md?raw';
```

### 渲染器组件
```javascript
<BlogRenderer content={markdownContent} />
```

### 终端命令集成
在 `terminal/index.jsx` 中添加：
```javascript
case 'read':
  return readBlog(args[0]);
```

## 🎯 扩展性

### 添加新文章
1. 在 `src/content/blogs/` 目录下创建 `.md` 文件
2. 在 `blogs.jsx` 的 `blogList` 数组中添加条目
3. 导入文件并关联内容

### 自定义样式
编辑 `BlogRenderer.scss` 可以：
- 调整颜色主题
- 修改字体大小
- 添加更多视觉效果
- 优化响应式布局

### 添加功能
可以扩展：
- 文章搜索
- 分类筛选
- 标签系统
- 文章目录导航

## 💡 示例效果

### 博客列表
```
📖 技术博客

[卡片1] 如何使用 React 构建终端风格的网站
       深入探讨如何创建一个炫酷的终端风格个人主页
       📅 2024-01-15

[卡片2] React 状态管理的最佳实践
       从 Context API 到 Redux，状态管理完整指南
       📅 2024-01-10

💡 提示：输入 read <文章ID> 读取文章
```

### 文章阅读
- 完整的Markdown渲染
- 代码块语法高亮
- 美观的排版
- 终端主题风格

## 🎉 总结

这个MDX博客功能完美地融入了终端风格的个人主页，提供了：
- ✅ 专业的文章展示
- ✅ 良好的阅读体验
- ✅ 统一的视觉风格
- ✅ 易于扩展和维护

现在你的个人主页不仅可以展示项目，还能分享技术见解了！

