import type { ColumnsType } from 'antd/es/table';
import { CoinCell } from '@shared/ui/CoinCell';
import { PercentTag } from '@shared/ui/PercentTag';
import { Sparkline } from '@shared/ui/Sparkline';
import { LivePriceCell } from '@features/realtime/components/LivePriceCell';
import { baseSymbol } from '@shared/lib/symbol-map/symbols';
import { formatCompact } from '@shared/lib/format';
import type { CoinMarket } from '@shared/types/coingecko';

export function marketColumns(): ColumnsType<CoinMarket> {
  return [
    {
      title: 'Coin',
      key: 'coin',
      fixed: 'left',
      width: 280,
      render: (_, c) => (
        <CoinCell name={c.name} symbol={c.symbol} image={c.image} rank={c.market_cap_rank} />
      ),
    },
    {
      title: 'Price',
      key: 'price',
      align: 'right',
      width: 150,
      sorter: (a, b) => a.current_price - b.current_price,
      render: (_, c) => <LivePriceCell symbol={baseSymbol(c.symbol)} fallbackPrice={c.current_price} />,
    },
    {
      title: '24h',
      key: 'change24h',
      align: 'right',
      width: 120,
      sorter: (a, b) =>
        (a.price_change_percentage_24h_in_currency ?? 0) -
        (b.price_change_percentage_24h_in_currency ?? 0),
      render: (_, c) => <PercentTag value={c.price_change_percentage_24h_in_currency} />,
    },
    {
      title: '7d',
      key: 'change7d',
      align: 'right',
      width: 120,
      sorter: (a, b) =>
        (a.price_change_percentage_7d_in_currency ?? 0) -
        (b.price_change_percentage_7d_in_currency ?? 0),
      render: (_, c) => <PercentTag value={c.price_change_percentage_7d_in_currency} />,
    },
    {
      title: 'Market Cap',
      key: 'mcap',
      align: 'right',
      width: 150,
      sorter: (a, b) => a.market_cap - b.market_cap,
      render: (_, c) => <span className="mono">{formatCompact(c.market_cap, '$')}</span>,
    },
    {
      title: 'Volume (24h)',
      key: 'volume',
      align: 'right',
      width: 150,
      sorter: (a, b) => a.total_volume - b.total_volume,
      render: (_, c) => <span className="mono">{formatCompact(c.total_volume, '$')}</span>,
    },
    {
      title: 'Last 7 days',
      key: 'sparkline',
      align: 'right',
      width: 160,
      render: (_, c) => <Sparkline data={c.sparkline_in_7d?.price} />,
    },
  ];
}
