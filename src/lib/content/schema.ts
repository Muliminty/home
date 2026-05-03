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
