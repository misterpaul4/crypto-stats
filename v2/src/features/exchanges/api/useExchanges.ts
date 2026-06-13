import { useQuery } from '@tanstack/react-query';
import { cgFetch } from '@shared/lib/api/cgFetch';
import { cgEndpoints } from '@shared/lib/api/coingecko.endpoints';
import { queryKeys } from '@shared/lib/query/queryKeys';
import type { Exchange } from '@shared/types/coingecko';

/** Top exchanges by trust score. Slow-changing — long staleTime. */
export function useExchanges(perPage = 100) {
  return useQuery({
    queryKey: queryKeys.exchanges(perPage),
    queryFn: ({ signal }) => cgFetch<Exchange[]>(cgEndpoints.exchanges(perPage), signal),
    staleTime: 10 * 60_000,
  });
}
