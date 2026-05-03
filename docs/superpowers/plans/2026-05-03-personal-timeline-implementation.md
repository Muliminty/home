# 个人公开时间线 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零构建基于 Astro + GitHub Issues 的极简日志风个人公开时间线站点

**Architecture:** 构建时从 GitHub REST API 拉取 Issues 数据，经 Zod 校验 + 标签解析后生成 8 个静态页面。fixture/live 双数据源模式，一套解析链路。GitHub Actions 响应 Issues 事件自动部署到 GitHub Pages。

**Tech Stack:** Astro 5 + TypeScript + React 19 + GitHub REST API + GitHub Actions + GitHub Pages + Zod + date-fns

**Source references:**
- 技术方案: `REFACTOR_PLAN.md`
- UI 设计: `docs/superpowers/specs/2026-05-03-ui-design.md`
- 设计稿: `design-options/refined-home.html`, `refined-article.html`, `refined-moment.html`

---

### Task 1: 项目骨架

**Files:**
- 通过 `npm create astro@latest` 生成，然后修改配置

- [ ] **Step 1: 初始化 Astro 项目**

```bash
cd /Users/muliminty/project/home
npm create astro@latest . -- --template basics --typescript strict --skip-houston
```

选择：TypeScript strict、安装依赖、初始化 git（跳过，已有）

- [ ] **Step 2: 添加 React 集成**

```bash
npx astro add react
```

- [ ] **Step 3: 安装运行时依赖**

```bash
npm install zod date-fns
npm install -D @types/node
```

- [ ] **Step 4: 修改 `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

- [ ] **Step 5: 修改 `astro.config.ts`**

```ts
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://muliminty.github.io',
  base: '/home/',
  output: 'static',
  integrations: [react()],
});
```

- [ ] **Step 6: 创建目录结构**

```bash
mkdir -p src/{styles,layouts,components,lib/{github,content},pages/{updates,articles,moments,tags}}
mkdir -p src/content/fixtures
```

- [ ] **Step 7: 验证空白站能跑**

```bash
npm run dev
```

打开 `http://localhost:4321/home/` 确认 Astro 默认页面渲染正常。

- [ ] **Step 8: 提交**

```bash
git add -A && git commit -m "feat: scaffold Astro + React + TypeScript project"
```

---

### Task 2: 设计 Token + 全局样式

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro`（如果 Task 1 已生成）

- [ ] **Step 1: 创建 `src/styles/global.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:400,500,600&family=JetBrains+Mono:400,500&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

:root {
  /* Color */
  --bg: #fff;
  --text: #1d1d1f;
  --text-muted: #86868b;
  --border: #f0f0f0;
  --accent: #0071e3;
  --tag-bg: #f5f5f7;

  /* Typography */
  --font-sans: 'Inter', 'Noto Sans SC', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
}

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Utility */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 16px 80px;
}

.container-wide {
  max-width: 920px;
  margin: 0 auto;
  padding: 48px 16px 80px;
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 40px;
  align-items: start;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 20px;
}

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 960px) {
  .container-wide { grid-template-columns: 1fr; max-width: 600px; gap: 0; }
}

@media (max-width: 600px) {
  .container { padding: 24px 16px 60px; }
  body { font-size: 14px; }
}
```

- [ ] **Step 2: 修改 `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

export interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const { title, description, ogImage } = Astro.props;
const siteTitle = '漫游笔记';
const fullTitle = title === siteTitle ? title : `${title} — ${siteTitle}`;
---

<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{fullTitle}</title>
  <meta name="description" content={description || '一个前端开发者的公开时间线'} />
  <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site).href} />

  <!-- Open Graph -->
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description || '一个前端开发者的公开时间线'} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={new URL(Astro.url.pathname, Astro.site).href} />
  {ogImage && <meta property="og:image" content={ogImage} />}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description || '一个前端开发者的公开时间线'} />
  {ogImage && <meta name="twitter:image" content={ogImage} />}
</head>
<body>
  <slot />
</body>
</html>
```

- [ ] **Step 3: 创建 `src/config.ts`**

```ts
export const siteConfig = {
  title: '漫游笔记',
  description: '一个前端开发者的公开时间线',
  author: 'muliminty',
  github: 'https://github.com/muliminty',
  email: 'muliminty@example.com',
  defaultOgImage: '/home/default-og.png',
  now: {
    doing: '用 Astro 重建个人站点，探索 GitHub Issues 作为 CMS',
    reading: '《建筑永恒之道》',
    listening: 'Nujabes · Modal Soul',
  },
  projects: [
    { name: 'home', url: 'https://github.com/muliminty/home', description: '个人公开时间线站点' },
    { name: 'dotfiles', url: 'https://github.com/muliminty/dotfiles', description: 'macOS 开发环境配置' },
  ],
};
```

- [ ] **Step 4: 验证**

```bash
npm run dev
```

确认全局样式加载、CSS 变量生效。

- [ ] **Step 5: 提交**

```bash
git add -A && git commit -m "feat: add design tokens, global styles, and base layout"
```

---

### Task 3: 数据模型 + Zod Schema

**Files:**
- Create: `src/lib/content/schema.ts`
- Create: `src/lib/content/types.ts`

- [ ] **Step 1: 创建 `src/lib/content/types.ts`**

```ts
export type UpdateKind = 'article' | 'moment';
export type ContentStatus = 'draft' | 'hidden' | 'published' | 'pinned';

export interface ContentBase {
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
  pinned: boolean;
}

export interface ArticleUpdate extends ContentBase {
  kind: 'article';
  slug: string;
  description: string;
  cover?: string;
  body: string;
  readingTime: number;
}

export interface MomentUpdate extends ContentBase {
  kind: 'moment';
  text: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
}

export type UpdateItem = ArticleUpdate | MomentUpdate;

export interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  html_url: string;
  labels: Array<{ name: string; color: string }>;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  state: string;
  pull_request?: { url: string } | null;
}
```

- [ ] **Step 2: 创建 `src/lib/content/schema.ts`**

```ts
import { z } from 'zod';

export const issueInputSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string().nullable().default(''),
  html_url: z.string(),
  labels: z.array(z.object({ name: z.string(), color: z.string() })).default([]),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string().nullable(),
  state: z.string(),
  pull_request: z.object({ url: z.string() }).optional().nullable(),
});

export type IssueInput = z.infer<typeof issueInputSchema>;

export const articleFrontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  cover: z.string().url().optional(),
  publishedAt: z.string().optional(),
});

export const updateItemSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('article'),
    number: z.number(),
    title: z.string(),
    issueUrl: z.string(),
    labels: z.array(z.string()),
    tags: z.array(z.string()),
    status: z.enum(['draft', 'hidden', 'published', 'pinned']),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    pinned: z.boolean(),
    slug: z.string(),
    description: z.string(),
    cover: z.string().optional(),
    body: z.string(),
    readingTime: z.number(),
  }),
  z.object({
    kind: z.literal('moment'),
    number: z.number(),
    title: z.string(),
    issueUrl: z.string(),
    labels: z.array(z.string()),
    tags: z.array(z.string()),
    status: z.enum(['draft', 'hidden', 'published', 'pinned']),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    pinned: z.boolean(),
    text: z.string(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })),
  }),
]);
```

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add content types and Zod schemas"
```

---

### Task 4: 标签解析 + Slug 引擎

