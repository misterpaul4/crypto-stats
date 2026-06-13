import { useMemo } from 'react';
import { Alert, Skeleton, Space, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useExchanges } from './api/useExchanges';
import { exchangeColumns } from './columns';
import type { Exchange } from '@shared/types/coingecko';

export function ExchangesPage() {
  const { data, isLoading, isError, error } = useExchanges(100);
  const columns = useMemo(() => exchangeColumns(), []);

  const tableProps: TableProps<Exchange> = {
    virtual: true,
    scroll: { x: 880, y: 640 },
    columns,
    dataSource: data ?? [],
    rowKey: 'id',
    pagination: false,
    size: 'middle',
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Exchanges
        </Typography.Title>
        <Typography.Text type="secondary">Top exchanges ranked by trust score</Typography.Text>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Couldn't load exchanges"
          description={(error as Error)?.message ?? 'Please try again.'}
        />
      )}

      {isLoading && !data ? (
        <Skeleton active paragraph={{ rows: 12 }} />
      ) : (
        <Table<Exchange> {...tableProps} />
      )}
    </Space>
  );
}
