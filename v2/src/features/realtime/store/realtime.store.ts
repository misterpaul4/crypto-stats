import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ConnectionState, Ticker } from '@shared/lib/ws/types';

interface RealtimeState {
  bySymbol: Record<string, Ticker>;
  connectionState: ConnectionState;
  /** Apply a coalesced batch of ticks + the latest connection state in one commit. */
  commit: (batch: Record<string, Ticker>, state: ConnectionState) => void;
  /** Seed missing keys only — never overwrite a live ref (preserves ref stability). */
  seed: (tickers: Ticker[]) => void;
}

/**
 * The live-price store. A flat `Record<base, Ticker>` read by per-symbol selectors
 * so only ticked cells re-render. The TickerSocket engine is the sole writer.
 */
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
