# 漫游笔记

> GitHub Issues 驱动的个人公开时间线 — 用 Issues 写博客，用 Astro 生成静态站点，用 GitHub Pages 免费部署。

**[muliminty.github.io/home](https://muliminty.github.io/home/)**

## 为什么做这个

传统的博客工作流是：本地写 Markdown → commit → push → 等 CI 构建 → 发布。内容更新和代码变更耦合在一起，写一篇短文也要走完整的 Git 流程。

这个项目把**内容创作和代码维护完全解耦**：

- **写内容** = 创建 GitHub Issue（网页、API、移动端都能操作）
- **发布** = Issue 创建/更新后自动触发 GitHub Actions 部署
- **代码** = 只负责「如何展示」，不关心「内容是什么」

## 特性

- **GitHub Issues 作为 CMS**：零成本的持久化存储，自带版本历史和评论系统
- **标签体系管理元数据**：`type:*` 区分内容形态，`status:*` 控制可见性，`tag:*` 管理主题
- **全静态 HTML 输出**：Astro 构建，SEO 友好，无客户端渲染依赖
- **Markdown 渲染管线**：unified/remark/rehype + Shiki 代码高亮 + GFM 支持
- **双模式开发**：`fixture` 模式离线开发不限速，`live` 模式对接真实 API
- **自动部署**：Issue 事件触发 + 定时构建 + 手动触发，GitHub Pages 免费托管
- **RSS 订阅**：对社区友好的 RSS 2.0 输出
- **响应式设计**：移动端/桌面端两套布局，无第三方 CSS 框架

## 内容类型

| 类型 | 标签 | 说明 |
|------|------|------|
| 文章 | `type:article` | 长文，支持封面图、摘要、自定义 slug、阅读时间 |
| 动态 | `type:moment` | 碎片/图片/短想法，自适应图片网格 |

## 快速开始

```bash
# 1. 克隆仓库
git clone git@github.com:Muliminty/home.git
cd home

# 2. 安装依赖（需要 Node >= 22.12）
npm install

# 3. 本地开发（使用 fixture 数据，无需 GitHub Token）
npm run dev

# 4. 预览构建产物
npm run build
npm run preview
```

### 使用 Live 数据源

```bash
# 创建 .env.local，填入 GitHub Personal Access Token
echo 'GH_TOKEN=ghp_xxx' > .env.local

# 开启 live 模式
CONTENT_SOURCE=live npm run dev
```

Token 只需要 `public_repo` 权限（公开仓库）。

## 目录结构

```
src/
  config.ts                  # 站点配置（标题、社交链接、Now 模块、热力图）
  styles/global.css          # 设计 Token + 全局样式
  layouts/BaseLayout.astro   # HTML 骨架 + SEO 元数据
  components/                # UI 组件（全部 .astro）
    SiteHeader.astro         # 导航 + 问候语
    UpdateItem.astro         # 内容卡片分发器
    ArticleCard.astro        # 文章卡片
    MomentCard.astro         # 动态卡片
    MomentImages.astro       # 自适应图片网格
    TableOfContents.astro    # 文章目录侧栏
    CommentSection.astro     # Issue 评论区静态渲染
    GitHubHeatmap.astro      # 贡献热力图
    NowModule.astro          # 最近在做/在读/在听
    IssueSource.astro        # Issue 来源链接
  pages/                     # 路由页面
    index.astro              # 首页
    about/index.astro        # 关于
    updates/index.astro      # 时间线（文章 + 动态混合，支持筛选）
    articles/[slug].astro    # 文章详情
    moments/[number].astro   # 动态详情
    tags/[tag].astro         # 标签聚合
    rss.xml.ts               # RSS 2.0
    404.astro
  lib/
    content/                 # 内容管线
      types.ts               # TypeScript 类型
      schema.ts              # Zod 校验
      parseIssue.ts          # 标签解析 + PR 过滤
      parseArticle.ts        # 文章解析（Frontmatter + 阅读时间）
      parseMoment.ts         # 动态解析（图片提取）
      parseFrontmatter.ts    # YAML Frontmatter 解析
      extractImages.ts       # Markdown 图片提取
      slug.ts                # Slug 策略
      loadContent.ts         # fixture/live 双模式加载
    github/
      fetchIssues.ts         # GitHub REST API 分页拉取
.github/workflows/
  deploy.yml                 # 自动部署流水线
drafts/                      # 本地草稿目录（模板 + 待发布内容）
```

## 内容创作方式

### 方式一：GitHub Web UI

直接在仓库 [Issues](https://github.com/Muliminty/home/issues) 页面创建 Issue：

1. 标题写文章标题
2. 正文第一段用 `---` 包裹 YAML Frontmatter（仅文章），其余写 Markdown
3. 添加标签：`type:article` 或 `type:moment` + 主题标签

Article Frontmatter 示例：
```yaml
---
description: 文章摘要，用于卡片展示和 SEO
publishedAt: 2026-05-03
cover: https://example.com/cover.png
slug: custom-slug
---
```

### 方式二：Claude Code 本地发布

项目内置了 `/publish` 技能，无需打开浏览器：

```
发布文章          # 交互式创建文章
发布动态          # 交互式创建动态
发布 drafts/xxx.md  # 从本地草稿发布
更新 Issue #4     # 更新已发布内容
列出文章           # 查看已发布列表
```

> 详见 [`docs/PUBLISH.md`](docs/PUBLISH.md)

## 标签体系

```
type:article       # 长文章（必需，二选一）
type:moment        # 碎片动态（必需，二选一）
status:pinned      # 置顶
status:draft       # 草稿（构建时跳过）
status:hidden      # 不显示在列表中
tag:frontend       # 主题标签（可多个）
tag:astro
tag:...
```

设计要点：
- 每个 Issue 有且仅有一个 `type:*` 标签
- 非命名空间标签（如 `good first issue`）自动忽略
- `type:` / `status:` / `tag:` 三个命名空间互不干扰

## 自定义

Fork 后修改 `src/config.ts`：

```ts
export const siteConfig = {
  title: 'Your Name',
  description: 'Your tagline',
  author: 'you',
  github: 'https://github.com/you',
  now: {
    doing: '你在做什么',
    reading: '在读什么',
    listening: '在听什么',
  },
  projects: [
    { name: 'project', url: '...', description: '...' },
  ],
  heatmap: {
    username: 'you',  // GitHub 用户名
    weeks: 53,
  },
};
```

修改 `astro.config.ts` 中的 `site` 和 `base` 为你自己的 GitHub Pages 地址。

## 部署

### 触发方式

| 触发条件 | 场景 | 说明 |
|----------|------|------|
| Push to `main` | 代码变更 | 修改代码后推送 main 分支自动部署 |
| Issues 事件 | 内容变更 | 创建/编辑/打标签/关闭/重开 Issue 自动部署 |
| 定时任务 | 兜底更新 | 每天 UTC 3:00 自动构建一次 |
| `workflow_dispatch` | 手动触发 | 在 Actions 面板手动运行 |

### 手动触发部署

打开 https://github.com/Muliminty/home/actions/workflows/deploy.yml

1. 点击 **Run workflow** 按钮
2. Branch 选 `main`
3. 点击绿色 **Run workflow**

![手动触发位置：Actions 标签页 → Deploy to GitHub Pages → Run workflow 按钮]()

### 查看部署状态

打开 https://github.com/Muliminty/home/actions 查看最近的 workflow 运行：

- 🟡 `in_progress` — 正在构建
- 🟢 `completed + success` — 部署成功
- 🔴 `completed + failure` — 部署失败（点进去看日志）

### 首次部署配置

1. **启用 GitHub Pages**：仓库 Settings → Pages → Source 选 **GitHub Actions**
2. **配置 Secret**：Settings → Secrets and variables → Actions → New repository secret
   - Name: `GH_TOKEN`
   - Value: 你的 GitHub Personal Access Token（需要 `public_repo` + `read:user` 权限）
3. 推送代码到 main 分支，自动触发首次部署

### 部署失败排查

| 现象 | 可能原因 | 解决 |
|------|---------|------|
| 构建成功，页面 404 | Pages Source 未设为 Actions | Settings → Pages → GitHub Actions |
| API 403 | `GH_TOKEN` 未配置或过期 | 检查 Secrets 并重新生成 Token |
| Rate limit 耗尽 | Token 权限不够 | 确认 Token 有 `public_repo` 权限 |
| base path 资源 404 | 路径前缀问题 | 确认 `astro.config.ts` 的 `base` 与仓库名一致 |

### 本地预览部署产物

```bash
npm run build
npx astro preview
# 打开 http://localhost:4321/home/
```

## 首页代码块配置

首页代码块从 `src/content/profile.js` 读取内容，Shiki 语法高亮渲染。自动识别技术名并渲染品牌 logo + 品牌色虚线下划线。

```ts
// src/config.ts — codeProfile 配置
codeProfile: {
  themes: { light: 'github-light', dark: 'github-dark' },  // Shiki 双主题
  language: 'javascript',
  filepath: 'src/content/profile.js',      // 内容文件路径

  techs: { 'React': '#61dafb', ... },      // 技术栈 → 品牌色
  sites: { 'github': 'github.com', ... },   // 站点 → favicon 域名
  categories: ['技术栈', '工具', '正在学习'], // 分类标签（自动加粗）
}
```

- **换主题**：改 `themes.light` / `themes.dark` 值
- **加新技术**：在 `techs` 添加映射，下载对应 SVG 到 `public/tech-icons/`
- **加站点链接**：在 `sites` 添加域名
- **缺少 logo**：自动跳过不渲染，无副作用

## 技术栈

| 层 | 选型 |
|----|------|
| 框架 | Astro 6 (static output) |
| 语言 | TypeScript 5.9 |
| 样式 | Astro Scoped Style + CSS Custom Properties |
| Markdown | unified/remark/rehype + Shiki |
| 校验 | Zod 4 |
| 日期 | date-fns 4 |
| 数据源 | GitHub REST API + GraphQL API |
| 部署 | GitHub Actions + GitHub Pages |

## 设计理念

- **内容所有权归你**：所有文章以 GitHub Issues 形式存在你的仓库中，不是第三方数据库
- **URL 稳定性优先**：默认 slug 基于 Issue 编号（而非标题），标题修改不会产生死链
- **渐进增强**：核心内容纯 HTML 直出，交互层按需叠加
- **零依赖样式**：不引入 Tailwind 等第三方 CSS 框架，CSS 变量 + Scoped Style 足够

## License

MIT
