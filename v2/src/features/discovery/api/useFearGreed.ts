import { useQuery } from '@tanstack/react-query';
import { jsonFetch } from '@shared/lib/api/jsonFetch';
import { queryKeys } from '@shared/lib/query/queryKeys';
import type { FngResponse } from '@shared/types/fng';

const FNG_URL = 'https://api.alternative.me/fng/?limit=30';

export function useFearGreed() {
  return useQuery({
    queryKey: queryKeys.fearGreed(),
    queryFn: ({ signal }) => jsonFetch<FngResponse>(FNG_URL, signal),
    staleTime: 60 * 60_000,
    select: (res) => {
      if (res.metadata.error) throw new Error(res.metadata.error);
      const latest = res.data[0];

      const spark = [...res.data].reverse().map((e) => Number(e.value));
      return {
        value: latest ? Number(latest.value) : null,
        classification: latest?.value_classification ?? null,
        spark,
      };
    },
  });
}
