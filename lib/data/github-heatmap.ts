/**
 * New fetcher (no Ruby plugin precedent): GitHub's contribution calendar via
 * the GraphQL API for the profile heatmap component.
 *
 * GraphQL always requires auth, so a missing GITHUB_TOKEN throws a
 * `ConfigError` rather than attempting an unauthenticated call. Contract:
 * `weeks` is an array of 7-day arrays (GitHub's calendar already returns
 * full Sun-Sat weeks), each day carrying a 0-4 `level` derived from GitHub's
 * `contributionLevel` enum (NONE, FIRST_QUARTILE, SECOND_QUARTILE,
 * THIRD_QUARTILE, FOURTH_QUARTILE).
 *
 * NOTE: Next.js's `fetch` cache extension only memoizes/caches GET requests;
 * this is a POST (required by the GraphQL API), so `next: { revalidate }`
 * is passed for forward-compatibility/documentation of intent but Next may
 * not actually cache this call today. If that matters in practice, wrap the
 * call site in `unstable_cache` or a route-level revalidate.
 */
import { DataFetchError } from './errors';
import { requireEnv } from '../env';

const REVALIDATE_SECONDS = 21_600; // 6 hours
const USER_AGENT = 'jeremylongshore-portfolio';
const GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const DEFAULT_LOGIN = 'jeremylongshore';

const QUERY = `
  query ContributionCalendar($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

type GithubContributionLevel =
  | 'NONE'
  | 'FIRST_QUARTILE'
  | 'SECOND_QUARTILE'
  | 'THIRD_QUARTILE'
  | 'FOURTH_QUARTILE';

const LEVEL_TO_INT: Record<GithubContributionLevel, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionHeatmap {
  totalContributions: number;
  weeks: HeatmapDay[][];
}

interface GithubGraphqlDay {
  date: string;
  contributionCount: number;
  contributionLevel: GithubContributionLevel;
}

interface GithubGraphqlResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{ contributionDays: GithubGraphqlDay[] }>;
        };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

/** Fetches the public contribution calendar for `login` (default: jeremylongshore). */
export async function getContributionHeatmap(login: string = DEFAULT_LOGIN): Promise<ContributionHeatmap> {
  const token = requireEnv('GITHUB_TOKEN');

  let response: Response;
  try {
    response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (cause) {
    console.error('[data:github-heatmap] network error fetching contribution calendar');
    throw new DataFetchError('Failed to fetch GitHub contribution calendar', 'github-heatmap', { cause });
  }

  if (!response.ok) {
    console.error(`[data:github-heatmap] GitHub GraphQL API returned ${response.status}`);
    throw new DataFetchError(`GitHub GraphQL API error ${response.status}`, 'github-heatmap');
  }

  const body = (await response.json()) as GithubGraphqlResponse;

  if (body.errors && body.errors.length > 0) {
    console.error(`[data:github-heatmap] GraphQL errors: ${body.errors.map((e) => e.message).join('; ')}`);
    throw new DataFetchError(`GitHub GraphQL errors for login ${login}`, 'github-heatmap');
  }

  const calendar = body.data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) {
    console.error(`[data:github-heatmap] no contribution calendar returned for login ${login}`);
    throw new DataFetchError(`No contribution calendar for login ${login}`, 'github-heatmap');
  }

  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_TO_INT[day.contributionLevel],
      }))
    ),
  };
}
