/**
 * Port of plugins/GithubRepoStarsCountPlugin.rb.
 *
 * The Ruby plugin cached to a JSON file with a 24h TTL and fell back to a
 * stale/rate-limited cache on 403/error. In the Next.js port there is no
 * file-based cache of our own — Next's `fetch` cache (`next: { revalidate }`)
 * is the cache, so a 403/network failure simply throws; the caller decides
 * whether to keep serving the previous ISR-cached page or show an error
 * boundary. Unlike the Ruby version (which returned `nil` on 404), a 404
 * here also throws — per this port's error philosophy, fetchers never
 * return silently-partial data.
 */
import { DataFetchError } from './errors';
import { optional } from '../env';

const REVALIDATE_SECONDS = 21_600; // 6 hours
const USER_AGENT = 'jeremylongshore-portfolio';

interface GithubRepoResponse {
  stargazers_count: number;
}

/** Fetches live star counts for each `owner/repo` in `repos`. */
export async function getRepoStars(repos: string[]): Promise<Record<string, number>> {
  const token = optional('GITHUB_TOKEN');
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': USER_AGENT,
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const entries = await Promise.all(
    repos.map(async (repo): Promise<[string, number]> => {
      let response: Response;
      try {
        response = await fetch(`https://api.github.com/repos/${repo}`, {
          headers,
          next: { revalidate: REVALIDATE_SECONDS },
        });
      } catch (cause) {
        console.error(`[data:github-stars] network error fetching stars for ${repo}`);
        throw new DataFetchError(`Failed to fetch star count for ${repo}`, 'github-stars', { cause });
      }

      if (!response.ok) {
        console.error(`[data:github-stars] GitHub API returned ${response.status} for ${repo}`);
        throw new DataFetchError(`GitHub API error ${response.status} for ${repo}`, 'github-stars');
      }

      const data = (await response.json()) as GithubRepoResponse;
      return [repo, data.stargazers_count];
    })
  );

  return Object.fromEntries(entries);
}

/** Formats a star count with thousands separators, e.g. `2547` -> `"2,547"`. */
export function formatStars(n: number): string {
  return n.toLocaleString('en-US');
}
