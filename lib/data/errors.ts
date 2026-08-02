/**
 * Typed errors for the data layer.
 *
 * Fetchers never return silently-empty data on failure — they throw one of
 * these, having already logged a single `console.error('[data:NAME] …')`
 * line. Callers (page sections) decide the user-facing boundary behavior
 * (error boundary, fallback UI, etc.).
 */

interface DataErrorOptions {
  cause?: unknown;
}

/** A live fetch (network, HTTP, or parse) failure. */
export class DataFetchError extends Error {
  readonly source: string;

  constructor(message: string, source: string, options?: DataErrorOptions) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'DataFetchError';
    this.source = source;
  }
}

/** A fetcher's required configuration (env vars, credentials) is missing. */
export class ConfigError extends Error {
  readonly source: string;

  constructor(message: string, source: string, options?: DataErrorOptions) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'ConfigError';
    this.source = source;
  }
}
