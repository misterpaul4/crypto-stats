/**
 * v1 symbol mapping: derive exchange symbols heuristically from a coin's ticker.
 * No Binance `exchangeInfo` fetch needed (also avoids its US geo-block) — the
 * all-market stream simply never sends ticks for a symbol that doesn't trade, so
 * an invalid guess harmlessly falls back to the snapshot price.
 *
 * P-later replaces this with a validated, IndexedDB-cached join.
 */

/** Stablecoins (~$1) — skip live feeds; they have no USDT pair and don't move. */
export const STABLECOINS = new Set<string>([
  'USDT',
  'USDC',
  'DAI',
  'BUSD',
  'TUSD',
  'FDUSD',
  'USDD',
  'USDE',
  'PYUSD',
]);

/** A coin's canonical base symbol — the key used in the realtime store. */
export function baseSymbol(coinSymbol: string): string {
  return coinSymbol.toUpperCase();
}

/** Coinbase product id for the failover subscription, e.g. BTC -> BTC-USD. */
export function coinbaseProduct(base: string): string {
  return `${base}-USD`;
}
