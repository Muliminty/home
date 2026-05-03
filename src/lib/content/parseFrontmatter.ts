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
  if (!match) return { frontmatter: {}, body: text, unknownFields: [] };

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

export function resolvePublishedAt(fmPublishedAt: string | undefined, createdAt: string): { publishedAt: string; error: string | null } {
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
