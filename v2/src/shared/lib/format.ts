const compactFmt = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

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

export function formatCompact(value: number | null | undefined, currency = ''): string {
  if (value == null || Number.isNaN(value)) return '—';
  return currency + compactFmt.format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
