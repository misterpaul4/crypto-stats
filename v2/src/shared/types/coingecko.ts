/**
 * Curated CoinGecko response types. Hand-written for the slice; P1 replaces these
 * with `openapi-typescript`-generated types + curated aliases.
 */

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { thumb: string; small: string; large: string };
  description: { en: string };
  market_cap_rank: number;
  market_data: {
    current_price: Record<string, number>;
    price_change_percentage_24h: number | null;
    price_change_percentage_7d: number | null;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    high_24h: Record<string, number>;
    low_24h: Record<string, number>;
    circulating_supply: number | null;
    ath: Record<string, number>;
  };
}

/** CoinGecko OHLC row: [timestamp_ms, open, high, low, close]. */
export type OhlcRow = [number, number, number, number, number];

export interface Exchange {
  id: string;
  name: string;
  image: string;
  trust_score: number | null;
  trust_score_rank: number | null;
  trade_volume_24h_btc: number;
  country: string | null;
  year_established: number | null;
  url: string;
}
