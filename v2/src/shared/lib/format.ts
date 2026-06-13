/** Number/price/percent formatting. Crypto-aware: handles sub-cent prices and large caps. */

const compactFmt = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

/** Price with adaptive precision — sub-$1 coins (SHIB) need more decimals than BTC. */
export function formatPrice(value: number | null | undefined, currency = '$'): string {
  if (value == null || Number.isNaN(value)) return '—';
  let digits: number;
  if (value >= 1000) digits = 2;
  else if (value >= 1) digits = 2;
  else if (value >= 0.01) digits = 4;
  else digits = 8;
  return (
    currency +
    value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
  );
}

/** Compact large numbers: 1.2B, 845M. */
export function formatCompact(value: number | null | undefined, currency = ''): string {
  if (value == null || Number.isNaN(value)) return '—';
  return currency + compactFmt.format(value);
}

/** Signed percentage: +2.34% / -1.10%. */
export function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
