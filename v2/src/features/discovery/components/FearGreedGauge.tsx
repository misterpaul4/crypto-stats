import { theme } from 'antd';

function colorFor(value: number): string {
  if (value < 25) return '#ea3943';
  if (value < 45) return '#f5811f';
  if (value < 55) return '#f5c518';
  if (value < 75) return '#93d900';
  return '#16c784';
}

const CX = 90;
const CY = 90;
const R = 70;

function marker(value: number): { x: number; y: number } {
  const theta = ((180 - (value / 100) * 180) * Math.PI) / 180;
  return { x: CX + R * Math.cos(theta), y: CY - R * Math.sin(theta) };
}

interface Props {
  value: number | null;
  classification: string | null;
}

export function FearGreedGauge({ value, classification }: Props) {
  const { token } = theme.useToken();
  const v = value ?? 0;
  const color = colorFor(v);
  const m = marker(v);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 180 110" width="100%" style={{ maxWidth: 200 }} role="img"
        aria-label={`Fear and Greed Index ${value ?? 'unknown'} ${classification ?? ''}`}>
        <defs>
          <linearGradient id="fng-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ea3943" />
            <stop offset="50%" stopColor="#f5c518" />
            <stop offset="100%" stopColor="#16c784" />
          </linearGradient>
        </defs>
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="url(#fng-grad)"
          strokeWidth={12}
          strokeLinecap="round"
          opacity={0.5}
        />
        {value != null && (
          <circle cx={m.x} cy={m.y} r={7} fill={color} stroke={token.colorBgContainer} strokeWidth={3} />
        )}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize={30} fontWeight={700} fill={color}>
          {value ?? '—'}
        </text>
      </svg>
      <span style={{ color, fontWeight: 600, marginTop: -6 }}>{classification ?? '—'}</span>
    </div>
  );
}
