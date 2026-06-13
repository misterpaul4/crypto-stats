import { lazy, Suspense, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Alert,
  Avatar,
  Card,
  Col,
  Row,
  Segmented,
  Skeleton,
  Space,
  Statistic,
  Typography,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useCoinDetail } from './api/useCoinDetail';
import { useCoinOhlc } from './api/useCoinOhlc';
import { LivePriceCell } from '@features/realtime/components/LivePriceCell';
import { PercentTag } from '@shared/ui/PercentTag';
import { baseSymbol } from '@shared/lib/symbol-map/symbols';
import { formatCompact, formatPrice } from '@shared/lib/format';

const PriceChart = lazy(() => import('./components/PriceChart'));

const RANGES = [
  { label: '1D', value: 1 },
  { label: '1W', value: 7 },
  { label: '1M', value: 30 },
  { label: '3M', value: 90 },
] as const;

function plainText(html: string, max = 280): string {
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function CoinDetailPage({ coinId }: { coinId: string }) {
  const [days, setDays] = useState<number>(7);
  const { data: coin, isLoading, isError, error } = useCoinDetail(coinId);
  const ohlc = useCoinOhlc(coinId, days);

  if (isLoading && !coin) return <Skeleton active paragraph={{ rows: 10 }} />;
  if (isError || !coin) {
    return (
      <Alert
        type="error"
        showIcon
        message="Couldn't load this coin"
        description={(error as Error)?.message ?? 'Unknown error'}
      />
    );
  }

  const md = coin.market_data;
  const sym = baseSymbol(coin.symbol);
  const usd = md.current_price.usd ?? 0;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <ArrowLeftOutlined /> Back to market
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Avatar src={coin.image.large} size={48} alt="" />
        <div>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {coin.name}{' '}
            <Typography.Text type="secondary" style={{ fontSize: 16, textTransform: 'uppercase' }}>
              {coin.symbol}
            </Typography.Text>
          </Typography.Title>
          {coin.market_cap_rank ? (
            <Typography.Text type="secondary">Rank #{coin.market_cap_rank}</Typography.Text>
          ) : null}
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            <LivePriceCell symbol={sym} fallbackPrice={usd} />
          </div>
          <PercentTag value={md.price_change_percentage_24h} />
        </div>
      </div>

      <Card
        styles={{ body: { padding: 16 } }}
        title="Price"
        extra={
          <Segmented
            options={RANGES.map((r) => ({ label: r.label, value: r.value }))}
            value={days}
            onChange={(v) => setDays(v as number)}
          />
        }
      >
        {ohlc.isError ? (
          <Alert type="warning" showIcon message="Chart data unavailable for this range" />
        ) : ohlc.isLoading || !ohlc.data ? (
          <Skeleton.Node active style={{ width: '100%', height: 380 }} />
        ) : ohlc.data.length === 0 ? (
          <Typography.Text type="secondary">No price history for this range.</Typography.Text>
        ) : (
          <Suspense fallback={<Skeleton.Node active style={{ width: '100%', height: 380 }} />}>
            <PriceChart data={ohlc.data} liveSymbol={sym} />
          </Suspense>
        )}
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Market Cap" value={formatCompact(md.market_cap.usd, '$')} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Volume (24h)" value={formatCompact(md.total_volume.usd, '$')} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="24h High" value={formatPrice(md.high_24h.usd)} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="24h Low" value={formatPrice(md.low_24h.usd)} />
          </Card>
        </Col>
      </Row>

      {coin.description.en ? (
        <Card title={`About ${coin.name}`}>
          <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
            {plainText(coin.description.en)}
          </Typography.Paragraph>
        </Card>
      ) : null}
    </Space>
  );
}
