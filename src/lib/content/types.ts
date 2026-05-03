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
