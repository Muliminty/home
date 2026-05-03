import type { ContentStatus, UpdateKind } from './types';

interface ParsedLabels {
  kind: UpdateKind | null;
  status: ContentStatus;
  tags: string[];
  typeError: boolean;
}

export function parseLabels(labels: Array<{ name: string }>): ParsedLabels {
  const result: ParsedLabels = { kind: null, status: 'published', tags: [], typeError: false };
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
