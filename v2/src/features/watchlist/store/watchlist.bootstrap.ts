import { useWatchlistStore } from './watchlist.store';

const LEGACY_KEY = 'favourites'; // the old CRA app's localStorage key (a string[] of coin ids)
let done = false;

/**
 * One-time fold of the legacy `favourites` array into the watchlist, done OUTSIDE
 * persist.migrate (which never fires for users with no `cs-watchlist` blob). Only
 * runs when the watchlist is empty; leaves the legacy key intact for one release as
 * a rollback net. Note: localStorage is origin-scoped, so this only migrates data
 * when the new app is served from the same origin as the old one (i.e. in prod).
 */
export function bootstrapLegacyWatchlist(): void {
  if (done) return;
  done = true;

  const store = useWatchlistStore.getState();
  if (store.ids.length > 0) return;

  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) {
      const ids = parsed.filter((x): x is string => typeof x === 'string');
      if (ids.length > 0) store.setAll(ids);
    }
  } catch {
    /* defensive: ignore a malformed legacy blob */
  }
}
