import type { ExchangeAdapter } from '../types';

function str(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const v = (obj as Record<string, unknown>)[key];
  return typeof v === 'string' ? v : undefined;
}

export const coinbaseAdapter: ExchangeAdapter = {
  name: 'coinbase',
  url: () => 'wss://ws-feed.exchange.coinbase.com',
  onOpen(ws, products) {
    if (products.length === 0) return;
    ws.send(JSON.stringify({ type: 'subscribe', product_ids: products, channels: ['ticker'] }));
  },
  parse(raw, keep) {
    let msg: unknown;
    try {
      msg = JSON.parse(raw);
    } catch {
      return [];
    }
    if (str(msg, 'type') !== 'ticker') return [];
    const pid = str(msg, 'product_id');
    const p = str(msg, 'price');
    if (!pid || !p || !pid.endsWith('-USD')) return [];
    const base = pid.slice(0, -4);
    if (!keep.has(base)) return [];
    const price = Number.parseFloat(p);
    if (!Number.isFinite(price)) return [];
    return [{ symbol: base, price, ts: Date.now(), source: 'coinbase' }];
  },
};
