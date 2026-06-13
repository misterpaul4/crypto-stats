import { QueryClient } from '@tanstack/react-query';
import type { CgError } from '@shared/lib/api/cgFetch';

/**
 * One tuned QueryClient. Long staleTime (markets-class data is server-cached
 * ~15 min upstream), no window-focus refetch (the #1 cause of silent 429 storms),
 * a 429-aware retry, and a single coordinated backoff via retryDelay.
 */
export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60_000,
        gcTime: 1000 * 60 * 60 * 24, // resident long enough for the persister to dehydrate
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const status = (error as CgError)?.status;
          if (status === 429) return failureCount < 3;
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
        retryDelay: (failureCount, error) =>
          (error as CgError)?.retryAfterMs ?? Math.min(1000 * 2 ** failureCount, 30_000),
      },
    },
  });
}
