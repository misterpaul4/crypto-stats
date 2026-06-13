import { get, set, del } from 'idb-keyval';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

/**
 * Async persister backed by IndexedDB (idb-keyval). IndexedDB is async and
 * off the main thread, unlike localStorage — so we use the *async* persister.
 * Hydrating this on boot gives instant stale-while-revalidate.
 */
export const idbPersister = createAsyncStoragePersister({
  key: 'cs-query-cache',
  storage: {
    getItem: (key) => get(key),
    setItem: (key, value) => set(key, value),
    removeItem: (key) => del(key),
  },
});