**Files:**
- Create: `src/lib/content/parseIssue.ts`
- Create: `src/lib/content/slug.ts`

- [ ] **Step 1: 创建 `src/lib/content/parseIssue.ts`**

```ts
import type { GitHubIssue, ContentStatus, UpdateKind } from './types';

interface ParsedLabels {
  kind: UpdateKind | null;
  status: ContentStatus;
  tags: string[];
  typeError: boolean;
}

export function parseLabels(labels: Array<{ name: string }>): ParsedLabels {
  const result: ParsedLabels = {
    kind: null,
    status: 'published',
    tags: [],
    typeError: false,
  };

  for (const label of labels) {
    const name = label.name;

    if (name === 'type:article') {
      if (result.kind !== null) result.typeError = true;
      result.kind = 'article';
    } else if (name === 'type:moment') {
      if (result.kind !== null) result.typeError = true;
      result.kind = 'moment';
    } else if (name === 'status:draft') {
      result.status = 'draft';
    } else if (name === 'status:hidden') {
      result.status = 'hidden';
    } else if (name === 'status:pinned') {
      result.status = 'pinned';
    } else if (name.startsWith('tag:')) {
      result.tags.push(name.slice(4));
    }
  }

  return result;
}

export function shouldSkip(kind: UpdateKind | null, status: ContentStatus): boolean {
  if (kind === null) return true;
  if (status === 'draft' || status === 'hidden') return true;
  return false;
}

export function isPullRequest(issue: { pull_request?: { url: string } | null }): boolean {
  return issue.pull_request != null;
}
```

- [ ] **Step 2: 创建 `src/lib/content/slug.ts`**

```ts
const SLUG_REGEX = /^[a-z0-9-]+$/;

export function resolveSlug(frontmatterSlug: string | undefined, issueNumber: number): { slug: string; error: string | null } {
  if (frontmatterSlug) {
    if (!SLUG_REGEX.test(frontmatterSlug)) {
      return { slug: frontmatterSlug, error: `slug "${frontmatterSlug}" contains invalid characters. Only [a-z0-9-] allowed.` };
    }
    return { slug: frontmatterSlug, error: null };
  }
  return { slug: `issue-${issueNumber}`, error: null };
}

export function checkSlugUnique(items: Array<{ slug: string; number: number }>): string | null {
  const seen = new Map<string, number>();
  for (const item of items) {
    if (seen.has(item.slug)) {
      return `slug "${item.slug}" is used by both #${seen.get(item.slug)} and #${item.number}`;
    }
    seen.set(item.slug, item.number);
  }
  return null;
}
```

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add label parser and slug engine"
```

---

### Task 5: Frontmatter 解析 + 正文处理

**Files:**
- Create: `src/lib/content/parseFrontmatter.ts`
- Create: `src/lib/content/extractImages.ts`

- [ ] **Step 1: 创建 `src/lib/content/parseFrontmatter.ts`**

```ts
import { format, parseISO } from 'date-fns';

const FM_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

interface ParsedContent {
  frontmatter: Record<string, string>;
  body: string;
  unknownFields: string[];
}

const KNOWN_FIELDS = ['slug', 'description', 'cover', 'publishedAt'];

export function parseFrontmatter(raw: string | null): ParsedContent {
  const text = raw || '';
  const match = text.match(FM_REGEX);

  // Only parse frontmatter if body STARTS with ---
  if (!match) {
    return { frontmatter: {}, body: text, unknownFields: [] };
  }

  const fmBlock = match[1];
  const body = match[2].trimStart();
  const frontmatter: Record<string, string> = {};
  const unknownFields: string[] = [];

  for (const line of fmBlock.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (KNOWN_FIELDS.includes(key)) {
      frontmatter[key] = value;
    } else if (key) {
      unknownFields.push(key);
    }
  }

  return { frontmatter, body, unknownFields };
}

export function resolvePublishedAt(
  fmPublishedAt: string | undefined,
  createdAt: string,
): { publishedAt: string; error: string | null } {
  try {
    const date = fmPublishedAt ? parseISO(fmPublishedAt) : parseISO(createdAt);
    if (isNaN(date.getTime())) {
      return { publishedAt: '', error: `Invalid date: ${fmPublishedAt || createdAt}` };
    }
    return { publishedAt: format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'"), error: null };
  } catch {
    return { publishedAt: '', error: `Cannot parse date: ${fmPublishedAt || createdAt}` };
  }
}
```

- [ ] **Step 2: 创建 `src/lib/content/extractImages.ts`**

```ts
const IMG_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

interface ExtractedImage {
  src: string;
  alt: string;
}

export function extractImages(markdown: string): { images: ExtractedImage[]; text: string } {
  const images: ExtractedImage[] = [];
  const text = markdown.replace(IMG_REGEX, (_match, alt, src) => {
    images.push({ src, alt: alt || '' });
    return '';
  });
  return { images, text: text.trim() };
}
```

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add frontmatter parser and image extractor"
```

---

### Task 6: Article + Moment 解析器

**Files:**
- Create: `src/lib/content/parseArticle.ts`
- Create: `src/lib/content/parseMoment.ts`

- [ ] **Step 1: 创建 `src/lib/content/parseArticle.ts`**

```ts
import type { GitHubIssue, ArticleUpdate } from './types';
import { parseLabels, shouldSkip, isPullRequest } from './parseIssue';
import { parseFrontmatter, resolvePublishedAt } from './parseFrontmatter';
import { resolveSlug } from './slug';

export interface ParseArticleResult {
  article?: ArticleUpdate;
  skipped: boolean;
  error: string | null;
  warnings: string[];
}

export function parseArticle(issue: GitHubIssue): ParseArticleResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (isPullRequest(issue)) {
    return { skipped: true, error: null, warnings };
  }

  const labels = parseLabels(issue.labels);

  if (labels.typeError) {
    return { skipped: false, error: `Issue #${issue.number} has multiple type:* labels`, warnings };
  }

  if (shouldSkip(labels.kind, labels.status)) {
    return { skipped: true, error: null, warnings };
  }

  if (labels.kind !== 'article') {
    return { skipped: true, error: null, warnings };
  }

  const { frontmatter, body, unknownFields } = parseFrontmatter(issue.body);

  for (const f of unknownFields) {
    warnings.push(`Unknown frontmatter field "${f}" in Issue #${issue.number}`);
  }

  const { slug, error: slugError } = resolveSlug(frontmatter.slug, issue.number);
  if (slugError) errors.push(slugError);

  if (!body.trim()) {
    errors.push(`Issue #${issue.number} (type:article) has no body`);
  }

  const { publishedAt, error: dateError } = resolvePublishedAt(frontmatter.publishedAt, issue.created_at);
  if (dateError) errors.push(dateError);

  // cover URL validation
  if (frontmatter.cover) {
    try {
      const u = new URL(frontmatter.cover);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') {
        errors.push(`cover URL in #${issue.number} must be http or https`);
      }
    } catch {
      errors.push(`Invalid cover URL in #${issue.number}: ${frontmatter.cover}`);
    }
  }

  if (errors.length > 0) {
    return { skipped: false, error: errors.join('; '), warnings };
  }

  if (!frontmatter.description) {
    warnings.push(`Issue #${issue.number} has no description`);
  }
  if (!frontmatter.cover) {
    warnings.push(`Issue #${issue.number} has no cover`);
  }
  if (labels.tags.length === 0) {
    warnings.push(`Issue #${issue.number} has no tag:* labels`);
  }

  const description = frontmatter.description || body.slice(0, 160).replace(/\n/g, ' ').trim();
  const wordCount = body.replace(/\s/g, '').length;
  const readingTime = Math.max(1, Math.round(wordCount / 350));

  const article: ArticleUpdate = {
    kind: 'article',
    number: issue.number,
    title: issue.title,
    issueUrl: issue.html_url,
    labels: issue.labels.map(l => l.name),
    tags: labels.tags,
    status: labels.status,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    publishedAt,
    pinned: labels.status === 'pinned',
    slug,
    description,
    cover: frontmatter.cover,
    body,
    readingTime,
  };

  return { article, skipped: false, error: null, warnings };
}
```

- [ ] **Step 2: 创建 `src/lib/content/parseMoment.ts`**

```ts
import type { GitHubIssue, MomentUpdate } from './types';
import { parseLabels, shouldSkip, isPullRequest } from './parseIssue';
import { extractImages } from './extractImages';
import { resolvePublishedAt } from './parseFrontmatter';

