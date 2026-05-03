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
