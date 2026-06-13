import type { ExchangeAdapter, Ticker } from '../types';

/** Read a string field off an unknown object without `any`. */
function str(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const v = (obj as Record<string, unknown>)[key];
  return typeof v === 'string' ? v : undefined;
}

/**
 * Binance spot — one persistent connection to `!miniTicker@arr` carries the WHOLE
 * market in a single subscription (no SUBSCRIBE frames, sidesteps the 5-msg/s and
 * 1024-stream caps). The frame is a JSON ARRAY; parsing it as a single object would
 * silently drop every catalogue tick — so we always iterate an array.
 */
export const binanceAdapter: ExchangeAdapter = {
  name: 'binance',
  url: () => 'wss://stream.binance.com:9443/ws/!miniTicker@arr',
  parse(raw, keep) {
    let msg: unknown;
    try {
      msg = JSON.parse(raw);
    } catch {
      return [];
    }
    // Handle all three wire shapes: bare array, {stream,data} envelope, bare object.
    const items: unknown[] = Array.isArray(msg)
      ? msg
      : Array.isArray((msg as { data?: unknown })?.data)
        ? ((msg as { data: unknown[] }).data)
        : [msg];

    const out: Ticker[] = [];
    const now = Date.now();
    for (const item of items) {
      const s = str(item, 's'); // e.g. BTCUSDT
      const c = str(item, 'c'); // last price
      if (!s || !c || !s.endsWith('USDT')) continue;
      const base = s.slice(0, -4);
      if (!keep.has(base)) continue;
      const price = Number.parseFloat(c);
      if (!Number.isFinite(price)) continue;
      out.push({ symbol: base, price, ts: now, source: 'binance' });
    }
    return out;
  },
};
