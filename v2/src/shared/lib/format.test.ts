import { describe, it, expect } from 'vitest';
import { formatPrice, formatCompact, formatPercent } from './format';

describe('formatPrice', () => {
  it('uses 2 decimals for prices >= 1', () => {
    expect(formatPrice(64000)).toBe('$64,000.00');
    expect(formatPrice(1.5)).toBe('$1.50');
  });
  it('uses more decimals for sub-cent prices', () => {
    expect(formatPrice(0.00001234)).toBe('$0.00001234');
  });
  it('renders an em dash for nullish/NaN', () => {
    expect(formatPrice(null)).toBe('—');
    expect(formatPrice(undefined)).toBe('—');
    expect(formatPrice(NaN)).toBe('—');
  });
});

describe('formatCompact', () => {
  it('compacts large numbers', () => {
    expect(formatCompact(1_280_000_000, '$')).toBe('$1.28B');
    expect(formatCompact(845_000_000)).toBe('845M');
  });
  it('renders an em dash for nullish', () => {
    expect(formatCompact(null)).toBe('—');
  });
});

describe('formatPercent', () => {
  it('signs and fixes to 2 decimals', () => {
    expect(formatPercent(2.5)).toBe('+2.50%');
    expect(formatPercent(-1.1)).toBe('-1.10%');
    expect(formatPercent(0)).toBe('0.00%');
  });
  it('renders an em dash for nullish', () => {
    expect(formatPercent(null)).toBe('—');
  });
});
