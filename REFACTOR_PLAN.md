# 重构决策文档：GitHub Issues 驱动的个人公开时间线

## 结论

本次重构不迁移旧代码、不复用旧逻辑，也不继续修补旧终端 UI。

旧项目已归档到 `archive/terminal-v1/`，只作为历史备份。新项目从零开始，目标是做一个长期可维护、可持续发布内容的个人公开时间线。

核心判断：

- 站点不是传统博客系统，而是个人公开时间线。
- 文章和瞬间都属于“近况”，只是内容形态不同。
- GitHub Issues 是内容后台。
- Astro 负责静态生成。
- GitHub Pages 负责免费部署。

## 第一版目标

第一版只追求“可发布、可浏览、可持续写作”。

MVP 必须包含：

- 首页 `/`
- 近况时间线 `/updates`
- 文章列表 `/articles`
- 文章详情 `/articles/[slug]`
- 瞬间列表 `/moments`
- 标签聚合 `/tags/[tag]`
- fixture 数据源
- GitHub Issues live 数据源
- GitHub Pages 自动部署

第一版暂不做：

- Pagefind 搜索
- 评论系统
- GitHub Discussions
- 命令面板彩蛋
- 深度动画
- 完整暗色 / 亮色主题切换
- 复杂图片灯箱
- 标签管理后台

这些能力进入第二阶段或后续迭代。

## 产品定位

这个站点应该像一个活着的人，而不是静态作品集。

首页可以围绕这些内容组织：

- Now：现在在做什么、读什么、关注什么
- 最近在想什么
- 最近写了什么
- 最近做了什么
- 我长期关注什么
- 怎么找到我

近况页是核心入口。用户进入 `/updates` 后，按时间线看到文章和瞬间混合出现：一会儿是一篇长文，一会儿是一组图片，一会儿是一段短想法。

## 技术选型

采用：

- Astro
- TypeScript
- React islands
- GitHub REST API
- GitHub Actions
- GitHub Pages
- Zod
- date-fns

第一版可选但不阻塞：

- Astro RSS
- sitemap
- rehype / remark 代码高亮

后续再考虑：

- Pagefind
- 图片尺寸构建期探测
- 更完整的图片预览
- 命令面板彩蛋

## 取舍

选择 Astro，是因为 GitHub Pages 只能托管静态资源，而内容站最需要稳定的静态 HTML。

相比纯 React SPA：

- 首屏更轻。
- SEO 更自然。
- 文章页有真实 HTML。
- RSS 和 sitemap 更容易。
- 不需要访问者浏览器再请求 GitHub API 才能看到核心内容。

React 只用于局部交互，例如筛选增强、图片预览、未来命令面板。

## 内容来源

默认从当前仓库拉取 `state=all` 的 Issues。

发布规则：

- 只有带 `type:article` 或 `type:moment` 的 Issue 才进入内容系统。
- 没有 `type:*` 的 Issue 忽略，仓库仍可正常用 Issues 管理任务。
- `status:draft` 不发布。
- `status:hidden` 不发布。
- `status:pinned` 只影响展示权重，不代表发布状态。
- closed Issue 仍可作为历史内容展示。
- Pull Request 必须过滤，因为 GitHub API 会把 PR 也作为 Issue 返回。

排序规则：

- 默认排序使用 `publishedAt desc`。
- 置顶内容在列表顶部展示。
- 置顶组内仍按 `publishedAt desc` 排序。
- 非置顶组按 `publishedAt desc` 排序。
- `/updates` 和 `/moments` 使用 `publishedAt` 排序。
- `/updates` 必须把 `type:article` 和 `type:moment` 合并成同一个数组后排序。
- `/updates` 不按内容形态分区展示，不能先展示文章再展示瞬间。
- `/articles` 默认也使用 `publishedAt` 排序，后续可增加“最近更新”排序。
- `updatedAt` 只用于展示“最近编辑”信息，不影响近况时间线默认排序。

## 标签规则

标签分三类：内容形态、状态、主题。

### 内容形态标签

- `type:article`：文章型近况，适合长内容。
- `type:moment`：瞬间型近况，适合少文字、多图片。

校验规则：

- 没有 `type:*` 的 Issue 忽略。
- 有一个 `type:*` 的 Issue 进入内容解析。
- 有多个 `type:*` 的 Issue 构建失败。
- `type:article` 和 `type:moment` 互斥。

### 状态标签

- `status:draft`：草稿，不发布。
- `status:hidden`：隐藏，不发布。
- `status:pinned`：置顶或提高展示权重。

### 主题标签

主题标签使用 `tag:*`，可以叠加。

示例：

- `tag:frontend`
- `tag:react`
- `tag:astro`
- `tag:life`
- `tag:photo`
- `tag:reading`
- `tag:project`

规则：

