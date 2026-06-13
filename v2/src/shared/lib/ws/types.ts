export type ConnectionState =
  | 'idle'
  | 'connecting'
  | 'live'
  | 'reconnecting'
  | 'paused'
  | 'degraded'
  | 'offline';

export type TickerSource = 'binance' | 'coinbase' | 'snapshot';

export interface Ticker {
  /** Normalized base symbol, uppercased — e.g. BTC, ETH. The store key. */
  symbol: string;
  price: number;
  ts: number; // last update (ms epoch)
  source: TickerSource;
}

export interface ExchangeAdapter {
  name: Exclude<TickerSource, 'snapshot'>;
  /** The WebSocket URL for this exchange's stream. */
  url(): string;
  /** Sent once on open (e.g. Coinbase needs an explicit subscribe frame). */
  onOpen?(ws: WebSocket, products: string[]): void;
  /**
   * Parse one raw frame into base-symbol tickers, filtered to `keep`.
   * Filtering here (not downstream) avoids allocating Ticker objects for the
   * thousands of pairs in Binance's all-market stream.
   */
  parse(raw: string, keep: Set<string>): Ticker[];
}
