import { ConfigError } from '@/lib/data/errors';

/**
 * Section boundary for live-data fetchers. Fetchers throw loudly; sections
 * decide presentation. Returns null on failure so the section can render a
 * VISIBLE degraded state (never a silently-empty section). ConfigError is
 * reported at 'warn' level — expected while an integration (e.g. Umami)
 * isn't configured in the current environment.
 */
export async function safely<T>(source: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ConfigError) {
      console.warn(`[section:${source}] not configured — rendering without live data`);
    } else {
      console.error(`[section:${source}] live-data fetch failed:`, err);
    }
    return null;
  }
}
