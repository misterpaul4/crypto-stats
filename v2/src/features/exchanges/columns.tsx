import type { ColumnsType } from 'antd/es/table';
import { Avatar, Tag, Typography } from 'antd';
import { formatCompact } from '@shared/lib/format';
import type { Exchange } from '@shared/types/coingecko';

function trustColor(score: number): string {
  if (score >= 8) return 'green';
  if (score >= 6) return 'gold';
  return 'red';
}

export function exchangeColumns(): ColumnsType<Exchange> {
  return [
    {
      title: '#',
      key: 'rank',
      width: 60,
      align: 'right',
      render: (_, e) => e.trust_score_rank ?? '—',
    },
    {
      title: 'Exchange',
      key: 'name',
      fixed: 'left',
      width: 240,
      render: (_, e) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={e.image} size={28} alt="" />
          <Typography.Link href={e.url} target="_blank" rel="noreferrer">
            {e.name}
          </Typography.Link>
        </div>
      ),
    },
    {
      title: 'Trust Score',
      key: 'trust',
      width: 140,
      align: 'center',
      sorter: (a, b) => (a.trust_score ?? 0) - (b.trust_score ?? 0),
      render: (_, e) =>
        e.trust_score != null ? <Tag color={trustColor(e.trust_score)}>{e.trust_score}/10</Tag> : '—',
    },
    {
      title: 'Volume (24h)',
      key: 'vol',
      width: 180,
      align: 'right',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.trade_volume_24h_btc - b.trade_volume_24h_btc,
      render: (_, e) => <span className="mono">{formatCompact(e.trade_volume_24h_btc)} BTC</span>,
    },
    { title: 'Country', key: 'country', width: 170, render: (_, e) => e.country ?? '—' },
    {
      title: 'Est.',
      key: 'year',
      width: 90,
      align: 'right',
      render: (_, e) => e.year_established ?? '—',
    },
  ];
}