export interface ParseMomentResult {
  moment?: MomentUpdate;
  skipped: boolean;
  error: string | null;
  warnings: string[];
}

export function parseMoment(issue: GitHubIssue): ParseMomentResult {
  const warnings: string[] = [];

  if (isPullRequest(issue)) {
    return { skipped: true, error: null, warnings };
  }

  const labels = parseLabels(issue.labels);

  if (labels.typeError) {
    return { skipped: false, error: `Issue #${issue.number} has multiple type:* labels`, warnings };
  }

  if (shouldSkip(labels.kind, labels.status)) {
    return { skipped: true, error: null, warnings };
  }

  if (labels.kind !== 'moment') {
    return { skipped: true, error: null, warnings };
  }

  const body = issue.body || '';
  const { images, text } = extractImages(body);

  if (images.length === 0) {
    warnings.push(`type:moment #${issue.number} has no images`);
  }
  if (body.trim() === '' && images.length === 0) {
    warnings.push(`type:moment #${issue.number} has empty body and no images`);
  }
  if (labels.tags.length === 0) {
    warnings.push(`Issue #${issue.number} has no tag:* labels`);
  }

  const { publishedAt, error: dateError } = resolvePublishedAt(undefined, issue.created_at);
  if (dateError) {
    return { skipped: false, error: dateError, warnings };
  }

  const moment: MomentUpdate = {
    kind: 'moment',
    number: issue.number,
    title: issue.title,
    issueUrl: issue.html_url,
    labels: issue.labels.map(l => l.name),
    tags: labels.tags,
    status: labels.status,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    publishedAt,
    pinned: labels.status === 'pinned',
    text,
    images: images.map(img => ({ src: img.src, alt: img.alt || '' })),
  };

  return { moment, skipped: false, error: null, warnings };
}
```

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add article and moment parsers"
```

---

### Task 7: GitHub Issues API 拉取层

**Files:**
- Create: `src/lib/github/fetchIssues.ts`

- [ ] **Step 1: 创建 `src/lib/github/fetchIssues.ts`**

```ts
import type { GitHubIssue } from '../content/types';

const API_BASE = 'https://api.github.com';

interface FetchOptions {
  owner: string;
  repo: string;
  token?: string;
}

export async function fetchAllIssues(options: FetchOptions): Promise<GitHubIssue[]> {
  const { owner, repo, token } = options;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'timeline-builder',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const allIssues: GitHubIssue[] = [];
  let page = 1;

  while (true) {
    const url = `${API_BASE}/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const remaining = res.headers.get('X-RateLimit-Remaining');
      const reset = res.headers.get('X-RateLimit-Reset');
      if (res.status === 403 && remaining === '0' && reset) {
        const resetDate = new Date(Number(reset) * 1000);
        throw new Error(`GitHub API rate limit exhausted. Resets at ${resetDate.toLocaleString()}`);
      }
      throw new Error(`GitHub API request failed: ${res.status} ${res.statusText} (page ${page})`);
    }

    const issues: GitHubIssue[] = await res.json();
    if (issues.length === 0) break;

    allIssues.push(...issues);
    console.log(`  page ${page}: ${issues.length} issues (total: ${allIssues.length})`);
    page++;
  }

  return allIssues;
}
```

- [ ] **Step 2: 提交**

```bash
git add -A && git commit -m "feat: add GitHub Issues API fetcher with pagination and rate limit handling"
```

---

### Task 8: 内容加载器（fixture + live 双模式）

**Files:**
- Create: `src/lib/content/loadContent.ts`
- Create: `src/content/fixtures/issues.json`

- [ ] **Step 1: 创建 `src/content/fixtures/issues.json`**

```json
[
  {
    "number": 1,
    "title": "用 GitHub Issues 搭建个人公开时间线",
    "body": "---\nslug: github-issues-timeline\ndescription: 不需要 CMS，不需要数据库。用 Issues 的 label 体系做内容分类。\ncover: https://github.com/user-attachments/assets/example\n---\n\n我一直想要一个完全属于自己的内容空间。\n\n## 为什么是 GitHub Issues\n\nGitHub Issues 有几个特性让它天然适合做内容管理。\n\n## 技术选型\n\n数据在 GitHub，展示用 Astro。",
    "html_url": "https://github.com/muliminty/home/issues/1",
    "labels": [
      { "name": "type:article", "color": "blue" },
      { "name": "status:pinned", "color": "yellow" },
      { "name": "tag:frontend", "color": "green" },
      { "name": "tag:astro", "color": "green" },
      { "name": "tag:project", "color": "green" }
    ],
    "created_at": "2026-05-02T12:00:00Z",
    "updated_at": "2026-05-02T12:00:00Z",
    "closed_at": null,
    "state": "open",
    "pull_request": null
  },
  {
    "number": 2,
    "title": "路过一家蓝色小店",
    "body": "今天路过一家很好看的小店。门是蓝色的，门口摆了一排多肉。🌿\n\n![小店门面](https://github.com/user-attachments/assets/example-1)",
    "html_url": "https://github.com/muliminty/home/issues/2",
    "labels": [
      { "name": "type:moment", "color": "green" },
      { "name": "tag:life", "color": "teal" },
      { "name": "tag:photo", "color": "teal" }
    ],
    "created_at": "2026-04-28T08:00:00Z",
    "updated_at": "2026-04-28T08:00:00Z",
    "closed_at": null,
    "state": "open",
    "pull_request": null
  },
  {
    "number": 3,
    "title": "前端性能优化三个维度",
    "body": "---\nslug: perf-three-dimensions\ndescription: 字体加载、关键 CSS 内联、图片 decoding 属性\n---\n\n不只是 bundle size 和 lazy load。\n\n## 字体加载策略\n\n## 关键 CSS 内联\n\n## 图片 decoding 属性",
    "html_url": "https://github.com/muliminty/home/issues/3",
    "labels": [
      { "name": "type:article", "color": "blue" },
      { "name": "tag:frontend", "color": "green" },
      { "name": "tag:performance", "color": "green" }
    ],
    "created_at": "2026-04-20T10:00:00Z",
    "updated_at": "2026-04-22T14:00:00Z",
    "closed_at": null,
    "state": "open",
    "pull_request": null
  }
]
```

- [ ] **Step 2: 创建 `src/lib/content/loadContent.ts`**

```ts
import type { UpdateItem, GitHubIssue } from './types';
import type { ParseArticleResult } from './parseArticle';
import type { ParseMomentResult } from './parseMoment';

