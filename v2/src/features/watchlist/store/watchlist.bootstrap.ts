import { useWatchlistStore } from './watchlist.store';

const LEGACY_KEY = 'favourites';
let done = false;

export function readLegacyFavourites(): string[] {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === 'string');
    }
  } catch {

  }
  return [];
}

export function bootstrapLegacyWatchlist(): void {
  if (done) return;
  done = true;

  const store = useWatchlistStore.getState();
  if (store.ids.length > 0) return;

  const ids = readLegacyFavourites();
  if (ids.length > 0) store.setAll(ids);
}
