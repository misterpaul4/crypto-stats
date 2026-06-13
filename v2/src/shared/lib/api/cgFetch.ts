import { env } from '@app/config/env';
import { acquire } from './throttle';

const BASE = 'https://api.coingecko.com/api/v3';

export class CgError extends Error {
  readonly status: number;
  readonly retryAfterMs?: number;

  constructor(message: string, status: number, retryAfterMs?: number) {
    super(message);
    this.name = 'CgError';
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

/** dev-only request counter to catch a stray refetchInterval regression. */
let reqCount = 0;

/**
 * The one place that talks to CoinGecko. Passes the Demo key as a *query param*
 * (a "simple request" that skips the CORS preflight a custom header would force),
 * forwards the AbortSignal so navigation cancels in-flight requests, and on 429
 * attaches Retry-After to the error WITHOUT sleeping — TanStack backs off once.
 */
export async function cgFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const release = await acquire();
  try {
    const sep = path.includes('?') ? '&' : '?';
    const key = env.VITE_COINGECKO_DEMO_KEY;
    const url = `${BASE}${path}${key ? `${sep}x_cg_demo_api_key=${key}` : ''}`;

    if (import.meta.env.DEV) {
      reqCount += 1;
      console.debug(`[cg] #${reqCount} ${path}`);
    }

    const res = await fetch(url, { headers: { accept: 'application/json' }, signal });

    if (res.status === 429) {
      const retryAfterMs = Number(res.headers.get('retry-after') ?? 5) * 1000;
      throw new CgError('CoinGecko rate limit (429)', 429, retryAfterMs);
    }
    if (!res.ok) throw new CgError(`CoinGecko ${res.status}`, res.status);

    return (await res.json()) as T;
  } finally {
    release();
  }
}
