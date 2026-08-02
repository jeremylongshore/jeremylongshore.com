/**
 * Tiny typed accessor for process.env.
 *
 * `optional` never throws — it returns `undefined` for an unset or
 * empty-string variable, letting callers decide what "not configured" means.
 * `require` is the fail-loud counterpart for fetchers that cannot function
 * without a given variable (e.g. GITHUB_TOKEN for the GraphQL heatmap).
 */
import { ConfigError } from './data/errors';

/** Returns the trimmed value of `name`, or `undefined` if unset/empty. */
export function optional(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Returns the value of `name`, throwing `ConfigError` if unset/empty. */
export function requireEnv(name: string): string {
  const value = optional(name);
  if (value === undefined) {
    throw new ConfigError(`Missing required environment variable: ${name}`, 'env');
  }
  return value;
}
