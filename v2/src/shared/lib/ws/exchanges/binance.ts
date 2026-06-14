import type { ExchangeAdapter, Ticker } from '../types';

function str(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const v = (obj as Record<string, unknown>)[key];
  return typeof v === 'string' ? v : undefined;
}

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

    const items: unknown[] = Array.isArray(msg)
      ? msg
      : Array.isArray((msg as { data?: unknown })?.data)
        ? ((msg as { data: unknown[] }).data)
        : [msg];

    const out: Ticker[] = [];
    const now = Date.now();
    for (const item of items) {
      const s = str(item, 's');
      const c = str(item, 'c');
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
