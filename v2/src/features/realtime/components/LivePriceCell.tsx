import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useRealtimeStore } from '@features/realtime/store/realtime.store';
import { formatPrice } from '@shared/lib/format';
import styles from './LivePriceCell.module.css';

interface Props {
  /** Canonical base symbol (e.g. BTC) if this coin maps to a live feed. */
  symbol?: string;
  fallbackPrice: number;
}

/**
 * Renders the live tick if one exists for `symbol`, otherwise the REST snapshot
 * (single source of truth per ARCHITECTURE §4.1). A coin is "live" only when a
 * ticker exists AND its source isn't 'snapshot' — so a snapshot-only coin shows a
 * subtle badge and never flashes. Flash logic captures the previous value BEFORE
 * mutating the ref and restarts the keyframe via a `tick` key.
 */
export const LivePriceCell = memo(function LivePriceCell({ symbol, fallbackPrice }: Props) {
  const ticker = useRealtimeStore((s) => (symbol ? s.bySymbol[symbol] : undefined));
  const isLive = ticker != null && ticker.source !== 'snapshot';
  const price = ticker?.price ?? fallbackPrice;

  const prevRef = useRef(price);
  const [dir, setDir] = useState<'up' | 'down' | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const prev = prevRef.current;
    if (price === prev) return;
    setDir(price > prev ? 'up' : 'down');
    setTick((n) => n + 1);
    prevRef.current = price;
  }, [price]);

  return (
    <span
      key={tick}
      aria-live="off"
      onAnimationEnd={() => setDir(null)}
      className={clsx(
        styles.cell,
        'mono',
        isLive && dir === 'up' && styles.flashUp,
        isLive && dir === 'down' && styles.flashDown,
      )}
      title={symbol && !isLive ? 'snapshot price (no live feed)' : undefined}
    >
      {formatPrice(price)}
      {symbol && !isLive && <span className={styles.badge} aria-label="snapshot, not live" />}
    </span>
  );
});
