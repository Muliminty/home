import type { UpdateItem, GitHubIssue } from './types';
import type { ParseArticleResult } from './parseArticle';
import type { ParseMomentResult } from './parseMoment';

// In-memory cache: avoids re-fetching GitHub API on every page navigation
// TTL: 2 minutes for dev, infinite for build (each build is fresh)
let _cache: { items: UpdateItem[]; warnings: string[]; errors: string[] } | null = null;
let _cacheTime = 0;
const CACHE_TTL = 2 * 60 * 1000; // 2 min

export async function loadAllContent(): Promise<{
  items: UpdateItem[];
  warnings: string[];
  errors: string[];
}> {
  const contentSource = import.meta.env.CONTENT_SOURCE || 'fixture';
  const ghToken = import.meta.env.GH_TOKEN;
  const ghOwner = import.meta.env.GH_OWNER;
  const ghRepo = import.meta.env.GH_REPO;
  const now = Date.now();
  if (_cache && (now - _cacheTime < CACHE_TTL)) {
    return _cache;
  }

  let issues: GitHubIssue[];
  const sourceWarnings: string[] = [];
  const missingLiveEnvVars = [
    !ghToken && 'GH_TOKEN',
    !ghOwner && 'GH_OWNER',
    !ghRepo && 'GH_REPO',
  ].filter(Boolean) as string[];

  if (contentSource === 'live' && missingLiveEnvVars.length === 0) {
    const { fetchAllIssues } = await import('../github/fetchIssues');
    issues = await fetchAllIssues({ owner: ghOwner, repo: ghRepo, token: ghToken });
  } else {
    if (contentSource === 'live' && missingLiveEnvVars.length > 0) {
      // Why: live 模式少任何一个仓库定位参数都会产生“连上了但数据不对”的假象，直接暴露缺项更省排查成本。
      sourceWarnings.push(`CONTENT_SOURCE=live 但缺少 ${missingLiveEnvVars.join(', ')}，已回退到 fixture 数据源`);
    }
    const fixtureModule = await import('../../content/fixtures/issues.json');
    issues = fixtureModule.default as GitHubIssue[];
  }

  const items: UpdateItem[] = [];
  const warnings: string[] = [...sourceWarnings];
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

  const articles = items.filter(i => i.kind === 'article') as Array<{ slug: string; number: number }>;
  const slugError = checkSlugUnique(articles);
  if (slugError) errors.push(slugError);

  items.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });

  _cache = { items, warnings, errors };
  _cacheTime = now;
  return _cache;
}
