/** Builders for the CoinGecko REST paths we consume (relative to /api/v3). */

export type VsCurrency = 'usd' | 'eur' | 'btc' | 'eth';

export const cgEndpoints = {
  markets: (vs: VsCurrency = 'usd', perPage = 100) =>
    `/coins/markets?vs_currency=${vs}` +
    `&order=market_cap_desc&per_page=${perPage}&page=1` +
    `&sparkline=true&price_change_percentage=24h%2C7d`,

  coin: (id: string) => `/coins/${id}?localization=false&tickers=false&sparkline=true`,

  exchanges: (perPage = 100) => `/exchanges?per_page=${perPage}`,
} as const;
