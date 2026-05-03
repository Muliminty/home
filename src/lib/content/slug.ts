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
