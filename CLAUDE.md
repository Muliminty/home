# home

GitHub Issues 驱动的个人公开时间线 — Astro 6 + TypeScript 静态站点，GitHub Pages 部署。

## 技术栈

Astro 6 (static) / TypeScript 5.9 / React 19 / Zod 4 / date-fns 4 / GitHub REST API

## 关键命令

```bash
npm run dev        # 本地开发（默认 fixture 数据）
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

## 数据模式

- `fixture` — 本地模拟数据（默认）
- `live` — 设置 `CONTENT_SOURCE=live` + `.env.local` 中 `GH_TOKEN` 使用真实 Issues

## Feature status (see docs/ROADMAP.md for full details)

**Done (v1.0):** 首页, 近况时间线, 文章详情(TOC+代码高亮), 动态详情, 标签聚合, 关于, 404, RSS(文章), Sitemap, SEO(OG/Twitter/canonical), 暗色/亮色主题切换(curtain动画), 图片灯箱, Giscus评论, fixture/live双模式, GitHub Pages自动部署(push/issues/schedule/dispatch), 滚动揭示动画, 3D卡片倾斜, 自定义光标, 点阵视差, 加载+阅读进度条, prefetch, /publish skill

**Pending (v1.1):** NowModule首页集成(组件存在但未渲染), CommentSection清理(已被Giscus替代)

**Planned (v2.0):** Pagefind搜索, 分页, Now模块接入Issues(type:now), 内容系列(Series), 动态RSS, 命令面板彩蛋(terminal组件已存在), 图片尺寸探测, 标签管理后台

## Documentation

文档规范见 `docs/CONTRIBUTING.md`。功能完成后必须同步更新 `docs/ROADMAP.md`（打勾）和本文件（Feature status）。根目录只保留 README.md 和 CLAUDE.md，其余文档统一放 `docs/`。

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
