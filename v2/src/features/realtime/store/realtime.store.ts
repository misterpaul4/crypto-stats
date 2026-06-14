import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ConnectionState, Ticker } from '@shared/lib/ws/types';

interface RealtimeState {
  bySymbol: Record<string, Ticker>;
  connectionState: ConnectionState;

  commit: (batch: Record<string, Ticker>, state: ConnectionState) => void;

  seed: (tickers: Ticker[]) => void;
}

export const useRealtimeStore = create<RealtimeState>()(
  subscribeWithSelector((set) => ({
    bySymbol: {},
    connectionState: 'idle',
    commit: (batch, state) =>
      set((s) => ({
        bySymbol: Object.keys(batch).length ? { ...s.bySymbol, ...batch } : s.bySymbol,
        connectionState: state,
      })),
    seed: (tickers) =>
      set((s) => {
        const next = { ...s.bySymbol };
        for (const t of tickers) if (!next[t.symbol]) next[t.symbol] = t;
        return { bySymbol: next };
      }),
  })),
);
