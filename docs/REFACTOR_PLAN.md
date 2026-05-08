> ⚠️ 已归档：本文档是 v1.0 重构期间的决策记录，所有决策已落地。当前功能状态见 `docs/ROADMAP.md`。

# 重构决策文档：GitHub Issues 驱动的个人公开时间线

## 结论

本次重构不迁移旧代码、不复用旧逻辑，也不继续修补旧终端 UI。

旧项目已归档到 `archive/terminal-v1/`，只作为历史备份。新项目从零开始，目标是做一个长期可维护、可持续发布内容的个人公开时间线。

核心判断：

- 站点不是传统博客系统，而是个人公开时间线。
- 文章和动态都属于“近况”，只是内容形态不同。
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
- 动态列表 `/moments`
- 动态详情 `/moments/[number]`
- 标签聚合 `/tags/[tag]`
- 404 页面 `src/pages/404.astro`
- fixture 数据源
- GitHub Issues live 数据源
- GitHub Pages 自动部署
- Issue 内容变更后的自动或手动重新构建
- 基础 SEO：description、Open Graph、Twitter Card、canonical URL

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

近况页是核心入口。用户进入 `/updates` 后，按时间线看到文章和动态混合出现：一会儿是一篇长文，一会儿是一组图片，一会儿是一段短想法。

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

样式策略：

- 第一版使用 Astro scoped styles + CSS variables。
- 全局设计 token 放在 `src/styles/global.css`。
- 不引入 Tailwind CSS，避免重构早期同时引入 UI 写法迁移成本。
- React islands 只消费全局 CSS variables，不自带独立主题系统。

第一版可选但不阻塞：

- Astro RSS
- sitemap
- rehype / remark 代码高亮

后续再考虑：

- Pagefind
- 图片尺寸构建期探测
- 更完整的图片预览
- 命令面板彩蛋

实现时可优先评估 Astro Content Layer API 来封装 Issues 数据源。如果它让 `getStaticPaths` 和数据加载更清晰，就采用；如果增加复杂度，第一版保持手写内容层。

文章阅读时间可使用 `reading-time` 或自定义函数。中文按约 300-400 字/分钟估算，第一版只要求展示合理，不追求精确。

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

API 拉取规则：

- 使用 GitHub REST API 拉取当前仓库 Issues。
- 请求参数使用 `state=all`、`per_page=100`。
- 构建时必须循环请求 `page=1,2,3...`，直到返回空数组或没有下一页。
- `fetchIssues.ts` 预留 `since` 参数，第一版仍默认全量构建。
- CI 中使用内置 `GITHUB_TOKEN` 提高 rate limit。
- API 请求失败时第一版直接构建失败，并区分错误类型：rate limit 耗尽（读取 `X-RateLimit-Remaining` 和 `X-RateLimit-Reset` 响应头，提示「请等到 XX:XX 再试」）vs API 故障。
- 每页拉取时打印实际返回条数，便于排查分页是否完整。

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
- 置顶内容在列表顶部展示，置顶最多展示 5 条，超出部分按正常时间线排序。
- 置顶组内仍按 `publishedAt desc` 排序。
- 非置顶组按 `publishedAt desc` 排序。
- `/updates` 和 `/moments` 使用 `publishedAt` 排序。
- `/updates` 必须把 `type:article` 和 `type:moment` 合并成同一个数组后排序。
- `/updates` 不按内容形态分区展示，不能先展示文章再展示动态。
- `/articles` 默认也使用 `publishedAt` 排序，后续可增加“最近更新”排序。
- `updatedAt` 只用于展示“最近编辑”信息，不影响近况时间线默认排序。

## 标签规则

标签分三类：内容形态、状态、主题。

### 内容形态标签

- `type:article`：文章型近况，适合长内容。
- `type:moment`：动态型近况，适合少文字、多图片。

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
- `/moments` 可以用主题标签只过滤动态。
- `/tags/[tag]` 的 URL 使用去掉 `tag:` 后的值，例如 `tag:react` 对应 `/tags/react`。

## Slug 策略

slug 是长期 URL，第一优先级是稳定，不是漂亮。

规则：

- 有 frontmatter `slug` 时优先使用。
- 没有 `slug` 时默认使用 `issue-123`。
- 标题只用于展示，不参与默认 slug。
- 构建时校验 slug 唯一。
- 修改 Issue 标题不能导致旧链接失效。
- 手动指定 slug 时校验字符白名单：只允许 `[a-z0-9-]`，包含非法字符时构建失败并提示合法格式。
- slug 冲突时错误信息需包含冲突的 Issue 编号，例如 `slug "my-post" is used by both #12 and #15`。

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