- `tag:*` 只作为主题标签。
- 非命名空间标签，例如 `bug`、`enhancement`，默认忽略。
- `/updates` 可以用主题标签过滤所有近况。
- `/articles` 可以用主题标签只过滤文章。
- `/moments` 可以用主题标签只过滤瞬间。
- `/tags/[tag]` 的 URL 使用去掉 `tag:` 后的值，例如 `tag:react` 对应 `/tags/react`。

## Slug 策略

slug 是长期 URL，第一优先级是稳定，不是漂亮。

规则：

- 有 frontmatter `slug` 时优先使用。
- 没有 `slug` 时默认使用 `issue-123`。
- 标题只用于展示，不参与默认 slug。
- 构建时校验 slug 唯一。
- 修改 Issue 标题不能导致旧链接失效。

不默认使用标题生成 slug，避免中文标题转写、标题修改、URL 失效等问题。

## 内容规范

### 文章型近况

Issue title 是文章标题。

Issue body 支持 frontmatter。第一版只支持这些字段：

- `slug`
- `description`
- `cover`
- `publishedAt`

未知 frontmatter 字段只警告，不导致构建失败。

示例：

```md
---
slug: issue-123
description: 用 GitHub Issues 搭建个人公开时间线
cover: https://github.com/user-attachments/assets/example
publishedAt: 2026-05-03
---

正文使用 Markdown。
```

默认值：

- `slug` 缺省为 `issue-${number}`。
- `description` 缺省时从正文第一段提取。
- `publishedAt` 缺省为 issue `created_at`。
- `updatedAt` 使用 issue `updated_at`。

### 瞬间型近况

瞬间不强制 frontmatter。Issue body 就是内容。

```md
今天路过一家很好看的小店。

![photo1](https://github.com/user-attachments/assets/example-1)
![photo2](https://github.com/user-attachments/assets/example-2)
```

解析规则：

- 提取正文中的图片，按出现顺序展示。
- 去掉图片 Markdown 后的剩余文本作为文案。
- Issue title 主要用于后台管理，前台不强制展示。
- 单图大图展示。
- 多图使用固定比例网格，避免加载时页面跳动。

## 数据模型

```ts
type UpdateKind = 'article' | 'moment';

type ContentBase = {
  kind: UpdateKind;
  number: number;
  title: string;
  issueUrl: string;
  labels: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  pinned: boolean;
};

type ArticleUpdate = ContentBase & {
  kind: 'article';
  slug: string;
  description: string;
  cover?: string;
  body: string;
  readingTime: number;
};

type MomentUpdate = ContentBase & {
  kind: 'moment';
  text: string;
  images: Array<{
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
};

type UpdateItem = ArticleUpdate | MomentUpdate;
```

## 构建失败与警告策略

构建失败：

- 同一个 Issue 有多个 `type:*` 标签。
- slug 重复。
- frontmatter 日期非法。
- `type:article` 没有正文。
- `cover` 声明了但 URL 无法解析。
- Zod schema 不通过。

只警告：

- 没有 `description`，自动生成。
- 没有 `cover`。
- 没有 `tag:*`。
- frontmatter 有未知字段。
- `type:moment` 没有图片。
- 图片 alt 文本缺失。
- 图片尺寸未知，需要前端使用固定 `aspect-ratio` 占位。

## 信息架构

### 首页 `/`

首页不做传统简历页，也不复刻旧终端。

内容模块：

- Now 模块
- 当前状态
- 最近近况
- 长期关注
- 精选项目
- 联系入口

Now 模块第一版可以来自手写配置或 fixture 字段，不需要接入 Issues。建议包含：

- 现在在做什么
- 现在在读什么
- 现在在关注什么
- 最近一次更新

### 近况 `/updates`

核心内容页。

- 按时间线混排文章和瞬间。
- 文章和瞬间是同一条流里的不同卡片形态，不是两个列表或两个分区。
- 支持全部、文章、瞬间筛选。
- 支持主题标签筛选。
- 置顶内容优先展示，但仍保留时间信息。

### 文章 `/articles`

文章型近况的筛选视图。

- 文章列表。
- 主题标签筛选。
- 置顶文章。
- 默认按发布时间排序。
- 后续可增加最近更新排序。

### 文章详情 `/articles/[slug]`

- 标题、描述、时间、标签。
- Markdown 正文。
- 代码高亮。
- 原始 Issue 链接。
- 返回近况时间线入口。

### 瞬间 `/moments`

瞬间型近况的筛选视图。

- 时间线。
- 图片优先。
- 少文字。
- 固定比例图片网格。
- 主题标签筛选。

### 标签 `/tags/[tag]`

同一个主题下混合展示文章和瞬间。

## 部署决策

第一版使用 GitHub 官方 Pages Actions，不继续沿用旧项目的第三方 `gh-pages` 分支部署方式。

