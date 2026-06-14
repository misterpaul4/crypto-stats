import { useMemo } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { marketColumns } from './columns';
import type { CoinMarket } from '@shared/types/coingecko';

export function MarketTable({ data }: { data: CoinMarket[] }) {
  const navigate = useNavigate();
  const columns = useMemo(() => marketColumns(), []);

  const props: TableProps<CoinMarket> = {
    virtual: true,
    scroll: { x: 1180, y: 640 },
    columns,
    dataSource: data,
    rowKey: 'id',
    pagination: false,
    size: 'middle',
    onRow: (record) => ({
      onClick: () => void navigate({ to: '/coin/$coinId', params: { coinId: record.id } }),
      style: { cursor: 'pointer' },
    }),
  };

  return <Table<CoinMarket> {...props} />;
}
