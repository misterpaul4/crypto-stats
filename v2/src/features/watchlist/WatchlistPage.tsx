import { Button, Empty, Skeleton, Space, Typography } from 'antd';
import { Link } from '@tanstack/react-router';
import { useMarkets } from '@features/catalogue/api/useMarkets';
import { MarketTable } from '@features/catalogue/MarketTable';
import { useWatchlistStore } from './store/watchlist.store';

export function WatchlistPage() {
  const ids = useWatchlistStore((s) => s.ids);
  const { data, isLoading } = useMarkets('usd', 100);
  const coins = (data ?? []).filter((c) => ids.includes(c.id));

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Watchlist
        </Typography.Title>
        <Typography.Text type="secondary">
          {ids.length} coin{ids.length === 1 ? '' : 's'} saved
        </Typography.Text>
      </div>

      {isLoading && !data ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : ids.length === 0 ? (
        <Empty description="No coins in your watchlist yet" style={{ marginTop: 64 }}>
          <Link to="/">
            <Button type="primary">Browse the market</Button>
          </Link>
        </Empty>
      ) : coins.length === 0 ? (
        <Empty
          description="Your saved coins aren't in the top 100 — full watchlist lookup is coming soon"
          style={{ marginTop: 64 }}
        />
      ) : (
        <MarketTable data={coins} />
      )}
    </Space>
  );
}
