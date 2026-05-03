import type { UpdateItem, GitHubIssue } from './types';
import type { ParseArticleResult } from './parseArticle';
import type { ParseMomentResult } from './parseMoment';

const CONTENT_SOURCE = process.env.CONTENT_SOURCE || 'fixture';
const GH_TOKEN = process.env.GH_TOKEN;
const GH_OWNER = 'muliminty';
const GH_REPO = 'home';

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
  const now = Date.now();
  if (_cache && (now - _cacheTime < CACHE_TTL)) {
    return _cache;
  }

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
