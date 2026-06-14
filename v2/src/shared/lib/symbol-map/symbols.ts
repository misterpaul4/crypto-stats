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

export function baseSymbol(coinSymbol: string): string {
  return coinSymbol.toUpperCase();
}

export function coinbaseProduct(base: string): string {
  return `${base}-USD`;
}
