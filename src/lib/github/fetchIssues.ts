import type { GitHubIssue } from '../content/types';

const API_BASE = 'https://api.github.com';

interface FetchOptions {
  owner: string;
  repo: string;
  token?: string;
}

export async function fetchAllIssues(options: FetchOptions): Promise<GitHubIssue[]> {
  const { owner, repo, token } = options;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'timeline-builder',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const allIssues: GitHubIssue[] = [];
  let page = 1;

  while (true) {
    const url = `${API_BASE}/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const remaining = res.headers.get('X-RateLimit-Remaining');
      const reset = res.headers.get('X-RateLimit-Reset');
      if (res.status === 403 && remaining === '0' && reset) {
        const resetDate = new Date(Number(reset) * 1000);
        throw new Error(`GitHub API rate limit exhausted. Resets at ${resetDate.toLocaleString()}`);
      }
      throw new Error(`GitHub API request failed: ${res.status} ${res.statusText} (page ${page})`);
    }

    const issues: GitHubIssue[] = await res.json();
    if (issues.length === 0) break;

    allIssues.push(...issues);
    console.log(`  page ${page}: ${issues.length} issues (total: ${allIssues.length})`);
    page++;
  }

  return allIssues;
}
