import { describe, it, expect, beforeEach } from 'vitest';
import { useWatchlistStore } from './watchlist.store';
import { readLegacyFavourites, bootstrapLegacyWatchlist } from './watchlist.bootstrap';

beforeEach(() => {
  useWatchlistStore.setState({ ids: [] });
  localStorage.clear();
});

describe('watchlist store', () => {
  it('toggles, adds and removes ids', () => {
    const s = useWatchlistStore.getState();
    s.toggle('bitcoin');
    expect(useWatchlistStore.getState().ids).toEqual(['bitcoin']);
    s.toggle('bitcoin');
    expect(useWatchlistStore.getState().ids).toEqual([]);
    s.add('ethereum');
    s.add('ethereum'); // idempotent
    expect(useWatchlistStore.getState().ids).toEqual(['ethereum']);
    s.remove('ethereum');
    expect(useWatchlistStore.getState().ids).toEqual([]);
  });
});

describe('legacy favourites migration', () => {
  it('reads a valid string[] blob', () => {
    localStorage.setItem('favourites', JSON.stringify(['bitcoin', 'ethereum']));
    expect(readLegacyFavourites()).toEqual(['bitcoin', 'ethereum']);
  });
  it('returns [] for a malformed blob without throwing', () => {
    localStorage.setItem('favourites', '{not json');
    expect(readLegacyFavourites()).toEqual([]);
  });
  it('filters out non-string entries', () => {
    localStorage.setItem('favourites', JSON.stringify(['bitcoin', 42, null, 'solana']));
    expect(readLegacyFavourites()).toEqual(['bitcoin', 'solana']);
  });
  it('folds the legacy list into an empty watchlist', () => {
    localStorage.setItem('favourites', JSON.stringify(['bitcoin', 'solana']));
    bootstrapLegacyWatchlist();
    expect(useWatchlistStore.getState().ids).toEqual(['bitcoin', 'solana']);
  });
});
