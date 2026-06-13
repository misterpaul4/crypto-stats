import { useQuery } from '@tanstack/react-query';
import { jsonFetch } from '@shared/lib/api/jsonFetch';
import { queryKeys } from '@shared/lib/query/queryKeys';
import type { StablecoinsResponse } from '@shared/types/llama';

const STABLE_URL = 'https://stablecoins.llama.fi/stablecoins?includePrices=true';

/** Total USD-pegged stablecoin market cap + 24h delta. Sum ONLY `peggedUSD` (no double-count). */
export function useStablecoins() {
  return useQuery({
    queryKey: queryKeys.stablecoins(),
    queryFn: ({ signal }) => jsonFetch<StablecoinsResponse>(STABLE_URL, signal),
    staleTime: 30 * 60_000,
    select: (data) => {
      const sum = (pick: (a: StablecoinsResponse['peggedAssets'][number]) => number) =>
        data.peggedAssets.reduce((acc, a) => acc + pick(a), 0);
      const totalUsd = sum((a) => a.circulating.peggedUSD ?? 0);
      const prevUsd = sum((a) => a.circulatingPrevDay.peggedUSD ?? 0);
      return {
        totalUsd,
        changePct: prevUsd ? ((totalUsd - prevUsd) / prevUsd) * 100 : 0,
      };
    },
  });
}
