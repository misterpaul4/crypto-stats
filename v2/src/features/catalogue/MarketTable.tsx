import { useMemo } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { marketColumns } from './columns';
import type { CoinMarket } from '@shared/types/coingecko';

/**
 * Virtualized market table. `virtual` + a fixed `scroll` are both required for
 * AntD's built-in row virtualization, which keeps 250 rows at 60fps.
 */
export function MarketTable({ data }: { data: CoinMarket[] }) {
  const columns = useMemo(() => marketColumns(), []);

  const props: TableProps<CoinMarket> = {
    virtual: true,
    scroll: { x: 1130, y: 640 },
    columns,
    dataSource: data,
    rowKey: 'id',
    pagination: false,
    size: 'middle',
  };

  return <Table<CoinMarket> {...props} />;
}
