import { TickerSocket } from '@shared/lib/ws/TickerSocket';
import { useRealtimeStore } from './store/realtime.store';

export const tickerSocket = new TickerSocket((batch, state) => {
  useRealtimeStore.getState().commit(batch, state);
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => tickerSocket.destroy());
}
