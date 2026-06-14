import { useEffect, useState, type ReactNode } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { bootstrapLegacyWatchlist } from '@features/watchlist/store/watchlist.bootstrap';
import { createAppQueryClient } from '@app/lib/queryClient';
import { idbPersister } from '@shared/lib/query/persister';
import { ThemeProvider } from '@app/theme/ThemeProvider';
import { AppErrorBoundary } from '@app/error/AppErrorBoundary';
import { RealtimeProvider } from '@features/realtime/RealtimeProvider';
import { env } from '@app/config/env';

const MONTH_MS = 1000 * 60 * 60 * 24;

export function AppProviders({ children }: { children: ReactNode }) {

  const [queryClient] = useState(createAppQueryClient);

  useEffect(() => {
    bootstrapLegacyWatchlist();
  }, []);

  return (
    <ThemeProvider>
      <AppErrorBoundary>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: idbPersister,

            buster: env.VITE_CACHE_VERSION,
            maxAge: MONTH_MS,
          }}
        >
          <RealtimeProvider>{children}</RealtimeProvider>
        </PersistQueryClientProvider>
      </AppErrorBoundary>
    </ThemeProvider>
  );
}
