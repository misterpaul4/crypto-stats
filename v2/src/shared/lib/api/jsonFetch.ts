/**
 * Plain JSON fetch for NON-CoinGecko hosts (DeFiLlama, Alternative.me). These are
 * separate failure domains with wildcard CORS and no key, so they bypass the
 * CoinGecko throttle/key in cgFetch.
 */
export async function jsonFetch<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { headers: { accept: 'application/json' }, signal });
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${url}`);
  return (await res.json()) as T;
}
