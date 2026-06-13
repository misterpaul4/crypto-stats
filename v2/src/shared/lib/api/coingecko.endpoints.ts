/** Builders for the CoinGecko REST paths we consume (relative to /api/v3). */

export type VsCurrency = 'usd' | 'eur' | 'btc' | 'eth';

export const cgEndpoints = {
  markets: (vs: VsCurrency = 'usd', perPage = 100) =>
    `/coins/markets?vs_currency=${vs}` +
    `&order=market_cap_desc&per_page=${perPage}&page=1` +
    `&sparkline=true&price_change_percentage=24h%2C7d`,

  coin: (id: string) =>
    `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,

  /** Candlestick OHLC. days ∈ 1|7|14|30|90|180|365; granularity is auto (free tier). */
  coinOhlc: (id: string, days: number, vs: VsCurrency = 'usd') =>
    `/coins/${id}/ohlc?vs_currency=${vs}&days=${days}`,

  exchanges: (perPage = 100) => `/exchanges?per_page=${perPage}`,

  trending: () => `/search/trending`,
  search: (query: string) => `/search?query=${encodeURIComponent(query)}`,
} as const;
