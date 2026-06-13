import { useQuery } from '@tanstack/react-query';
import { cgFetch } from '@shared/lib/api/cgFetch';
import { cgEndpoints, type VsCurrency } from '@shared/lib/api/coingecko.endpoints';
import { queryKeys } from '@shared/lib/query/queryKeys';
import type { CoinMarket } from '@shared/types/coingecko';

/** Top coins by market cap. Markets-class data is server-cached ~15 min upstream. */
export function useMarkets(vs: VsCurrency = 'usd', perPage = 100) {
  return useQuery({
    queryKey: queryKeys.markets(vs, perPage),
    queryFn: ({ signal }) => cgFetch<CoinMarket[]>(cgEndpoints.markets(vs, perPage), signal),
  });
}