const CONTENT_SOURCE = process.env.CONTENT_SOURCE || 'fixture';
const GH_TOKEN = process.env.GH_TOKEN;
const GH_OWNER = 'muliminty';
const GH_REPO = 'home';

export async function loadAllContent(): Promise<{
  items: UpdateItem[];
  warnings: string[];
  errors: string[];
}> {
  let issues: GitHubIssue[];

  if (CONTENT_SOURCE === 'live' && GH_TOKEN) {
    const { fetchAllIssues } = await import('../github/fetchIssues');
    issues = await fetchAllIssues({ owner: GH_OWNER, repo: GH_REPO, token: GH_TOKEN });
  } else {
    const fixtureModule = await import('../../content/fixtures/issues.json');
    issues = fixtureModule.default as GitHubIssue[];
  }

  const items: UpdateItem[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  const { parseArticle } = await import('./parseArticle');
  const { parseMoment } = await import('./parseMoment');
  const { checkSlugUnique } = await import('./slug');

  for (const issue of issues) {
    const labels = issue.labels.map(l => l.name);
    const isArticle = labels.some(l => l === 'type:article');
    const isMoment = labels.some(l => l === 'type:moment');

    if (isArticle) {
      const result: ParseArticleResult = parseArticle(issue);
      if (result.error) errors.push(result.error);
      else if (result.article) items.push(result.article);
      warnings.push(...result.warnings);
    }

    if (isMoment) {
      const result: ParseMomentResult = parseMoment(issue);
      if (result.error) errors.push(result.error);
      else if (result.moment) items.push(result.moment);
      warnings.push(...result.warnings);
    }
  }

  // Slug uniqueness check
  const articles = items.filter(i => i.kind === 'article') as Array<{ slug: string; number: number }>;
  const slugError = checkSlugUnique(articles);
  if (slugError) errors.push(slugError);

  // Sort by publishedAt desc (pinned first)
  items.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });

  return { items, warnings, errors };
}
```

- [ ] **Step 3: 验证**

```bash
CONTENT_SOURCE=fixture npm run dev
```

构建成功，无报错。

- [ ] **Step 4: 提交**

```bash
git add -A && git commit -m "feat: add content loader with fixture/live dual mode"
```

---

### Task 9: 公共组件

**Files:**
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/Seo.astro`

- [ ] **Step 1: 创建 `src/components/SiteHeader.astro`**

```astro
---
import { siteConfig } from '../config';

const currentPath = Astro.url.pathname.replace(/\/$/, '');
const navItems = [
  { href: '/', label: '首页', match: currentPath === '/home' || currentPath === '/home/' },
  { href: '/updates', label: '近况', match: currentPath.startsWith('/home/updates') },
  { href: '/articles', label: '文章', match: currentPath.startsWith('/home/articles') },
  { href: '/moments', label: '动态', match: currentPath.startsWith('/home/moments') },
];
---

<header class="site-header">
  <h1 class="site-title">{siteConfig.title}</h1>
  <p class="site-desc">{siteConfig.description}</p>
  <nav class="nav">
    {navItems.map(item => (
      <a href={item.href} class:list={[{ active: item.match }]}>{item.label}</a>
    ))}
  </nav>
</header>

<style>
  .site-header { margin-bottom: 48px; }
  .site-title { font-size: 18px; font-weight: 600; }
  .site-desc { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
  .nav { display: flex; gap: 20px; margin-top: 16px; }
  .nav a { font-size: 13px; color: var(--text-muted); text-decoration: none; transition: color 0.15s; }
  .nav a:hover, .nav a.active { color: var(--text); }
</style>
```

- [ ] **Step 2: 创建 `src/components/Seo.astro`**（用于详情页覆写 meta）

```astro
---
export interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl: string;
}

const { title, description, ogImage, canonicalUrl } = Astro.props;
---

<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
{ogImage && <meta property="og:image" content={ogImage} />}
{ogImage && <meta name="twitter:image" content={ogImage} />}
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<link rel="canonical" href={canonicalUrl} />
```

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add SiteHeader and Seo components"
```

---

### Task 10: 内容卡片组件

**Files:**
- Create: `src/components/ArticleCard.astro`
- Create: `src/components/MomentCard.astro`
- Create: `src/components/UpdateItem.astro`

- [ ] **Step 1: 创建 `src/components/ArticleCard.astro`**

```astro
---
import type { ArticleUpdate } from '../lib/content/types';

interface Props {
  article: ArticleUpdate;
  showPinned?: boolean;
}

const { article, showPinned = false } = Astro.props;
---

<article class="article-card" class:list={{ pinned: showPinned && article.pinned }}>
  <div class="time">{article.publishedAt.slice(0, 10)}</div>
  <h3><a href={`/articles/${article.slug}`}>{article.title}</a></h3>
  <p class="desc">{article.description}</p>
  <div class="tags">
    {article.tags.map(tag => <a href={`/tags/${tag}`} class="tag">#{tag}</a>)}
  </div>
</article>

<style>
  .article-card { margin-bottom: 24px; }
  .article-card.pinned { border-left: 2px solid var(--accent); padding-left: 12px; }
  .time { font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 4px; }
  h3 { font-size: 15px; font-weight: 600; line-height: 1.5; margin-bottom: 2px; }
  h3 a { color: var(--text); text-decoration: none; }
  h3 a:hover { color: var(--accent); }
  .desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
  .tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px; }
  .tag { font-size: 11px; color: var(--accent); text-decoration: none; }
  .tag:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: 创建 `src/components/MomentCard.astro`**

```astro
---
import type { MomentUpdate } from '../lib/content/types';

interface Props {
  moment: MomentUpdate;
}

const { moment } = Astro.props;
---

<div class="moment-card">
  <div class="time">{moment.publishedAt.slice(0, 10)}</div>
  <div class="body">{moment.text}</div>
  {moment.images.length > 0 && (
    <div class="imgs">
      {moment.images.slice(0, 4).map(img => (
        <div class="thumb" style={`background-image: url(${img.src})`} role="img" aria-label={img.alt || ''}></div>
      ))}
    </div>
  )}
</div>

<style>
  .moment-card { margin-bottom: 24px; }
  .time { font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 6px; }
  .body { font-size: 14px; line-height: 1.7; }
  .imgs { display: flex; gap: 4px; margin-top: 8px; overflow-x: auto; }
  .thumb {
    width: 80px; height: 80px; flex-shrink: 0;
    background: #f5f5f7 no-repeat center/cover;
    border-radius: 6px;
  }
</style>
```

- [ ] **Step 3: 创建 `src/components/UpdateItem.astro`**（根据 kind 分派）

```astro
---
import type { UpdateItem } from '../lib/content/types';
import ArticleCard from './ArticleCard.astro';
import MomentCard from './MomentCard.astro';

interface Props {
  item: UpdateItem;
}

const { item } = Astro.props;
---

{item.kind === 'article' ? <ArticleCard article={item} showPinned /> : <MomentCard moment={item} />}
```

- [ ] **Step 4: 提交**

```bash
git add -A && git commit -m "feat: add content card components"
```

---

### Task 11: 首页

**Files:**
- Create: `src/components/NowModule.astro`
- Create: `src/components/GitHubHeatmap.astro`
- Modify/Overwrite: `src/pages/index.astro`

- [ ] **Step 1: 创建 `src/components/NowModule.astro`**

```astro
---
import { siteConfig } from '../config';
---

<section class="now-section">
  <div class="now-label">Now</div>
  <div class="now-item"><span class="label">做</span>{siteConfig.now.doing}</div>
  <div class="now-item"><span class="label">读</span>{siteConfig.now.reading}</div>
  <div class="now-item"><span class="label">听</span>{siteConfig.now.listening}</div>
</section>

<style>
  .now-section { margin-bottom: 48px; padding: 20px; background: #fafafa; border-radius: 8px; }
  .now-label { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px; }
  .now-item { font-size: 13px; color: var(--text-muted); margin-bottom: 6px; display: flex; gap: 8px; }
  .now-item:last-child { margin-bottom: 0; }
  .now-item .label { color: var(--text); font-weight: 500; min-width: 20px; }
</style>
```

- [ ] **Step 2: 创建 `src/components/GitHubHeatmap.astro`**（静态渲染，失败降级）

```astro
---
const username = 'muliminty';
let heatmapHtml = '';
let totalContribs = 0;
let error = false;

try {
  const token = import.meta.env.GH_TOKEN;
  if (token) {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar { totalContributions weeks { contributionDays { contributionCount date color } } }
          }
        }
      }`;

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (res.ok) {
      const json = await res.json();
      const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
      if (calendar) {
        totalContribs = calendar.totalContributions;
        const weeks = calendar.weeks.slice(-26); // last 26 weeks

        heatmapHtml = '<div class="heatmap-grid">';
        for (const week of weeks) {
          heatmapHtml += '<div class="heatmap-week">';
          for (const day of week.contributionDays) {
            let level = 0;
            const c = day.contributionCount;
            if (c > 0) level = 1;
            if (c > 3) level = 2;
            if (c > 7) level = 3;
            if (c > 12) level = 4;
            heatmapHtml += `<div class="heatmap-day l${level}" title="${day.date}: ${c} contributions"></div>`;
          }
          heatmapHtml += '</div>';
        }
        heatmapHtml += '</div>';
      }
    }
  }
} catch {
  error = true;
}
---

