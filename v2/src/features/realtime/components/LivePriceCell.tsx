import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useRealtimeStore } from '@features/realtime/store/realtime.store';
import { formatPrice } from '@shared/lib/format';
import styles from './LivePriceCell.module.css';

interface Props {

  symbol?: string;
  fallbackPrice: number;
}

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
