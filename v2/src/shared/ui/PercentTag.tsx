import { memo } from 'react';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { theme } from 'antd';
import { market } from '@app/theme/tokens';

export const PercentTag = memo(function PercentTag({ value }: { value: number | null | undefined }) {
  const { token } = theme.useToken();
  if (value == null || Number.isNaN(value)) {
    return <span style={{ color: token.colorTextQuaternary }}>—</span>;
  }
  const up = value >= 0;
  const color = up ? market.up : market.down;
  return (
    <span style={{ color, display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
      {up ? <CaretUpOutlined /> : <CaretDownOutlined />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
});
