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

  symbol: string;
  price: number;
  ts: number;
  source: TickerSource;
}

export interface ExchangeAdapter {
  name: Exclude<TickerSource, 'snapshot'>;

  url(): string;

  onOpen?(ws: WebSocket, products: string[]): void;

  parse(raw: string, keep: Set<string>): Ticker[];
}