Body 解析容错：如果 Issue body 第一行不是 `---`，则整个 body 作为正文，不尝试解析 frontmatter。Body 中间出现的 `---`（Markdown 水平分割线）不能被误识别为 frontmatter 结束标记——判断依据是：只有 body 开头连续的 `---...---` 对才视为 frontmatter 区块。

Markdown 渲染安全：Astro 的 Markdown 渲染默认不输出原始 HTML（`allowDangerousHtml: false`），Issue body 中的 `<script>` 等标签会被自动转义，无需额外配置。

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
- frontmatter 日期字符串使用 `date-fns` 的 `parseISO` 解析，自动处理有无时区的情况。所有内部日期统一存为 ISO 8601 字符串（UTC），前端展示时按需格式化。
- `publishedAt` 缺省为 issue `created_at`，`created_at` 格式为 GitHub API 标准 ISO 8601（UTC）。
- `updatedAt` 使用 issue `updated_at`。

### 动态型近况

动态不强制 frontmatter。Issue body 就是内容，解析后 `text` 保留 Markdown 格式。

```md
今天路过一家很好看的小店。

![photo1](https://github.com/user-attachments/assets/example-1)
![photo2](https://github.com/user-attachments/assets/example-2)
```

解析规则：

- 提取正文中的图片，按出现顺序展示。
- 只移除 `![alt](url)` 图片节点，剩余内容作为 Markdown 文案。
- 纯图片无文字时，`text` 是空字符串，前端正常渲染。
- 正文中的链接、加粗、列表等 Markdown 保留，由前端渲染。
- 第一版只识别 Markdown 图片语法 `![alt](url)`，不识别裸图片 URL。
- Issue title 主要用于后台管理，前台不强制展示。
- 单图大图展示。
- 多图使用固定比例网格，避免加载时页面跳动。

## 数据模型

```ts
type UpdateKind = 'article' | 'moment';

type ContentStatus = 'draft' | 'hidden' | 'published' | 'pinned';

type ContentBase = {
  kind: UpdateKind;
  number: number;
  title: string;
  issueUrl: string;
  labels: string[];
  tags: string[];
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  pinned: boolean; // derived from status === 'pinned'
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
  }>;
};

type UpdateItem = ArticleUpdate | MomentUpdate;
```

字段语义：

- `labels` 保存 GitHub Issue 原始 label name 全量列表。
- `tags` 只保存解析后的主题标签值，去掉 `tag:` 前缀，例如 `['react', 'frontend']`。
- `status` 从 Issue 的 `status:*` 标签解析：`status:draft`、`status:hidden`、`status:pinned`，缺省为 `'published'`。
- `pinned` 从 `status === 'pinned'` 推导，不独立存储。

## 构建失败与警告策略

构建失败：

- 同一个 Issue 有多个 `type:*` 标签。
- slug 重复。
- 手动 slug 包含非法字符（只允许 `[a-z0-9-]`）。
- frontmatter 日期非法。
- `type:article` 没有正文。
- `cover` 声明了但 URL 格式非法，不能通过 `new URL()` 解析。只校验是否为有效的绝对 HTTP/HTTPS URL，不拒绝 protocol-relative URL。
- GitHub Issues API 请求失败。
- Zod schema 不通过。
- Issue body 解析时检测到 PR 混入（`pull_request` 字段非 null 且未被过滤），视为过滤逻辑失效，直接构建失败。

只警告：

- 没有 `description`，自动生成。
- 没有 `cover`。
- 没有 `tag:*`。
- frontmatter 有未知字段。
- `type:moment` 没有图片。
- `type:moment` body 为空且无图片时，追加警告「仅展示标题和元信息」。
- 图片 alt 文本缺失。
- 图片尺寸未知，需要前端使用固定 `aspect-ratio` 占位。

不在构建时探测远程图片可达性，避免 GitHub attachment 延迟、CDN 抖动等临时问题阻断发布。

## 信息架构

### 首页 `/`

首页不做传统简历页，也不复刻旧终端。

内容模块：

- Now 模块
- 当前状态
- 最新近况
- 长期关注
- 精选项目
- 联系入口

Now 模块第一版可以来自手写配置或 fixture 字段，不需要接入 Issues。

已知不一致：Now 模块不接入 Issues 意味着更新 Now 需要改代码并重新部署，与「GitHub Issues 是内容来源」的基调有裂痕。第一版接受这个不一致并记录为技术债，第二版考虑 `type:now` 的 Issue 类型或类似机制。建议包含：

