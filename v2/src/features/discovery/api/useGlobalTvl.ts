import { useQuery } from '@tanstack/react-query';
import { jsonFetch } from '@shared/lib/api/jsonFetch';
import { queryKeys } from '@shared/lib/query/queryKeys';
import type { LlamaHistoricalChainTvl } from '@shared/types/llama';

const TVL_URL = 'https://api.llama.fi/v2/historicalChainTvl';

/** Global DeFi TVL — DeFiLlama server-caches ~30 min, so refresh hourly. */
export function useGlobalTvl() {
  return useQuery({
    queryKey: queryKeys.globalTvl(),
    queryFn: ({ signal }) => jsonFetch<LlamaHistoricalChainTvl>(TVL_URL, signal),
    staleTime: 60 * 60_000,
    select: (series) => {
      const current = series.at(-1)?.tvl ?? 0;
      const prevDay = series.at(-2)?.tvl ?? current;
      return {
        current,
        changePct: prevDay ? ((current - prevDay) / prevDay) * 100 : 0,
        spark: series.slice(-90).map((p) => p.tvl),
      };
    },
  });
}
