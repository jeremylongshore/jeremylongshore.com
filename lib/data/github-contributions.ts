/**
 * Port of plugins/GithubContributionsPlugin.rb.
 *
 * Pulls Jeremy's merged PRs to EXTERNAL repos (not his own orgs) live from
 * the GitHub search API. Curated metadata (label/description/icon/tags) is
 * layered on top of the live counts for notable repos via META; everything
 * else is returned in `others` for chip-style rendering.
 *
 * No file cache of our own — Next's fetch cache (`next: { revalidate }`)
 * replaces the Ruby plugin's `.github_contributions_cache.json` + stale-cache
 * fallback. A failed request throws rather than silently falling back.
 */
import { DataFetchError } from './errors';
import { optional } from '../env';

const REVALIDATE_SECONDS = 21_600; // 6 hours
const USER_AGENT = 'jeremylongshore-portfolio';
const AUTHOR = 'jeremylongshore';
const EXCLUDE_OWNERS = ['jeremylongshore', 'intent-solutions-io', 'intent-solutions'];

export interface ContributionMeta {
  label: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface ContributionHighlight extends ContributionMeta {
  repo: string;
  count: number;
  url: string;
}

export interface ContributionOther {
  repo: string;
  name: string;
  count: number;
  url: string;
}

export interface ContributionsResult {
  totalPrs: number;
  totalRepos: number;
  highlights: ContributionHighlight[];
  others: ContributionOther[];
}

/**
 * Curated presentation for notable external repos, ported verbatim from the
 * Ruby plugin's `META` constant. Live counts are always real; this is
 * presentation-only (label/description/icon/tags).
 */
const META: Record<string, ContributionMeta> = {
  'bmosoluciones/now-lms': {
    label: 'NOW LMS',
    description: 'i18n compile-at-boot fixes, enrollment integrity constraints, theme perf, and test coverage for the open-source learning management system',
    icon: 'fa-solid fa-graduation-cap',
    tags: ['Python', 'Flask', 'i18n'],
  },
  'GoogleCloudPlatform/vertex-ai-samples': {
    label: 'Vertex AI Samples',
    description: 'ADK inline-source deployment tutorial for Agent Engine',
    icon: 'fa-brands fa-google',
    tags: ['Python', 'Vertex-AI', 'ADK'],
  },
  'GoogleCloudPlatform/agent-starter-pack': {
    label: 'Agent Starter Pack',
    description: "Bob's Brain production ADK reference in the community showcase",
    icon: 'fa-brands fa-google',
    tags: ['Docs', 'ADK'],
  },
  'PostHog/posthog': {
    label: 'PostHog',
    description: 'React state management and feature-flag bug fixes',
    icon: 'fa-solid fa-chart-simple',
    tags: ['TypeScript', 'React'],
  },
  'gastownhall/beads': {
    label: 'Beads',
    description: 'Natural-language skill activation and core fixes',
    icon: 'fa-solid fa-link',
    tags: ['Go', 'Claude-Code'],
  },
  'pabs-ai/blur-extension': {
    label: 'Blur Extension',
    description: 'Teams, Slack, export/import, custom patterns',
    icon: 'fa-solid fa-eye-slash',
    tags: ['JavaScript', 'Privacy'],
  },
  'kobiton/automate': {
    label: 'Kobiton Automate',
    description: 'Mobile device-cloud test automation contributions',
    icon: 'fa-solid fa-mobile-screen',
    tags: ['Automation', 'Testing'],
  },
  'Kilo-Org/kilocode': {
    label: 'Kilo Code',
    description: 'Agent runtime test fix',
    icon: 'fa-solid fa-robot',
    tags: ['TypeScript'],
  },
  'tldraw/tldraw': {
    label: 'tldraw',
    description: 'Prettier extension fix',
    icon: 'fa-solid fa-pen-ruler',
    tags: ['TypeScript'],
  },
  'filamentphp/filament': {
    label: 'Filament',
    description: 'Dark mode fix',
    icon: 'fa-solid fa-layer-group',
    tags: ['PHP', 'Laravel'],
  },
};

interface GithubSearchIssuesItem {
  repository_url?: string;
}

interface GithubSearchIssuesResponse {
  total_count: number;
  items: GithubSearchIssuesItem[];
}

function buildQuery(): string {
  const excludes = EXCLUDE_OWNERS.map((owner) => `-user:${owner}`).join(' ');
  return `author:${AUTHOR} type:pr is:merged ${excludes}`;
}

function pullsUrl(repo: string): string {
  const search = new URLSearchParams({ q: `is:pr author:${AUTHOR} is:merged` });
  return `https://github.com/${repo}/pulls?${search.toString()}`;
}

/** Fetches and shapes Jeremy's merged external PRs into highlights + others. */
export async function getContributions(): Promise<ContributionsResult> {
  const token = optional('GITHUB_TOKEN') ?? optional('GH_TOKEN');
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': USER_AGENT,
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const url = new URL('https://api.github.com/search/issues');
  url.searchParams.set('q', buildQuery());
  url.searchParams.set('per_page', '100');
  url.searchParams.set('sort', 'created');
  url.searchParams.set('order', 'desc');

  let response: Response;
  try {
    response = await fetch(url, { headers, next: { revalidate: REVALIDATE_SECONDS } });
  } catch (cause) {
    console.error('[data:github-contributions] network error fetching search/issues');
    throw new DataFetchError('Failed to fetch GitHub contributions', 'github-contributions', { cause });
  }

  if (!response.ok) {
    console.error(`[data:github-contributions] GitHub search API returned ${response.status}`);
    throw new DataFetchError(`GitHub search API error ${response.status}`, 'github-contributions');
  }

  const body = (await response.json()) as GithubSearchIssuesResponse;
  const total = body.total_count;
  const items = body.items ?? [];

  const counts = new Map<string, number>();
  for (const item of items) {
    const repo = (item.repository_url ?? '').replace('https://api.github.com/repos/', '');
    if (!repo) continue;
    counts.set(repo, (counts.get(repo) ?? 0) + 1);
  }

  const sorted = [...counts.entries()].sort(([, a], [, b]) => b - a);

  const highlights: ContributionHighlight[] = [];
  const others: ContributionOther[] = [];

  for (const [repo, count] of sorted) {
    const meta = META[repo];
    if (meta) {
      highlights.push({ ...meta, repo, count, url: pullsUrl(repo) });
    } else {
      others.push({ repo, name: repo.split('/').pop() ?? repo, count, url: pullsUrl(repo) });
    }
  }

  return {
    totalPrs: total,
    totalRepos: counts.size,
    highlights,
    others,
  };
}
