import { memo } from 'react';
import { Button } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { useWatchlistStore } from '../store/watchlist.store';

/** Star toggle. stopPropagation so it doesn't trigger the row's navigation. */
export const WatchlistStar = memo(function WatchlistStar({ coinId }: { coinId: string }) {
  const active = useWatchlistStore((s) => s.ids.includes(coinId));
  const toggle = useWatchlistStore((s) => s.toggle);

  return (
    <Button
      type="text"
      size="small"
      aria-label={active ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={active}
      onClick={(e) => {
        e.stopPropagation();
        toggle(coinId);
      }}
      icon={
        active ? <StarFilled style={{ color: '#f5a623' }} /> : <StarOutlined style={{ opacity: 0.45 }} />
      }
    />
  );
});
