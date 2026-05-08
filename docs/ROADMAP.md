# Roadmap

> 功能清单和开发状态。每完成一项请打勾，新增需求追加到对应阶段。

## v1.0 — 已完成 ✅

### 核心页面

- [x] 首页 `/` — CodeProfile + GitHubHeatmap + 最新近况 + 精选项目 + 社交链接
- [x] 近况 `/updates` — 文章与动态混排时间线，支持全部/文章/动态客户端筛选
- [x] 文章详情 `/articles/[slug]` — Markdown 渲染 + 代码高亮 + TOC 侧栏 + 阅读时间
- [x] 动态详情 `/moments/[number]` — 图片网格 + 正文
- [x] 标签聚合 `/tags/[tag]` — 同一主题下混合展示文章和动态
- [x] 关于 `/about`
- [x] 404 页面

### 内容管线

- [x] GitHub Issues 作为 CMS — fixture / live 双模式数据源
- [x] 标签体系 — `type:*` / `status:*` / `tag:*` 三命名空间
- [x] Slug 策略 — frontmatter 自定义 slug，默认 `issue-{number}`
- [x] Markdown 渲染 — unified/remark/rehype + rehype-pretty-code (Shiki 双主题) + GFM
- [x] Zod schema 校验
- [x] 阅读时间估算

### 部署与 SEO

- [x] GitHub Pages 自动部署 — push / issues 事件 / schedule / workflow_dispatch
- [x] 部署并发控制 — concurrency cancel-in-progress
- [x] SEO — description / Open Graph / Twitter Card / canonical URL
- [x] RSS 2.0（仅文章）
- [x] Sitemap — `@astrojs/sitemap` 集成
- [x] Astro prefetch (hover strategy)

### 视觉与交互

- [x] 暗色/亮色主题切换 — 手动 toggle + curtain 幕布动画 + localStorage 持久化
- [x] 图片灯箱 — lightbox.js 共享单例，文章与动态共用，键盘导航
- [x] Giscus 评论系统
- [x] 加载进度条 + 阅读进度条（scroll-timeline）
- [x] 滚动揭示动画（IntersectionObserver + 交错延迟）
- [x] 3D 卡片倾斜效果（桌面端）
- [x] 自定义鼠标光标 + 拖尾（桌面端）
- [x] 点阵视差背景（桌面端）
- [x] 响应式设计 — 移动端/桌面端两套布局

### 工具链

- [x] `/publish` Claude Code skill — 本地发布文章和动态

---

## v1.1 — 待开发

- [ ] **NowModule 首页集成** — 组件已存在 (`NowModule.astro`)，但首页未渲染且 `siteConfig.now` 字段缺失
- [ ] **阅读进度条移动端兼容** — 当前移动端禁用了 scroll-timeline，考虑 JS fallback
- [ ] **CommentSection 清理** — `CommentSection.astro` / `CommentItem.astro` 已被 `GiscusComments.astro` 替代，待清理或复用

---

## v2.0 — 规划中

### 高优先级

- [ ] **Pagefind 全文搜索** — 构建时索引，零运行时依赖，支持中文
- [ ] **分页** — 代码已预留 page/pageSize 参数，内容增长后必需

### 中优先级

- [ ] **Now 模块接入 Issues** — `type:now` 标签驱动，消除"改 Now 要 push 代码"的技术债
- [ ] **内容系列 (Series)** — `series:xxx` 标签命名空间，文章详情页自动显示上一篇/下一篇
- [ ] **动态独立 RSS Feed** — `/rss-moments.xml`
- [ ] **阅读进度条 + 返回顶部按钮** — 文章详情页长内容体验优化

### 低优先级

- [ ] **命令面板彩蛋** — `src/components/terminal/` 已有 11 个组件，做成隐藏入口（`Ctrl+K` 或 `~`）
- [ ] **图片尺寸构建期探测** — 避免图片加载时页面跳动
- [ ] **标签管理后台** — 可视化管理标签体系
- [ ] **GitHub Discussions 集成**

---

## 待决策

> 来自 REFACTOR_PLAN.md，尚未做最终决定。

- closed Issue 是否需要归档开关？
- slug 是否允许标题型 slug 作为显式选择？
- 首页优先展示最新近况 vs 精选内容？
- 动态是否需要隐私分级或归档？
- 标签是否需要白名单？
- 是否引入 `signal:*` / `mood:*` 状态标签？
- 旧终端风格是否保留为彩蛋？

---

Last doc audit: 2026-05-08
