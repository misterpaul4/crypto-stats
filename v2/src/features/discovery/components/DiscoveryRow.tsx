import type { ReactNode } from 'react';
import { Avatar, Card, Col, Row, Skeleton, Typography, theme } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { useGlobalTvl } from '../api/useGlobalTvl';
import { useStablecoins } from '../api/useStablecoins';
import { useFearGreed } from '../api/useFearGreed';
import { useTrending } from '../api/useTrending';
import { FearGreedGauge } from './FearGreedGauge';
import { PercentTag } from '@shared/ui/PercentTag';
import { Sparkline } from '@shared/ui/Sparkline';
import { formatCompact } from '@shared/lib/format';

const CARD_MIN_HEIGHT = 168;

function CardShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card size="small" styles={{ body: { minHeight: CARD_MIN_HEIGHT } }} title={title}>
      {children}
    </Card>
  );
}

function Unavailable() {
  return <Typography.Text type="secondary">Unavailable</Typography.Text>;
}

export function DiscoveryRow() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const tvl = useGlobalTvl();
  const stables = useStablecoins();
  const fng = useFearGreed();
  const trending = useTrending(5);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <CardShell title="Fear & Greed">
          {fng.isLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : fng.isError || !fng.data ? (
            <Unavailable />
          ) : (
            <FearGreedGauge value={fng.data.value} classification={fng.data.classification} />
          )}
        </CardShell>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <CardShell title="DeFi TVL">
          {tvl.isLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : tvl.isError || !tvl.data ? (
            <Unavailable />
          ) : (
            <>
              <Typography.Title level={3} style={{ margin: 0 }} className="mono">
                {formatCompact(tvl.data.current, '$')}
              </Typography.Title>
              <PercentTag value={tvl.data.changePct} />
              <div style={{ marginTop: 12 }}>
                <Sparkline data={tvl.data.spark} width={220} height={44} />
              </div>
            </>
          )}
        </CardShell>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <CardShell title="Stablecoins Mcap">
          {stables.isLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : stables.isError || !stables.data ? (
            <Unavailable />
          ) : (
            <>
              <Typography.Title level={3} style={{ margin: 0 }} className="mono">
                {formatCompact(stables.data.totalUsd, '$')}
              </Typography.Title>
              <PercentTag value={stables.data.changePct} />
              <Typography.Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0, fontSize: 12 }}>
                Total USD-pegged supply across all chains
              </Typography.Paragraph>
            </>
          )}
        </CardShell>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <CardShell title="Trending">
          {trending.isLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : trending.isError || !trending.data ? (
            <Unavailable />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {trending.data.map((c, i) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => void navigate({ to: '/coin/$coinId', params: { coinId: c.id } })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void navigate({ to: '/coin/$coinId', params: { coinId: c.id } });
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <span style={{ width: 14, color: token.colorTextQuaternary, fontSize: 12 }}>{i + 1}</span>
                  <Avatar src={c.thumb} size={20} alt="" />
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                  <Typography.Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 11 }}>
                    {c.symbol}
                  </Typography.Text>
                  <span style={{ marginLeft: 'auto' }}>
                    <PercentTag value={c.data?.price_change_percentage_24h?.usd} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardShell>
      </Col>
    </Row>
  );
}
