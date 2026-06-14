import { memo } from 'react';
import { Avatar, theme } from 'antd';

interface Props {
  name: string;
  symbol: string;
  image: string;
  rank: number;
}

export const CoinCell = memo(function CoinCell({ name, symbol, image, rank }: Props) {
  const { token } = theme.useToken();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 22, textAlign: 'right', color: token.colorTextQuaternary, fontSize: 12 }}>
        {rank || '—'}
      </span>
      <Avatar src={image} size={28} alt="" />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
        <span style={{ fontWeight: 600 }}>{name}</span>
        <span style={{ color: token.colorTextTertiary, fontSize: 12, textTransform: 'uppercase' }}>
          {symbol}
        </span>
      </div>
    </div>
  );
});
