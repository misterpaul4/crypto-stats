import { Empty, Typography } from 'antd';

export function WatchlistPage() {
  return (
    <div>
      <Typography.Title level={3}>Watchlist</Typography.Title>
      <Empty description="Your watchlist — coming in a later phase" style={{ marginTop: 80 }} />
    </div>
  );
}
