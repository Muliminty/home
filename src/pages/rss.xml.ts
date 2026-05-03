import type { APIRoute } from 'astro';
import { loadAllContent } from '../lib/content/loadContent';
import type { ArticleUpdate } from '../lib/content/types';

export const GET: APIRoute = async ({ site }) => {
  if (!site) return new Response('Site URL not configured', { status: 500 });

  const { items } = await loadAllContent();
  const articles = items.filter(i => i.kind === 'article') as ArticleUpdate[];

  const itemsXml = articles.map(a => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${site}home/articles/${a.slug}/</link>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <guid>${site}home/articles/${a.slug}/</guid>
    </item>`).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>漫游笔记</title>
    <description>一个前端开发者的公开时间线</description>
    <link>${site}</link>
    <atom:link href="${site}home/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`, { headers: { 'Content-Type': 'application/xml' } });
};

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
