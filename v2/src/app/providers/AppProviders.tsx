import { useState, type ReactNode } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAppQueryClient } from '@app/lib/queryClient';
import { idbPersister } from '@shared/lib/query/persister';
import { ThemeProvider } from '@app/theme/ThemeProvider';
import { AppErrorBoundary } from '@app/error/AppErrorBoundary';
import { env } from '@app/config/env';

const MONTH_MS = 1000 * 60 * 60 * 24;

export function AppProviders({ children }: { children: ReactNode }) {
  // One client per app instance (StrictMode-safe via lazy init).
  const [queryClient] = useState(createAppQueryClient);

  return (
    <ThemeProvider>
      <AppErrorBoundary>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: idbPersister,
            // buster/maxAge belong on the provider, not the persister.
            buster: env.VITE_CACHE_VERSION,
            maxAge: MONTH_MS, // hard ceiling; per-query freshness handled by staleTime
          }}
        >
          {children}
        </PersistQueryClientProvider>
      </AppErrorBoundary>
    </ThemeProvider>
  );
}
