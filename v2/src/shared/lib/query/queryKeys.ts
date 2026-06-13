import type { VsCurrency } from '@shared/lib/api/coingecko.endpoints';

/** Centralized, typed query-key factory so invalidation/prefetch never guess strings. */
export const queryKeys = {
  markets: (vs: VsCurrency, perPage: number) => ['markets', vs, perPage] as const,
  coin: (id: string) => ['coin', id] as const,
  coinOhlc: (id: string, days: number) => ['coin-ohlc', id, days] as const,
  exchanges: (perPage: number) => ['exchanges', perPage] as const,
};
