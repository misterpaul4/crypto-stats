import { useQuery } from '@tanstack/react-query';
import type { UTCTimestamp, CandlestickData } from 'lightweight-charts';
import { cgFetch } from '@shared/lib/api/cgFetch';
import { cgEndpoints } from '@shared/lib/api/coingecko.endpoints';
import { queryKeys } from '@shared/lib/query/queryKeys';
import type { OhlcRow } from '@shared/types/coingecko';

export function useCoinOhlc(id: string, days: number) {
  return useQuery({
    queryKey: queryKeys.coinOhlc(id, days),
    enabled: id.length > 0,
    staleTime: 5 * 60_000,
    queryFn: async ({ signal }) => {
      const rows = await cgFetch<OhlcRow[]>(cgEndpoints.coinOhlc(id, days), signal);
      const byTime = new Map<number, CandlestickData>();
      for (const [ms, open, high, low, close] of rows) {
        const time = Math.floor(ms / 1000) as UTCTimestamp;
        byTime.set(time, { time, open, high, low, close });
      }
      return [...byTime.values()].sort((a, b) => (a.time as number) - (b.time as number));
    },
  });
}
