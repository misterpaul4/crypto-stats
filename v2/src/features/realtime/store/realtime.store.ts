import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type TickerSource = 'binance' | 'coinbase' | 'snapshot';

export interface Ticker {
  symbol: string; // canonical exchange-qualified key, e.g. BINANCE:BTCUSDT
  price: number;
  changePct24h?: number;
  ts: number; // last live update (ms)
  source: TickerSource;
}

interface RealtimeState {
  bySymbol: Record<string, Ticker>;
  /** Bulk-apply a coalesced batch of ticks (one commit per animation frame). */
  applyBatch: (batch: Record<string, Ticker>) => void;
  /** Seed missing keys only — never overwrite a live ref (preserves ref stability). */
  seed: (tickers: Ticker[]) => void;
}

/**
 * The live-price store. Flat `Record<symbol, Ticker>` read by per-symbol selectors
 * so only ticked cells re-render. The WebSocket engine (P4) is the sole writer of
 * live ticks; until then this stays seeded with snapshots and overlays nothing.
 */
export const useRealtimeStore = create<RealtimeState>()(
  subscribeWithSelector((set) => ({
    bySymbol: {},
    applyBatch: (batch) =>
      set((state) => ({ bySymbol: { ...state.bySymbol, ...batch } })),
    seed: (tickers) =>
      set((state) => {
        const next = { ...state.bySymbol };
        for (const t of tickers) {
          if (!next[t.symbol]) next[t.symbol] = t; // missing keys only
        }
        return { bySymbol: next };
      }),
  })),
);