- 现在在做什么
- 现在在读什么
- 现在在关注什么
- 最近一次更新

站点配置集中放在 `src/config.ts`，至少包含：

- 站点标题
- 站点描述
- 作者信息
- 社交链接
- Now 模块内容
- 默认分享图路径
- 默认 SEO 文案

SEO 组件和 `BaseLayout.astro` 从 `src/config.ts` 读取默认值。

### 近况 `/updates`

核心内容页。

- 按时间线混排文章和动态。
- 文章和动态是同一条流里的不同卡片形态，不是两个列表或两个分区。
- 支持全部、文章、动态筛选。
- 支持主题标签筛选。
- 置顶内容优先展示，但仍保留时间信息。

第一版页面展示策略：

- 内容量少时可以全量静态渲染。
- 代码结构预留分页参数，例如 `page`、`pageSize`。
- 默认每页建议 20 条。
- 第一版不做无限滚动。

### 文章 `/articles`

文章型近况的筛选视图。

- 文章列表。
- 主题标签筛选。
- 置顶文章。
- 默认按发布时间排序。
- 后续可增加最近更新排序。
- 默认每页建议 20 条，第一版可全量渲染但保留分页口子。

### 文章详情 `/articles/[slug]`

- 标题、描述、时间、标签。
- Markdown 正文。
- 代码高亮。
- 原始 Issue 链接。
- 返回近况时间线入口。

### 动态 `/moments`

动态型近况的筛选视图。

- 时间线。
- 图片优先。
- 少文字。
- 固定比例图片网格。
- 主题标签筛选。
- 默认每页建议 20 条，第一版可全量渲染但保留分页口子。

### 动态详情 `/moments/[number]`

每条动态必须有独立可引用的 URL。内容为标题、正文、图片网格、标签、发布时间、原始 Issue 链接。参考 article 详情页结构，但布局以图片为重。

### 标签 `/tags/[tag]`

同一个主题下混合展示文章和动态。

### 404 `/404`

第一版必须提供 `src/pages/404.astro`，避免 GitHub Pages 子路径下访问不存在页面时只显示默认 404。

## SEO 与分享

第一版页面需要生成基础 SEO 元信息。

全站：

- canonical URL。
- Open Graph 基础字段。
- Twitter Card 基础字段。

文章详情页：

- `<title>` 使用文章标题。
- `<meta name="description">` 使用 `description`。
- `og:title` 使用文章标题。
- `og:description` 使用 `description`。
- `og:image` 优先使用 `cover`。
- 没有 `cover` 时使用站点默认分享图。

近况、文章列表、动态和标签页：

- 使用页面级标题和描述。
- canonical URL 必须包含 `/home/` base path。

## 部署决策

第一版使用 GitHub 官方 Pages Actions，不继续沿用旧项目的第三方 `gh-pages` 分支部署方式。

原因：

- 权限模型更清晰。
- 不需要额外维护 `gh-pages` 分支。
- GitHub Pages 官方推荐路径更适合新 Astro 项目。

workflow 要求：

- 触发：push 到 `main`
- 触发：`workflow_dispatch` 手动运行
- 触发：`schedule` 定时运行，第一版建议每天一次
- 触发：`issues` 事件，至少包含 `opened`、`edited`、`labeled`、`unlabeled`、`closed`、`reopened`
- 权限：`contents: read`
- 权限：`issues: read`
- 权限：`pages: write`
- 权限：`id-token: write`
- 使用 `actions/configure-pages`
- 使用 `actions/upload-pages-artifact`
- 使用 `actions/deploy-pages`
- 构建命令：`npm ci`、`npm run build`
- 部署目录：`dist`
- workflow 中使用 `${{ secrets.GITHUB_TOKEN }}` 或默认 `github.token` 作为 `GITHUB_TOKEN`
- 使用 concurrency 避免频繁 Issue 编辑造成并行部署浪费：

```yaml
concurrency:
  group: pages-deploy
  cancel-in-progress: true
```

Issue 事件触发是 MVP 必须项，因为内容来源是 Issues。只监听 push 会导致新建或编辑内容后站点不更新。

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

fixture 格式必须模拟 GitHub REST API Issue 响应结构，避免 fixture 和 live 写两套解析逻辑。至少包含：

- `number`
- `title`
- `body`
- `html_url`
- `labels`
- `created_at`
- `updated_at`
- `closed_at`
- `state`
- `pull_request`

