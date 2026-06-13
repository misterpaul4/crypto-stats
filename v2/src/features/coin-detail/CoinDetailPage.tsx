import { Empty, Typography } from 'antd';

export function CoinDetailPage({ coinId }: { coinId: string }) {
  return (
    <div>
      <Typography.Title level={3} style={{ textTransform: 'capitalize' }}>
        {coinId}
      </Typography.Title>
      <Empty
        description="Coin detail with a live chart — coming in a later phase"
        style={{ marginTop: 80 }}
      />
    </div>
  );
}
