import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { cgFetch } from '@shared/lib/api/cgFetch';
import { cgEndpoints } from '@shared/lib/api/coingecko.endpoints';
import { queryKeys } from '@shared/lib/query/queryKeys';
import type { SearchCoin, SearchResponse } from '@shared/types/coingecko';

/** ⌘K fallback search. Pass a DEBOUNCED query; gated to >= 2 chars, 1 in-flight. */
export function useCoinSearch(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: queryKeys.coinSearch(q),
    queryFn: ({ signal }) => cgFetch<SearchResponse>(cgEndpoints.search(q), signal),
    enabled: q.length >= 2,
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
    select: (data): SearchCoin[] => data.coins.slice(0, 8),
  });
}
