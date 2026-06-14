import { QueryClient } from '@tanstack/react-query';
import type { CgError } from '@shared/lib/api/cgFetch';

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60_000,
        gcTime: 1000 * 60 * 60 * 24,
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