<section class="heatmap-section">
  <div class="section-title">Contributions</div>
  <div class="heatmap-container">
    <div class="heatmap-header">
      <span class="heatmap-title">GitHub 活跃度</span>
      <a class="heatmap-link" href={`https://github.com/${username}`} target="_blank">@{username} &rarr;</a>
    </div>
    {error || !heatmapHtml ? (
      <p class="heatmap-fallback">GitHub 活跃数据暂不可用</p>
    ) : (
      <Fragment>
        {@html heatmapHtml}
        <div class="heatmap-total">{totalContribs} contributions in the last 6 months</div>
        <div class="heatmap-legend">
          <span>Less</span>
          <span class="swatch" style="background:#ebedf0"></span>
          <span class="swatch" style="background:#9be9a8"></span>
          <span class="swatch" style="background:#40c463"></span>
          <span class="swatch" style="background:#30a14e"></span>
          <span class="swatch" style="background:#216e39"></span>
          <span>More</span>
        </div>
      </Fragment>
    )}
  </div>
</section>

<style>
  .heatmap-section { margin-bottom: 48px; }
  .heatmap-container { background: #fafafa; border-radius: 8px; padding: 18px 14px 10px; overflow-x: auto; }
  .heatmap-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .heatmap-title { font-size: 12px; font-weight: 500; color: var(--text); }
  .heatmap-link { font-size: 11px; color: var(--accent); text-decoration: none; }
  .heatmap-fallback { font-size: 12px; color: var(--text-muted); padding: 12px 0; }
  .heatmap-grid { display: flex; gap: 3px; min-width: fit-content; }
  .heatmap-week { display: flex; flex-direction: column; gap: 3px; }
  .heatmap-day { width: 11px; height: 11px; border-radius: 2px; background: #ebedf0; }
  .heatmap-day.l1 { background: #9be9a8; }
  .heatmap-day.l2 { background: #40c463; }
  .heatmap-day.l3 { background: #30a14e; }
  .heatmap-day.l4 { background: #216e39; }
  .heatmap-total { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); margin-top: 10px; }
  .heatmap-legend { display: flex; align-items: center; gap: 4px; margin-top: 8px; font-size: 9px; color: var(--text-muted); justify-content: flex-end; }
  .swatch { width: 10px; height: 10px; border-radius: 2px; }
</style>
```

- [ ] **Step 3: 创建/覆写 `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SiteHeader from '../components/SiteHeader.astro';
import NowModule from '../components/NowModule.astro';
import GitHubHeatmap from '../components/GitHubHeatmap.astro';
import UpdateItem from '../components/UpdateItem.astro';
import { siteConfig } from '../config';
import { loadAllContent } from '../lib/content/loadContent';

const { items } = await loadAllContent();
const recentItems = items.slice(0, 5);
---

<BaseLayout title={siteConfig.title}>
  <div class="container">
    <SiteHeader />
    <NowModule />
    <GitHubHeatmap />

    <section class="updates-section">
      <div class="section-title">最新近况</div>
      {recentItems.map(item => <UpdateItem item={item} />)}
      {items.length > 5 && <p style="font-size:13px;color:var(--text-muted)"><a href="/updates">查看更多 &rarr;</a></p>}
    </section>

    <div class="divider"></div>

    <section class="projects-section">
      <div class="section-title">精选项目</div>
      {siteConfig.projects.map(p => (
        <div class="project-item">
          <h4><a href={p.url} target="_blank">{p.name}</a></h4>
          <p class="desc">{p.description}</p>
        </div>
      ))}
    </section>

    <section class="contact-section">
      <div class="section-title">联系</div>
      <div class="contact-links">
        <a href={siteConfig.github} target="_blank">GitHub</a>
        <a href={`mailto:${siteConfig.email}`}>Email</a>
        <a href="/rss.xml">RSS</a>
      </div>
    </section>
  </div>

  <footer class="page-footer">
    <div class="container">
      <p class="copy">&copy; {new Date().getFullYear()} {siteConfig.title} &middot; 由 GitHub Issues 驱动</p>
    </div>
  </footer>
</BaseLayout>

<style>
  .updates-section { margin-bottom: 48px; }
  .divider { height: 1px; background: var(--border); margin: 40px 0; }
  .projects-section { margin-bottom: 48px; }
  .project-item { margin-bottom: 16px; }
  .project-item h4 { font-size: 14px; font-weight: 600; }
  .project-item h4 a { color: var(--text); text-decoration: none; }
  .project-item h4 a:hover { color: var(--accent); }
  .project-item .desc { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .contact-links { display: flex; gap: 16px; flex-wrap: wrap; }
  .contact-links a { font-size: 13px; color: var(--text-muted); text-decoration: none; }
  .contact-links a:hover { color: var(--accent); }
  .page-footer { margin-top: 48px; padding: 20px 0; border-top: 1px solid var(--border); }
  .copy { font-size: 11px; color: var(--text-muted); }
</style>
```

- [ ] **Step 4: 验证**

```bash
CONTENT_SOURCE=fixture npm run dev
```

打开 `http://localhost:4321/home/` 确认首页渲染 Now 模块、热力图、近况流、项目、联系方式。

- [ ] **Step 5: 提交**

```bash
git add -A && git commit -m "feat: add homepage with Now, heatmap, and recent updates"
```

---

### Task 12: 近况、文章列表、动态列表页

**Files:**
- Create: `src/pages/updates/index.astro`
- Create: `src/pages/articles/index.astro`
- Create: `src/pages/moments/index.astro`

- [ ] **Step 1: 创建 `src/pages/updates/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteHeader from '../../components/SiteHeader.astro';
import UpdateItem from '../../components/UpdateItem.astro';
import { loadAllContent } from '../../lib/content/loadContent';

const { items, warnings } = await loadAllContent();

// Group by date
const grouped = new Map<string, typeof items>();
for (const item of items) {
  const date = item.publishedAt.slice(0, 10);
  if (!grouped.has(date)) grouped.set(date, []);
  grouped.get(date)!.push(item);
}
---

<BaseLayout title="近况">
  <div class="container">
    <SiteHeader />
    <div class="section-title">近况</div>
    {Array.from(grouped.entries()).map(([date, dayItems]) => (
      <div>
        <div class="day-sep">{date}</div>
        {dayItems.map(item => <UpdateItem item={item} />)}
      </div>
    ))}
  </div>
</BaseLayout>

<style>
  .day-sep { font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); padding: 16px 0 8px; border-bottom: 1px solid var(--border); margin-bottom: 16px; font-weight: 500; }
  .day-sep:first-child { padding-top: 0; }
</style>
```

- [ ] **Step 2: 创建 `src/pages/articles/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteHeader from '../../components/SiteHeader.astro';
import ArticleCard from '../../components/ArticleCard.astro';
import { loadAllContent } from '../../lib/content/loadContent';

const { items } = await loadAllContent();
const articles = items.filter(i => i.kind === 'article');
---

<BaseLayout title="文章">
  <div class="container">
    <SiteHeader />
    <div class="section-title">文章</div>
    {articles.map(item => <ArticleCard article={item} showPinned />)}
  </div>
</BaseLayout>
```

- [ ] **Step 3: 创建 `src/pages/moments/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteHeader from '../../components/SiteHeader.astro';
import MomentCard from '../../components/MomentCard.astro';
import { loadAllContent } from '../../lib/content/loadContent';

const { items } = await loadAllContent();
const moments = items.filter(i => i.kind === 'moment');
---

<BaseLayout title="动态">
  <div class="container">
    <SiteHeader />
    <div class="section-title">动态</div>
    {moments.map(item => <MomentCard moment={item} />)}
  </div>
</BaseLayout>
```

- [ ] **Step 4: 提交**

```bash
git add -A && git commit -m "feat: add updates, articles, and moments list pages"
```

---

### Task 13: 文章详情页

**Files:**
- Create: `src/components/TableOfContents.astro`
- Create: `src/components/CommentSection.astro`
- Create: `src/components/CommentItem.astro`
- Create: `src/components/IssueSource.astro`
- Create: `src/pages/articles/[slug].astro`

- [ ] **Step 1: 创建 `src/components/TableOfContents.astro`**

```astro
---
interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  headings: TocItem[];
}

const { headings } = Astro.props;
const h2s = headings.filter(h => h.level === 2);
---

{headings.length > 0 && (
  <aside class="toc-sidebar">
    <div class="toc-label">目录</div>
    <ul class="toc-list">
      {headings.map(h => (
        <li class:list={[`toc-h${h.level}`]}>
          <a href={`#${h.id}`}>{h.text}</a>
        </li>
      ))}
    </ul>
  </aside>
)}

<style>
  .toc-sidebar { position: sticky; top: 48px; }
  .toc-label { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px; }
  .toc-list { list-style: none; }
  .toc-list li { margin-bottom: 6px; }
  .toc-list a { font-size: 12px; color: var(--text-muted); text-decoration: none; line-height: 1.5; transition: color 0.15s; display: block; padding: 2px 0; }
  .toc-list a:hover, .toc-list a.active { color: var(--accent); }
  .toc-h3 a { padding-left: 14px; font-size: 11px; }

  @media (max-width: 960px) {
    .toc-sidebar { position: static; margin-bottom: 32px; }
    .toc-list { display: flex; flex-wrap: wrap; gap: 4px 16px; }
    .toc-list li { margin-bottom: 0; }
    .toc-h3 { display: none; }
  }
</style>
```

- [ ] **Step 2: 创建 `src/components/CommentItem.astro`**

```astro
---
interface Props {
  author: string;
  avatarUrl: string;
  createdAt: string;
  bodyHtml: string;
  htmlUrl: string;
}

const { author, avatarUrl, createdAt, bodyHtml, htmlUrl } = Astro.props;
---

<div class="comment">
  <div class="comment-header">
    <img class="comment-avatar" src={avatarUrl} alt={author} width="32" height="32" />
    <span class="comment-author">{author}</span>
    <span class="comment-time"><a href={htmlUrl}>{createdAt.slice(0, 10)}</a></span>
  </div>
  <div class="comment-body">{@html bodyHtml}</div>
</div>

<style>
  .comment { margin-bottom: 24px; }
  .comment-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .comment-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; }
  .comment-author { font-size: 13px; font-weight: 600; }
  .comment-time { font-size: 11px; color: var(--text-muted); }
  .comment-time a { color: var(--text-muted); text-decoration: none; }
  .comment-body { margin-left: 42px; font-size: 14px; line-height: 1.7; }
  .comment-body :global(p) { margin-bottom: 12px; }
  .comment-body :global(p:last-child) { margin-bottom: 0; }
