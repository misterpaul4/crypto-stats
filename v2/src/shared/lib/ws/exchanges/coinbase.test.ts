import { describe, it, expect } from 'vitest';
import { coinbaseAdapter } from './coinbase';

const keep = new Set(['BTC', 'ETH']);

describe('coinbaseAdapter.parse', () => {
  it('parses a ticker message into a base-symbol Ticker', () => {
    const frame = JSON.stringify({ type: 'ticker', product_id: 'BTC-USD', price: '64000.50' });
    expect(coinbaseAdapter.parse(frame, keep)).toEqual([
      { symbol: 'BTC', price: 64000.5, source: 'coinbase', ts: expect.any(Number) },
    ]);
  });

  it('ignores non-ticker messages (e.g. subscription acks)', () => {
    const frame = JSON.stringify({ type: 'subscriptions', channels: [] });
    expect(coinbaseAdapter.parse(frame, keep)).toEqual([]);
  });

  it('ignores products outside the keep set', () => {
    const frame = JSON.stringify({ type: 'ticker', product_id: 'XRP-USD', price: '1' });
    expect(coinbaseAdapter.parse(frame, keep)).toEqual([]);
  });

  it('builds a USD subscribe frame on open', () => {
    let sent = '';
    const fakeWs = { send: (msg: string) => (sent = msg) } as unknown as WebSocket;
    coinbaseAdapter.onOpen?.(fakeWs, ['BTC-USD', 'ETH-USD']);
    expect(JSON.parse(sent)).toEqual({
      type: 'subscribe',
      product_ids: ['BTC-USD', 'ETH-USD'],
      channels: ['ticker'],
    });
  });
});
