/**
 * New fetcher (no Ruby plugin precedent): per-URL pageview counts from a
 * self-hosted Umami v2 instance (analytics.intentsolutions.io).
 *
 * Umami's `/api/websites/{id}/metrics?type=path` endpoint (verified live 2026-08-02:
 * this instance 400s on the older `type=url`, 200s on `type=path`)
 * returns an array of `{ x: string; y: number }` points, where `x` is the
 * page URL/path and `y` is the pageview count for that path over the
 * requested [startAt, endAt) window (both epoch milliseconds).
 * this environment) — verify against a real response before shipping.
 *
 * `startAt` defaults to 2024-01-01 (treated as "site epoch" — i.e. all-time
 * counts) through now.
 */
import { ConfigError, DataFetchError } from './errors';
import { optional } from '../env';

const REVALIDATE_SECONDS = 900; // 15 minutes
const SITE_EPOCH_MS = Date.UTC(2024, 0, 1);

interface UmamiMetricPoint {
  x: string;
  y: number;
}

/** Fetches all-time per-URL pageview counts, keyed by URL path. */
export async function getViewCounts(): Promise<Map<string, number>> {
  const baseUrl = optional('UMAMI_BASE_URL');
  const token = optional('UMAMI_API_TOKEN');
  const websiteId = optional('UMAMI_WEBSITE_ID');

  if (!baseUrl || !token || !websiteId) {
    console.error(
      '[data:umami-views] umami not configured (missing UMAMI_BASE_URL / UMAMI_API_TOKEN / UMAMI_WEBSITE_ID)'
    );
    throw new ConfigError('umami not configured', 'umami-views');
  }

  const url = new URL(`/api/websites/${websiteId}/metrics`, baseUrl);
  url.searchParams.set('type', 'path');
  url.searchParams.set('startAt', String(SITE_EPOCH_MS));
  url.searchParams.set('endAt', String(Date.now()));

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (cause) {
    console.error('[data:umami-views] network error fetching Umami metrics');
    throw new DataFetchError('Failed to fetch Umami view counts', 'umami-views', { cause });
  }

  if (!response.ok) {
    console.error(`[data:umami-views] Umami API returned ${response.status}`);
    throw new DataFetchError(`Umami API error ${response.status}`, 'umami-views');
  }

  const points = (await response.json()) as UmamiMetricPoint[];
  return new Map(points.map((point): [string, number] => [point.x, point.y]));
}
