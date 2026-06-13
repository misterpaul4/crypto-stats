/** DeFiLlama types (curl-verified). All USD values are plain dollars. */

/** api.llama.fi/v2/historicalChainTvl — `date` is UNIX SECONDS, `tvl` is USD. */
export interface LlamaTvlPoint {
  date: number;
  tvl: number;
}
export type LlamaHistoricalChainTvl = LlamaTvlPoint[];

/** Balances keyed by pegType ('peggedUSD' | 'peggedEUR' | …); values in the peg currency. */
export type PeggedBalance = Record<string, number | undefined>;

export interface PeggedAsset {
  id: string;
  name: string;
  symbol: string;
  circulating: PeggedBalance;
  circulatingPrevDay: PeggedBalance;
}

export interface StablecoinsResponse {
  peggedAssets: PeggedAsset[];
}
