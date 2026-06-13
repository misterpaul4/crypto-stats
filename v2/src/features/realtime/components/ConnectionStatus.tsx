import { Tooltip } from 'antd';
import type { ConnectionState } from '@shared/lib/ws/types';
import { market } from '@app/theme/tokens';
import { useConnectionState } from '../hooks/useConnectionState';

const META: Record<ConnectionState, { label: string; color: string; pulse: boolean }> = {
  idle: { label: 'Idle', color: '#8c8c8c', pulse: false },
  connecting: { label: 'Connecting…', color: '#faad14', pulse: true },
  live: { label: 'Live', color: market.up, pulse: true },
  reconnecting: { label: 'Reconnecting…', color: '#faad14', pulse: true },
  paused: { label: 'Paused', color: '#8c8c8c', pulse: false },
  degraded: { label: 'Degraded', color: '#faad14', pulse: false },
  offline: { label: 'Offline — snapshot prices', color: market.down, pulse: false },
};

export function ConnectionStatus() {
  const state = useConnectionState();
  const { label, color, pulse } = META[state];

  return (
    <Tooltip title={`Live price feed: ${label}`}>
      <span
        role="status"
        aria-label={`Live price feed ${label}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            boxShadow: pulse ? `0 0 0 0 ${color}` : 'none',
            animation: pulse ? 'mkt-pulse 1.6s ease-out infinite' : 'none',
          }}
        />
        {label}
      </span>
    </Tooltip>
  );
}