</style>
```

- [ ] **Step 3: 创建 `src/components/CommentSection.astro`**

```astro
---
import CommentItem from './CommentItem.astro';

interface Props {
  owner: string;
  repo: string;
  issueNumber: number;
  issueUrl: string;
}

const { owner, repo, issueNumber, issueUrl } = Astro.props;

interface GitHubComment {
  id: number;
  user: { login: string; avatar_url: string } | null;
  created_at: string;
  body_html: string;
  html_url: string;
}

let comments: GitHubComment[] = [];
try {
  const token = import.meta.env.GH_TOKEN;
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'timeline-builder' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=50`, { headers });
  if (res.ok) comments = await res.json();
} catch {}
---

<section class="comments-section">
  <h3 class="comments-title">评论 <span class="count">{comments.length}</span></h3>

  {comments.length === 0 && <p style="font-size:13px;color:var(--text-muted);margin-bottom:24px">暂无评论</p>}

  {comments.map(c => (
    <Fragment>
      <CommentItem author={c.user?.login || 'unknown'} avatarUrl={c.user?.avatar_url || ''} createdAt={c.created_at} bodyHtml={c.body_html} htmlUrl={c.html_url} />
      <div class="comment-border"></div>
    </Fragment>
  ))}

  <div class="comment-box">
    <div class="comment-login-hint">
      通过 <a href={issueUrl}>GitHub</a> 登录后即可评论
    </div>
  </div>
</section>

<style>
  .comments-section { margin-top: 48px; }
  .comments-title { font-size: 14px; font-weight: 600; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
  .comments-title .count { font-size: 12px; color: var(--text-muted); font-weight: 400; }
  .comment-border { height: 1px; background: var(--border); margin: 20px 0 20px 42px; }
  .comment-box { margin-top: 32px; margin-left: 42px; }
  .comment-login-hint { padding: 16px 20px; border: 1px dashed var(--border); border-radius: 8px; text-align: center; font-size: 13px; color: var(--text-muted); }
  .comment-login-hint a { color: var(--accent); font-weight: 500; }
</style>
```

- [ ] **Step 4: 创建 `src/components/IssueSource.astro`**

```astro
---
interface Props {
  issueUrl: string;
  issueNumber: number;
}

const { issueUrl, issueNumber } = Astro.props;
---

<div class="issue-source">
  <span>💡</span>
  <span>本文由 GitHub Issue <a href={issueUrl}>#{issueNumber}</a> 生成。发现错误？<a href={issueUrl}>去 Issue 页编辑</a></span>
</div>

<style>
  .issue-source { margin-top: 64px; padding: 16px 20px; background: #fafafa; border-radius: 8px; font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 8px; }
  .issue-source a { color: var(--accent); text-decoration: none; font-weight: 500; }
</style>
```

- [ ] **Step 5: 创建 `src/pages/articles/[slug].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteHeader from '../../components/SiteHeader.astro';
import TableOfContents from '../../components/TableOfContents.astro';
import CommentSection from '../../components/CommentSection.astro';
import IssueSource from '../../components/IssueSource.astro';
import { loadAllContent } from '../../lib/content/loadContent';
import type { ArticleUpdate } from '../../lib/content/types';

export async function getStaticPaths() {
  const { items } = await loadAllContent();
  return items
    .filter(i => i.kind === 'article')
    .map(a => ({ params: { slug: (a as ArticleUpdate).slug } }));
}

const { slug } = Astro.params;
const { items } = await loadAllContent();
const article = items.find(i => i.kind === 'article' && (i as ArticleUpdate).slug === slug) as ArticleUpdate | undefined;

if (!article) {
  return Astro.redirect('/404');
}

// Extract headings from body for TOC
const headingRegex = /^(#{2,3})\s+(.+)$/gm;
const headings: Array<{ id: string; text: string; level: number }> = [];
let match;
while ((match = headingRegex.exec(article.body)) !== null) {
  const text = match[2];
  const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/-+$/, '');
  headings.push({ id, text, level: match[1].length });
}

const description = article.description;
const cover = article.cover;
---

<BaseLayout title={article.title} description={description} ogImage={cover}>
  <div class="container-wide">
    <TableOfContents headings={headings} />
    <div class="article-column">
      <a class="back-link" href="/articles">&larr; 文章</a>

      <header class="article-header">
        <span class="kind-badge">ARTICLE</span>
        <h1>{article.title}</h1>
        <p class="desc">{description}</p>
        <div class="meta">
          <span>{article.publishedAt.slice(0, 10)}</span>
          <span>&middot;</span>
          <span>阅读 {article.readingTime} 分钟</span>
        </div>
        <div class="tags">
          {article.tags.map(tag => <a href={`/tags/${tag}`} class="tag">#{tag}</a>)}
        </div>
      </header>

      {cover && <img class="cover" src={cover} alt="" />}

      <div class="article-body">
        {article.body.split('\n').map(line => {
          if (line.startsWith('## ')) return `<h2 id="${line.slice(3).toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-')}">${line.slice(3)}</h2>`;
          if (line.startsWith('### ')) return `<h3 id="${line.slice(4).toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-')}">${line.slice(4)}</h3>`;
          if (line.trim() === '') return '<br />';
          return `<p>${line}</p>`;
        }).join('\n')}
        <!-- Markdown rendering simplified for first pass; real impl uses remark pipeline -->
      </div>

      <IssueSource issueUrl={article.issueUrl} issueNumber={article.number} />
      <CommentSection owner="muliminty" repo="home" issueNumber={article.number} issueUrl={article.issueUrl} />
    </div>
  </div>
</BaseLayout>

<style>
  .article-column { min-width: 0; max-width: 600px; }
  .back-link { display: inline-block; font-size: 13px; color: var(--text-muted); text-decoration: none; margin-bottom: 40px; }
  .back-link:hover { color: var(--accent); }
  .article-header { margin-bottom: 32px; }
  .kind-badge { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; color: var(--accent); border: 1px solid var(--accent); padding: 2px 8px; border-radius: 3px; margin-bottom: 16px; }
  .article-header h1 { font-size: 24px; font-weight: 700; line-height: 1.35; margin-bottom: 12px; }
  .desc { font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px; }
  .meta { font-size: 13px; color: var(--text-muted); display: flex; gap: 16px; align-items: center; }
  .tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 14px; }
  .tag { font-size: 11px; color: var(--accent); text-decoration: none; }
  .cover { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 8px; margin-bottom: 32px; background: #f5f5f7; }
  .article-body { font-size: 15px; line-height: 1.85; }
  .article-body :global(h2) { font-size: 20px; font-weight: 700; margin: 48px 0 16px; }
  .article-body :global(h3) { font-size: 17px; font-weight: 600; margin: 36px 0 12px; }
  .article-body :global(p) { margin-bottom: 20px; }

  @media (max-width: 600px) {
    .article-header h1 { font-size: 20px; }
    .article-body { font-size: 14px; }
    .cover { border-radius: 4px; }
  }
</style>

<script>
  // TOC scroll highlight
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.toc-list a').forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.toc-list a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -70% 0px' });
  document.querySelectorAll('.article-body h2[id], .article-body h3[id]').forEach(h => observer.observe(h));
</script>
```

- [ ] **Step 6: 提交**

```bash
git add -A && git commit -m "feat: add article detail page with TOC and comments"
```

---

### Task 14: 动态详情页

**Files:**
- Create: `src/components/MomentImages.astro`
- Create: `src/pages/moments/[number].astro`

- [ ] **Step 1: 创建 `src/components/MomentImages.astro`**

```astro
---
interface Props {
  images: Array<{ src: string; alt: string }>;
}

const { images } = Astro.props;
const gridClass = images.length === 1 ? 'grid-single' : 'grid-multi';
---

<div class={`moment-images ${gridClass}`}>
  {images.map(img => (
    <img src={img.src} alt={img.alt} class="moment-img" loading="lazy" style={`aspect-ratio: ${images.length === 1 ? '4/3' : '1'}`} />
  ))}
</div>

<style>
  .moment-images { margin-bottom: 48px; }
  .grid-single .moment-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 8px; background: #f5f5f7; }
  .grid-multi { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  .grid-multi .moment-img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; background: #f5f5f7; }

  @media (max-width: 600px) {
    .grid-single .moment-img { border-radius: 4px; }
  }
</style>
```

- [ ] **Step 2: 创建 `src/pages/moments/[number].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import MomentImages from '../../components/MomentImages.astro';
import CommentSection from '../../components/CommentSection.astro';
import IssueSource from '../../components/IssueSource.astro';
import { loadAllContent } from '../../lib/content/loadContent';
import type { MomentUpdate } from '../../lib/content/types';

export async function getStaticPaths() {
  const { items } = await loadAllContent();
  return items
    .filter(i => i.kind === 'moment')
    .map(m => ({ params: { number: String(m.number) } }));
}

const { number } = Astro.params;
const { items } = await loadAllContent();
const moment = items.find(i => i.kind === 'moment' && i.number === Number(number)) as MomentUpdate | undefined;

if (!moment) return Astro.redirect('/404');
---

<BaseLayout title={moment.title || `动态 #${moment.number}`}>
  <div class="container">
    <a class="back-link" href="/moments">&larr; 动态</a>

    <header class="moment-header">
      <span class="kind-badge">MOMENT</span>
      <div class="time">{moment.publishedAt.slice(0, 10)}</div>
      <p class="body-text">{moment.text}</p>
      <div class="tags">
        {moment.tags.map(tag => <a href={`/tags/${tag}`} class="tag">#{tag}</a>)}
      </div>
    </header>

    <MomentImages images={moment.images} />

    <IssueSource issueUrl={moment.issueUrl} issueNumber={moment.number} />
    <CommentSection owner="muliminty" repo="home" issueNumber={moment.number} issueUrl={moment.issueUrl} />
  </div>
</BaseLayout>

<style>
  .back-link { display: inline-block; font-size: 13px; color: var(--text-muted); text-decoration: none; margin-bottom: 40px; }
  .back-link:hover { color: var(--accent); }
  .moment-header { margin-bottom: 32px; }
  .kind-badge { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; color: #3fb950; border: 1px solid #3fb950; padding: 2px 8px; border-radius: 3px; margin-bottom: 12px; }
  .time { font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 16px; }
  .body-text { font-size: 16px; line-height: 1.8; }
  .tags { display: flex; gap: 6px; margin-top: 14px; }
  .tag { font-size: 11px; color: var(--accent); text-decoration: none; }
</style>
```

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add moment detail page with images and comments"
```

---

### Task 15: 标签页 + 404

**Files:**
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/404.astro`

- [ ] **Step 1: 创建 `src/pages/tags/[tag].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import UpdateItem from '../../components/UpdateItem.astro';
import { loadAllContent } from '../../lib/content/loadContent';

export async function getStaticPaths() {
  const { items } = await loadAllContent();
  const tagSet = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) tagSet.add(tag);
  }
  return Array.from(tagSet).map(tag => ({ params: { tag } }));
}

const { tag } = Astro.params;
const { items } = await loadAllContent();
const filtered = items.filter(i => i.tags.includes(tag!));
---

<BaseLayout title={`#${tag}`}>
  <div class="container">
    <a class="back-link" href="/updates">&larr; 近况</a>
    <div class="section-title">#{tag}</div>
    {filtered.length === 0 && <p style="font-size:13px;color:var(--text-muted)">暂无相关内容</p>}
    {filtered.map(item => <UpdateItem item={item} />)}
  </div>
</BaseLayout>

<style>
  .back-link { display: inline-block; font-size: 13px; color: var(--text-muted); text-decoration: none; margin-bottom: 40px; }
  .back-link:hover { color: var(--accent); }
</style>
```

- [ ] **Step 2: 创建 `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="404">
  <div class="container" style="text-align:center;padding-top:120px">
    <p style="font-size:48px;font-weight:700;color:var(--text-muted);margin-bottom:16px">404</p>
    <p style="font-size:14px;color:var(--text-muted);margin-bottom:32px">页面不存在</p>
    <a href="/" style="font-size:14px">返回首页</a>
  </div>
</BaseLayout>
```

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add tag page and 404 page"
```

---

### Task 16: GitHub Actions 部署 Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 创建 `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:
  schedule:
    - cron: '0 3 * * *'
  issues:
    types: [opened, edited, labeled, unlabeled, closed, reopened, deleted]

concurrency:
  group: pages-deploy
  cancel-in-progress: true

permissions:
  contents: read
  issues: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install
        run: npm ci

      - name: Build
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          CONTENT_SOURCE: live
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 提交并推送以触发首次部署**

```bash
git add -A && git commit -m "feat: add GitHub Actions deploy workflow"
```

---

### Task 17: 补 Markdown 渲染管道（remark + rehype）

文章详情当前是简单的手动 HTML 拼接，需要替换为真正的 Markdown 渲染。

**Files:**
- Install: `remark`, `remark-gfm`, `rehype-stringify`, `remark-rehype`, `rehype-pretty-code`, `rehype-slug`
- Modify: `src/pages/articles/[slug].astro`

- [ ] **Step 1: 安装依赖**

```bash
npm install unified remark remark-gfm remark-rehype rehype-stringify rehype-pretty-code rehype-slug
```

- [ ] **Step 2: 修改 `src/pages/articles/[slug].astro`** 的 body 渲染部分

将 article body 的 Astro 前端部分改为:

```astro
---
// ... existing imports and getStaticPaths ...

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

// ... after finding article ...

const bodyHtml = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypePrettyCode, { theme: 'github-light' })
  .use(rehypeSlug)
  .use(rehypeStringify)
  .process(article.body);
---

<!-- In template: replace the manual line-splitting with: -->
<div class="article-body">
  {@html bodyHtml.toString()}
</div>
```

- [ ] **Step 3: 提交**

```bash
git add -A && git commit -m "feat: add remark/rehype markdown rendering pipeline"
```

---

### Task 18: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: 创建 `src/pages/rss.xml.ts`**

```ts
import type { APIRoute } from 'astro';
import { loadAllContent } from '../lib/content/loadContent';
import type { ArticleUpdate } from '../lib/content/types';

export const GET: APIRoute = async ({ site }) => {
  const { items } = await loadAllContent();
  const articles = items.filter(i => i.kind === 'article') as ArticleUpdate[];

  const itemsXml = articles.map(a => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${site}articles/${a.slug}/</link>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <guid>${site}articles/${a.slug}/</guid>
    </item>`).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>漫游笔记</title>
    <description>一个前端开发者的公开时间线</description>
    <link>${site}</link>
    <atom:link href="${site}rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`, { headers: { 'Content-Type': 'application/xml' } });
};

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
```

- [ ] **Step 2: 提交**

```bash
git add -A && git commit -m "feat: add RSS feed for articles"
```

---

### Task 19: 验证 & 收尾

- [ ] **Step 1: Fixture 全量构建验证**

```bash
CONTENT_SOURCE=fixture npm run build
```

确认所有页面生成，`dist/` 目录包含 8 个页面，无报错。

- [ ] **Step 2: 验证 base path 和 404**

```bash
npx astro preview
```

检查 `/home/`、`/home/updates`、`/home/articles/issue-1` 等路径均可访问。不存在的路径返回自定义 404。

- [ ] **Step 3: 废弃旧代码**

在 `astro.config.ts` 中确认 `archive/terminal-v1/` 被排除在构建之外（Astro 默认只处理 `src/pages/`，无需额外配置，但确认 `vite.server.watch.ignored` 不必加就行）。

- [ ] **Step 4: 提交最终状态**

```bash
git add -A && git commit -m "feat: complete MVP with all pages, content pipeline, and deploy workflow"
```

---

### Post-MVP（本计划不包含，后续迭代）

- 暗色模式切换
- 图片灯箱
- 评论写交互（OAuth 登录）
- Pagefind 搜索
- 命令面板彩蛋
- 无限滚动/客户端分页
- `astro:assets` 图片优化
- sitemap.xml
