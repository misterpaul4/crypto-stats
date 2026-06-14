import { memo } from 'react';
import { market } from '@app/theme/tokens';

interface Props {
  data: number[] | undefined;
  width?: number;
  height?: number;
}

export const Sparkline = memo(function Sparkline({ data, width = 130, height = 40 }: Props) {
  if (!data || data.length < 2) return <span style={{ opacity: 0.4 }}>—</span>;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const up = data[data.length - 1]! >= data[0]!;
  const color = up ? market.up : market.down;
  const gradId = `spark-${up ? 'up' : 'down'}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points.join(' ')} ${width},${height}`} fill={`url(#${gradId})`} />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
});
