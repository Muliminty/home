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
