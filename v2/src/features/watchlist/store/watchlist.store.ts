import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistState {
  /** CoinGecko coin ids, insertion order preserved. */
  ids: string[];
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  setAll: (ids: string[]) => void;
  clear: () => void;
}

/**
 * Persisted watchlist. `version` is reserved for future shape changes; legacy
 * `favourites` migration is handled OUTSIDE persist.migrate (see bootstrap) —
 * migrate never runs for users who have no blob under this store's key.
 */
export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      setAll: (ids) => set({ ids }),
      clear: () => set({ ids: [] }),
    }),
    { name: 'cs-watchlist', version: 1 },
  ),
);
