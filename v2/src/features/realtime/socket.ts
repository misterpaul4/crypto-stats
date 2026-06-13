import { TickerSocket } from '@shared/lib/ws/TickerSocket';
import { useRealtimeStore } from './store/realtime.store';

/**
 * Module-singleton socket. Lives outside React so it survives StrictMode and route
 * changes; flushes batches straight into the store. Disposed on HMR so dev never
 * leaks sockets.
 */
export const tickerSocket = new TickerSocket((batch, state) => {
  useRealtimeStore.getState().commit(batch, state);
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => tickerSocket.destroy());
}
