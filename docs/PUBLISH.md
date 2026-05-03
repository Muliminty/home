# 内容发布指南

本项目的所有内容以 GitHub Issues 形式存储。你可以通过 GitHub 网页端或 Claude Code 本地命令行发布内容。

## 前置条件

在仓库设置中创建以下 Labels（一次性操作）：

```
type:article    type:moment
status:pinned   status:draft   status:hidden
```

> 标签颜色建议统一使用浅灰色（`#ededed`），避免视觉干扰。

---

## 方式一：GitHub 网页端

### 发布文章

1. 打开 [Issues](https://github.com/Muliminty/home/issues) → **New Issue**
2. **标题**：文章标题
3. **正文**：第一段写 Frontmatter，空一行后写 Markdown 正文
4. **Labels**：勾选 `type:article` + 主题标签（如 `tag:frontend`）
5. 点击 **Submit new issue**

示例：

```markdown
---
description: 这是一篇关于前端性能优化的文章，涵盖网络、渲染、运行时三个维度
publishedAt: 2026-05-03
cover: https://example.com/cover.jpg
slug: frontend-perf
---

## 网络层优化

资源加载是性能的第一道关口...
```

### 发布动态

1. 创建 Issue，标题随意（站点不展示动态标题，只展示正文和图片）
2. **正文**：直接写内容，图片用 `![alt](url)` 语法
3. **Labels**：勾选 `type:moment` + 主题标签

示例：

```markdown
路过一家蓝色小店，门口的花开得正好 🌿

![小店门口](https://example.com/photo.jpg)
![花](https://example.com/flower.jpg)
```

### 更新内容

打开已有 Issue → 编辑标题/正文/标签 → 保存。变更会自动触发重新部署。

### 删除内容

关闭 Issue 即可（不会立即删除，但会在构建时跳过）。

---

## 方式二：Claude Code 本地发布

项目内置了 `/publish` 技能，适合习惯终端操作的用户。

### 交互式创建

在 Claude Code 对话中直接说：

```
发布文章
```

Claude 会逐步询问：
1. 标题
2. 标签（逗号分隔，如 `frontend, astro`）
3. 状态（published / pinned / draft / hidden）
4. 文章专属信息（摘要、封面 URL、发布日期、自定义 slug）
5. 正文（直接粘贴 Markdown）

然后自动调用 GitHub API 创建 Issue 并返回链接。

### 草稿文件发布

先在 `drafts/` 目录创建 `.md` 草稿：

```bash
cp drafts/template-article.md drafts/my-post.md
```

编辑草稿：

```markdown
---
type: article
title: 我的新文章
tags: [frontend, astro]
status: published
description: 文章摘要
cover: https://example.com/cover.jpg
publishedAt: 2026-05-03
slug: my-new-post
---

正文内容...
```

然后发布：

```
发布 drafts/my-post.md
```

### 查看和更新

```
列出文章                  # 查看所有已发布文章
列出动态                  # 查看所有已发布动态
更新 Issue #4            # 更新指定 Issue
```

### Token 配置

技能使用项目根目录 `.env.local` 中的 `GH_TOKEN`：

```bash
# .env.local
GH_TOKEN=ghp_xxxxxxxxxxxx
```

Token 需要 `public_repo` 权限。在 [GitHub Settings → Tokens](https://github.com/settings/tokens) 创建。

---

## 内容格式参考

### Article Frontmatter 字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `description` | 是 | 文章摘要，用于卡片展示和 SEO description |
| `publishedAt` | 否 | 发布日期，格式 `YYYY-MM-DD`，默认用 Issue 创建日期 |
| `cover` | 否 | 封面图完整 URL |
| `slug` | 否 | 自定义 URL 路径，默认 `issue-N` |

### 动态图片展示规则

动态中的图片按以下规则自适应：

- **1 张图片**：4:3 比例，全宽展示
- **2-4 张图片**：2 列正方形网格
- **更多图片**：2 列正方形网格，仅展示前 4 张

### 特殊状态

| 状态标签 | 效果 |
|----------|------|
| `status:pinned` | 置顶，排在列表前面 |
| `status:draft` | 草稿，构建时完全跳过（不生成页面） |
| `status:hidden` | 隐藏，不出现在列表中，但详情页可访问 |

---

## 标签管理

标签是站点内容组织的核心。建议主题标签遵循以下约定：

- 使用小写英文，多词用连字符：`tag:open-source`、`tag:system-design`
- 每个 Issue 建议不超过 5 个主题标签
- 新标签首次使用时需先在仓库 Labels 中创建
- 临时删除标签不会影响已有 Issue

---

## FAQ

### 发布后多久能在站点看到？

Issue 事件触发 GitHub Actions 后大约 2-3 分钟完成构建和部署。

### 如何本地预览内容效果？

使用 fixture 模式，在 `src/lib/content/fixtures/issues.json` 中添加模拟数据，然后 `npm run dev`。

### 如何迁移已有的 Markdown 文章？

写个脚本遍历你现有的 `.md` 文件，调用 GitHub Issues API 批量创建即可。每个 Issue 的 body 保持 Markdown 格式不变，根据内容类型打上对应标签。

### 是否支持图片上传？

Issue body 中的图片需要用图床 URL（如 GitHub CDN、Cloudflare R2 等）。建议在 Issue 正文中直接粘贴图片，GitHub 会自动上传到 CDN 并生成 `https://github.com/user-attachments/assets/...` 链接。

### 评论会实时展示吗？

评论在构建时静态渲染。新评论不会实时出现在站点上，需要等下一次构建触发（Issue 有新评论 → 手动触发 workflow_dispatch，或等定时构建）。

### Token 泄漏了怎么办？

立即在 [GitHub Settings → Tokens](https://github.com/settings/tokens) 中 revoke，然后生成新的。Token 只用于构建时读取公开的 Issues 数据，泄漏后攻击者最多能读你的 Issues。
