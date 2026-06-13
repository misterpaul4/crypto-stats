import { Link } from '@tanstack/react-router';
import { Space, theme, Typography } from 'antd';
import { ThunderboltFilled } from '@ant-design/icons';
import { ThemeToggle } from '@shared/ui/ThemeToggle';

const NAV = [
  { to: '/', label: 'Market' },
  { to: '/exchanges', label: 'Exchanges' },
  { to: '/watchlist', label: 'Watchlist' },
] as const;

export function AppHeader() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Space size={36} align="center">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThunderboltFilled style={{ color: token.colorPrimary, fontSize: 20 }} />
          <Typography.Text strong style={{ fontSize: 16, letterSpacing: 0.2 }}>
            Crypto<span style={{ color: token.colorPrimary }}>Stats</span>
          </Typography.Text>
        </Link>

        <Space size={4}>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                color: token.colorTextSecondary,
                fontWeight: 500,
              }}
              activeProps={{
                style: {
                  color: token.colorPrimary,
                  background: 'rgba(91,108,255,0.10)',
                },
              }}
            >
              {item.label}
            </Link>
          ))}
        </Space>
      </Space>

      <ThemeToggle />
    </div>
  );
}