`parseIssue.ts` 对 fixture 和 live 使用同一套输入结构。

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
  config.ts
  styles/
    global.css
  content/
    fixtures/
      issues.json
  layouts/
    BaseLayout.astro
  components/
    ArticleCard.astro
    MomentCard.astro
    ImageGrid.astro
    Seo.astro
    TagFilter.tsx
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
    404.astro
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
7. 实现 `fetchIssues.ts` 分页逻辑和 API 失败报错，先用 fixture 测试解析链路。
8. 用 fixture 数据完成首页、近况、文章、文章详情、动态、标签页、404。
9. 切换 `CONTENT_SOURCE=live`，验证真实 GitHub Issues API。
10. 增加 Issues 事件触发、手动触发和定时构建。
11. 增加基础 SEO、sitemap、代码高亮。
12. 增加 RSS，第一版只包含文章。
13. 优化图片布局和移动端阅读体验。
14. 后续再考虑搜索、评论、命令面板彩蛋、完整主题系统。

## 第一版验收标准

- 创建带 `type:article` 的 Issue 后，可以生成文章型近况。
- 创建带 `type:moment` 的 Issue 后，可以生成动态型近况。
- `status:draft` 和 `status:hidden` 不发布。
- closed Issue 仍可展示。
- `/updates` 把文章和动态混排在同一条时间线里。
- `/articles/[slug]` 有稳定 URL。
- `/tags/react` 能展示带 `tag:react` 的内容。
- Issues 新建、编辑、打标签后能触发重新构建。
- GitHub Issues API 分页拉取超过 100 条内容时仍完整。
- 文章详情页有 description、Open Graph、Twitter Card 和 canonical URL。
- 不存在的路径有自定义 404 页面。
- 空站部署已验证 `/home/` 子路径下资源和路由正常。
- 站点构建不依赖旧项目代码。
- 推送到 `main` 后自动部署到 GitHub Pages。
- `CONTENT_SOURCE=fixture` 和 `CONTENT_SOURCE=live` 解析同一份 Issue 数据输出结果一致。
- 首页 Largest Contentful Paint < 2s（3G 网络模拟）。
- 动态图片网格在移动端（375px 视口）正常展示，无横向溢出或布局错位。

## 待决策问题

- closed Issue 是否永远允许展示，还是未来需要归档开关？
- slug 是否坚持默认 `issue-123`，还是允许标题型 slug 作为显式选择？
- 首页优先展示最新近况，还是展示精选内容？
- 动态是否需要隐私分级或归档机制？
- 标签是否需要白名单，还是完全自由增长？
- 是否引入 `signal:*` 或 `mood:*` 作为内容状态标签？
- 是否保留旧终端风作为彩蛋，而不是主视觉？

## 容易遗漏的小细节

- GitHub API 返回的 Issues 里包含 Pull Requests，必须过滤。
- GitHub REST API 单页最多 100 条 Issues，必须做分页拉取。
- 只监听 push 不会响应 Issue 内容变化，必须加 `issues` 事件、手动触发或定时构建。
- GitHub Issue 上传的图片没有天然尺寸信息，动态图片网格需要固定 `aspect-ratio` 占位。
- RSS 里最好优先放文章，动态可以后续单独做 feed，避免多图内容影响订阅体验。
- 第一版 RSS 只包含文章，动态不进默认 RSS。
- `CONTENT_SOURCE=live` 本地请求 GitHub API 可能遇到 rate limit，应预留 `GITHUB_TOKEN` 并保证 fixture 可离线开发。
- 标签 URL 不包含 `tag:` 前缀，避免冒号进入 URL。
- 图片缺失 alt 时前端渲染 `alt=""`，不要省略 alt 属性。
- Issue title 对动态来说更像后台管理标题，正文才是前台主要内容。
- 仓库名是 `home` 时，GitHub Pages 的 base path 是 `/home/`。
- 内容模型越早稳定，后面的视觉迭代越自由。
- `astro dev` 不应用 `base` 路径前缀，本地开发使用根路径 `/`，部署后路径前缀是 `/home/`，开发与部署时的路径差异在 README 中说明。
- fixture JSON 的 `labels` 字段必须模拟 GitHub API 完整结构（`Array<{ name: string; color: string }>`），不能简化为字符串数组。`pull_request` 字段必须包含（纯 Issue 为 `null`），否则 filter 逻辑在 fixture 模式下永远测不到。
- `concurrency: cancel-in-progress` 的已知限制：连续 Issue 编辑事件可能取消最后一个 build，若下一次触发依赖定时任务（每天一次），内容最长有 24 小时延迟。第一版通过 `workflow_dispatch` 手动触发作为补救手段。
