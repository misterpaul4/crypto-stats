export interface LlamaTvlPoint {
  date: number;
  tvl: number;
}
export type LlamaHistoricalChainTvl = LlamaTvlPoint[];

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
