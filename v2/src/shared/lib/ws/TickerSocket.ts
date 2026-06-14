import type { ConnectionState, ExchangeAdapter, Ticker } from './types';
import { binanceAdapter } from './exchanges/binance';
import { coinbaseAdapter } from './exchanges/coinbase';

type FlushFn = (batch: Record<string, Ticker>, state: ConnectionState) => void;

const BASE_BACKOFF = 500;
const MAX_BACKOFF = 30_000;
const PROACTIVE_MS = 23 * 60 * 60 * 1000;
const STALE_MS = 20_000;
const FAST_CLOSE_MS = 2000;
const FAST_CLOSE_LIMIT = 3;
const MAX_ATTEMPTS_BEFORE_OFFLINE = 8;

export class TickerSocket {
  private readonly flush: FlushFn;
  private ws: WebSocket | null = null;
  private state: ConnectionState = 'idle';
  private pendingState: ConnectionState | null = null;
  private attempt = 0;
  private fastCloses = 0;
  private buffer = new Map<string, Ticker>();
  private rafId: number | null = null;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private watchdogId: ReturnType<typeof setInterval> | null = null;
  private lastTickAt = 0;
  private connectedAt = 0;
  private adapter: ExchangeAdapter = binanceAdapter;
  private keep = new Set<string>();
  private products: string[] = [];
  private destroyed = false;

  constructor(flush: FlushFn) {
    this.flush = flush;
    document.addEventListener('visibilitychange', this.onVisibility);
    this.watchdogId = setInterval(this.watchdog, STALE_MS);
  }

  setUniverse(keep: Set<string>, products: string[]): void {
    this.keep = keep;
    this.products = products;
  }

  start(): void {
    this.ensureOpen();
  }

  private ensureOpen(): void {
    if (this.destroyed || this.ws || document.hidden || this.keep.size === 0) return;
    this.setState(this.attempt > 0 ? 'reconnecting' : 'connecting');
    const ws = new WebSocket(this.adapter.url());
    this.ws = ws;
    this.connectedAt = Date.now();

    ws.onopen = () => {
      this.attempt = 0;
      this.fastCloses = 0;
      this.adapter.onOpen?.(ws, this.products);
      this.setState('live');
      this.armProactiveReconnect();
    };
    ws.onmessage = (e) => {
      const data = typeof e.data === 'string' ? e.data : '';
      const tickers = this.adapter.parse(data, this.keep);
      if (tickers.length === 0) return;
      for (const t of tickers) this.buffer.set(t.symbol, t);
      this.lastTickAt = Date.now();
      this.scheduleFlush();
    };
    ws.onclose = () => this.handleDrop();
    ws.onerror = () => ws.close();
  }

  private setState(s: ConnectionState): void {
    this.pendingState = s;
    if (s === 'degraded' || s === 'offline') this.commitNow();
    else this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.rafId != null) return;
    const commit = () => {
      this.rafId = null;
      this.commitNow();
    };
    this.rafId =
      typeof requestAnimationFrame !== 'undefined'
        ? requestAnimationFrame(commit)
        : (this.track(setTimeout(commit, 250)) as unknown as number);
  }

  private commitNow(): void {
    const state = this.pendingState ?? this.state;
    this.pendingState = null;
    if (this.buffer.size === 0 && state === this.state) return;
    const batch = Object.fromEntries(this.buffer);
    this.buffer.clear();
    this.state = state;
    this.flush(batch, state);
  }

  private handleDrop(): void {
    const fast = Date.now() - this.connectedAt < FAST_CLOSE_MS;
    this.cleanupSocket();
    if (this.destroyed) return;
    if (document.hidden) {
      this.setState('paused');
      return;
    }
    if (fast && (this.fastCloses += 1) >= FAST_CLOSE_LIMIT) {
      this.failover();
      return;
    }
    this.scheduleReconnect();
  }

  private failover(): void {
    this.adapter = this.adapter.name === 'binance' ? coinbaseAdapter : binanceAdapter;
    this.attempt = 0;
    this.fastCloses = 0;
    this.ensureOpen();
  }

  private scheduleReconnect(): void {
    this.attempt += 1;
    const expo = Math.min(MAX_BACKOFF, BASE_BACKOFF * 2 ** this.attempt);
    const jitter = Math.random() * expo;
    this.setState(this.attempt >= MAX_ATTEMPTS_BEFORE_OFFLINE ? 'offline' : 'reconnecting');
    this.track(setTimeout(() => this.ensureOpen(), jitter));
  }

  private armProactiveReconnect(): void {
    this.track(
      setTimeout(() => {
        this.cleanupSocket();
        this.ensureOpen();
      }, PROACTIVE_MS),
    );
  }

  private watchdog = (): void => {
    if (this.state === 'live' && this.lastTickAt > 0 && Date.now() - this.lastTickAt > STALE_MS) {
      this.setState('degraded');
      this.cleanupSocket();
      this.scheduleReconnect();
    }
  };

  private onVisibility = (): void => {
    if (document.hidden) {
      this.cleanupSocket();
      this.setState('paused');
    } else {
      this.attempt = 0;
      this.ensureOpen();
    }
  };

  private cleanupSocket(): void {
    if (!this.ws) return;
    this.ws.onopen = null;
    this.ws.onmessage = null;
    this.ws.onclose = null;
    this.ws.onerror = null;
    try {
      this.ws.close();
    } catch {

    }
    this.ws = null;
  }

  private track(id: ReturnType<typeof setTimeout>): ReturnType<typeof setTimeout> {
    this.timers.add(id);
    return id;
  }

  destroy(): void {
    this.destroyed = true;
    document.removeEventListener('visibilitychange', this.onVisibility);
    if (this.watchdogId) clearInterval(this.watchdogId);
    if (this.rafId != null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
    }
    for (const t of this.timers) clearTimeout(t);
    this.timers.clear();
    this.cleanupSocket();
  }
}
