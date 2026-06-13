import { Alert, Button, Skeleton, Space, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useMarkets } from './api/useMarkets';
import { MarketTable } from './MarketTable';

export function CataloguePage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useMarkets('usd', 100);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Market
          </Typography.Title>
          <Typography.Text type="secondary">
            Top 100 cryptocurrencies by market capitalization
          </Typography.Text>
        </div>
        <Button
          icon={<ReloadOutlined spin={isFetching} />}
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          Refresh
        </Button>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Couldn't load market data"
          description={(error as Error)?.message ?? 'Please try again.'}
          action={
            <Button size="small" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {isLoading && !data ? (
        <Skeleton active paragraph={{ rows: 12 }} />
      ) : (
        <MarketTable data={data ?? []} />
      )}
    </Space>
  );
}