原因：

- 权限模型更清晰。
- 不需要额外维护 `gh-pages` 分支。
- GitHub Pages 官方推荐路径更适合新 Astro 项目。

workflow 要求：

- 触发分支：`main`
- 权限：`contents: read`
- 权限：`issues: read`
- 权限：`pages: write`
- 权限：`id-token: write`
- 使用 `actions/configure-pages`
- 使用 `actions/upload-pages-artifact`
- 使用 `actions/deploy-pages`
- 构建命令：`npm ci`、`npm run build`
- 部署目录：`dist`

仓库 Pages 设置要求：

- Settings -> Pages -> Build and deployment -> Source 选择 `GitHub Actions`。
- 不再依赖 `gh-pages` 分支作为 Pages source。

Astro 配置：

```ts
export default defineConfig({
  site: 'https://muliminty.github.io',
  base: '/home/',
  output: 'static',
});
```

## 本地开发策略

本地开发支持两种数据源：

- `fixture`：读取本地 JSON，默认开发模式。
- `live`：请求 GitHub Issues，用于验证真实数据。

建议使用环境变量控制：

```txt
CONTENT_SOURCE=fixture
CONTENT_SOURCE=live
```

live 模式建议支持：

```txt
GITHUB_TOKEN=...
```

没有 `GITHUB_TOKEN` 时，本地默认使用 `fixture`，避免 GitHub API rate limit 影响开发。

建议目录：

```txt
src/
  content/
    fixtures/
      issues.json
  lib/
    github/
      fetchIssues.ts
    content/
      parseIssue.ts
      parseArticle.ts
      parseMoment.ts
      schema.ts
      slug.ts
  pages/
    index.astro
    updates/
      index.astro
    articles/
      index.astro
      [slug].astro
    moments/
      index.astro
    tags/
      [tag].astro
```

`archive/terminal-v1/` 不参与新项目 build、lint、deploy。

## 实施顺序

1. 建立 Astro + React + TypeScript 项目骨架。
2. 新增根目录 README，说明新项目定位和开发命令。
3. 新增 GitHub Pages 官方 Actions workflow。
4. 先部署一个空 Astro 页面，确认 `/home/` base path、静态资源路径、刷新路由都正常。
5. 用 fixture JSON 实现内容模型。
6. 实现标签规则、slug 规则、Zod 校验。
7. 用 fixture 数据完成首页、近况、文章、文章详情、瞬间、标签页。
8. 接入 GitHub Issues live 模式。
9. 增加 RSS、sitemap、代码高亮。
10. 优化图片布局和移动端阅读体验。
11. 后续再考虑搜索、评论、命令面板彩蛋、完整主题系统。

## 第一版验收标准

- 创建带 `type:article` 的 Issue 后，可以生成文章型近况。
- 创建带 `type:moment` 的 Issue 后，可以生成瞬间型近况。
- `status:draft` 和 `status:hidden` 不发布。
- closed Issue 仍可展示。
- `/updates` 把文章和瞬间混排在同一条时间线里。
- `/articles/[slug]` 有稳定 URL。
- `/tags/react` 能展示带 `tag:react` 的内容。
- 空站部署已验证 `/home/` 子路径下资源和路由正常。
- 站点构建不依赖旧项目代码。
- 推送到 `main` 后自动部署到 GitHub Pages。

## 待决策问题

- closed Issue 是否永远允许展示，还是未来需要归档开关？
- slug 是否坚持默认 `issue-123`，还是允许标题型 slug 作为显式选择？
- 首页优先展示最新近况，还是展示精选内容？
- 瞬间是否需要隐私分级或归档机制？
- 标签是否需要白名单，还是完全自由增长？
- 是否引入 `signal:*` 或 `mood:*` 作为内容状态标签？
- RSS 是否只包含文章，还是也包含瞬间摘要？
- 是否保留旧终端风作为彩蛋，而不是主视觉？

## 容易遗漏的小细节

- GitHub API 返回的 Issues 里包含 Pull Requests，必须过滤。
- GitHub Issue 上传的图片没有天然尺寸信息，瞬间图片网格需要固定 `aspect-ratio` 占位。
- RSS 里最好优先放文章，瞬间可以后续单独做 feed，避免多图内容影响订阅体验。
- `CONTENT_SOURCE=live` 本地请求 GitHub API 可能遇到 rate limit，应预留 `GITHUB_TOKEN` 并保证 fixture 可离线开发。
- 标签 URL 不包含 `tag:` 前缀，避免冒号进入 URL。
- Issue title 对瞬间来说更像后台管理标题，正文才是前台主要内容。
- 仓库名是 `home` 时，GitHub Pages 的 base path 是 `/home/`。
- 内容模型越早稳定，后面的视觉迭代越自由。
