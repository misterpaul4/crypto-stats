import { Link } from '@tanstack/react-router';
import { Button, Space, theme, Typography } from 'antd';
import { SearchOutlined, ThunderboltFilled } from '@ant-design/icons';
import { ThemeToggle } from '@shared/ui/ThemeToggle';
import { ConnectionStatus } from '@features/realtime/components/ConnectionStatus';
import { useCommandPalette } from '@features/search/commandPalette.store';

const NAV = [
  { to: '/', label: 'Market' },
  { to: '/exchanges', label: 'Exchanges' },
  { to: '/watchlist', label: 'Watchlist' },
] as const;

export function AppHeader() {
  const { token } = theme.useToken();
  const openSearch = useCommandPalette((s) => s.setOpen);

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
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          <ThunderboltFilled style={{ color: token.colorPrimary, fontSize: 20 }} />
          <Typography.Text strong style={{ fontSize: 16, letterSpacing: 0.2, whiteSpace: 'nowrap' }}>
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

      <Space size={12} align="center">
        <Button
          icon={<SearchOutlined />}
          onClick={() => openSearch(true)}
          style={{ color: token.colorTextTertiary }}
        >
          Search
          <kbd
            style={{
              marginLeft: 8,
              padding: '1px 6px',
              borderRadius: 6,
              fontSize: 11,
              border: `1px solid ${token.colorBorderSecondary}`,
              color: token.colorTextTertiary,
            }}
          >
            ⌘K
          </kbd>
        </Button>
        <ConnectionStatus />
        <ThemeToggle />
      </Space>
    </div>
  );
}
