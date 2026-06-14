import { describe, it, expect } from 'vitest';
import { binanceAdapter } from './binance';

const keep = new Set(['BTC', 'ETH']);

describe('binanceAdapter.parse', () => {
  it('parses a !miniTicker@arr ARRAY frame — the bug that silently dropped every catalogue tick', () => {
    const frame = JSON.stringify([
      { e: '24hrMiniTicker', s: 'BTCUSDT', c: '64000.5' },
      { e: '24hrMiniTicker', s: 'ETHUSDT', c: '1700.25' },
      { e: '24hrMiniTicker', s: 'DOGEUSDT', c: '0.12' },
    ]);
    const out = binanceAdapter.parse(frame, keep);
    expect(out).toHaveLength(2);
    expect(out.map((t) => t.symbol)).toEqual(['BTC', 'ETH']);
    expect(out[0]).toMatchObject({ symbol: 'BTC', price: 64000.5, source: 'binance' });
  });

  it('handles the {stream,data} envelope shape', () => {
    const frame = JSON.stringify({ stream: '!miniTicker@arr', data: [{ s: 'BTCUSDT', c: '50000' }] });
    expect(binanceAdapter.parse(frame, keep)).toHaveLength(1);
  });

  it('handles a bare single-object frame', () => {
    const frame = JSON.stringify({ s: 'ETHUSDT', c: '1800' });
    const out = binanceAdapter.parse(frame, keep);
    expect(out).toEqual([{ symbol: 'ETH', price: 1800, source: 'binance', ts: expect.any(Number) }]);
  });

  it('filters non-USDT pairs and symbols outside the keep set', () => {
    const frame = JSON.stringify([
      { s: 'ETHBTC', c: '0.05' },
      { s: 'XRPUSDT', c: '1.1' },
    ]);
    expect(binanceAdapter.parse(frame, keep)).toHaveLength(0);
  });

  it('returns [] on malformed JSON instead of throwing', () => {
    expect(binanceAdapter.parse('not json', keep)).toEqual([]);
  });

  it('skips entries with non-finite prices', () => {
    const frame = JSON.stringify([{ s: 'BTCUSDT', c: 'NaN' }]);
    expect(binanceAdapter.parse(frame, keep)).toEqual([]);
  });
});
