import { useQuery } from '@tanstack/react-query';
import { cgFetch } from '@shared/lib/api/cgFetch';
import { cgEndpoints } from '@shared/lib/api/coingecko.endpoints';
import { queryKeys } from '@shared/lib/query/queryKeys';
import type { CoinDetail } from '@shared/types/coingecko';

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.coin(id),
    queryFn: ({ signal }) => cgFetch<CoinDetail>(cgEndpoints.coin(id), signal),
    staleTime: 5 * 60_000,
    enabled: id.length > 0,
  });
}
