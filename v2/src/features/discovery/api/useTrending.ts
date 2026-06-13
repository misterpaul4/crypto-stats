import { useQuery } from '@tanstack/react-query';
import { cgFetch } from '@shared/lib/api/cgFetch';
import { cgEndpoints } from '@shared/lib/api/coingecko.endpoints';
import { queryKeys } from '@shared/lib/query/queryKeys';
import type { TrendingItem, TrendingResponse } from '@shared/types/coingecko';

/** Trending coins (CoinGecko returns 15, wrapped in `item`). */
export function useTrending(limit = 6) {
  return useQuery({
    queryKey: queryKeys.trending(),
    queryFn: ({ signal }) => cgFetch<TrendingResponse>(cgEndpoints.trending(), signal),
    staleTime: 10 * 60_000,
    select: (data): TrendingItem[] => data.coins.map((c) => c.item).slice(0, limit),
  });
}
