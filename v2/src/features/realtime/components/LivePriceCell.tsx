import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useRealtimeStore } from '@features/realtime/store/realtime.store';
import { formatPrice } from '@shared/lib/format';
import styles from './LivePriceCell.module.css';

interface Props {
  /** Canonical exchange symbol, if this coin maps to a live feed. Omit for snapshot-only. */
  symbol?: string;
  fallbackPrice: number;
}

/**
 * Renders the live tick if one exists for `symbol`, otherwise the REST snapshot
 * (single source of truth per ARCHITECTURE §4.1). Flashes green/up or red/down on
 * change. The flash logic captures the previous value BEFORE mutating the ref and
 * restarts the keyframe via a `tick` key so repeated same-direction ticks replay.
 */
export const LivePriceCell = memo(function LivePriceCell({ symbol, fallbackPrice }: Props) {
  const live = useRealtimeStore((s) => (symbol ? s.bySymbol[symbol]?.price : undefined));
  const isLive = live != null;
  const price = live ?? fallbackPrice;

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
      title={symbol && !isLive ? 'snapshot price (not yet live)' : undefined}
    >
      {formatPrice(price)}
      {symbol && !isLive && <span className={styles.badge} aria-label="snapshot, not live" />}
    </span>
  );
});
