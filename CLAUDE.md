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
