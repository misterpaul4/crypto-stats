import { useMemo, useState, type KeyboardEvent } from 'react';
import { Avatar, Empty, Input, Modal, Spin, theme, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { useMarkets } from '@features/catalogue/api/useMarkets';
import { useCoinSearch } from './api/useCoinSearch';
import { useCommandPalette } from './commandPalette.store';
import { useDebouncedValue } from '@shared/hooks/useDebouncedValue';
import type { CoinMarket } from '@shared/types/coingecko';

const LIMIT = 10;

interface Hit {
  id: string;
  name: string;
  symbol: string;
  image: string;
  rank: number | null;
}

function rankCached(coins: CoinMarket[], query: string): Hit[] {
  const q = query.trim().toLowerCase();
  const toHit = (c: CoinMarket): Hit => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    image: c.image,
    rank: c.market_cap_rank,
  });
  if (!q) return coins.slice(0, 8).map(toHit);
  return coins
    .map((c) => {
      const name = c.name.toLowerCase();
      const sym = c.symbol.toLowerCase();
      let score = -1;
      if (sym === q) score = 0;
      else if (sym.startsWith(q) || name.startsWith(q)) score = 1;
      else if (name.includes(q) || sym.includes(q)) score = 2;
      return { c, score };
    })
    .filter((x) => x.score >= 0)
    .sort((a, b) => a.score - b.score || a.c.market_cap_rank - b.c.market_cap_rank)
    .slice(0, 8)
    .map((x) => toHit(x.c));
}

export function CommandPalette() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const open = useCommandPalette((s) => s.open);
  const setOpen = useCommandPalette((s) => s.setOpen);
  const { data } = useMarkets('usd', 100);

  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const debounced = useDebouncedValue(query, 300);
  const search = useCoinSearch(debounced);

  const hits = useMemo(() => {
    const cached = rankCached(data ?? [], query);
    const seen = new Set(cached.map((h) => h.id));
    const fromSearch: Hit[] = (search.data ?? [])
      .filter((c) => !seen.has(c.id))
      .map((c) => ({ id: c.id, name: c.name, symbol: c.symbol, image: c.thumb, rank: c.market_cap_rank }));
    return [...cached, ...fromSearch].slice(0, LIMIT);
  }, [data, query, search.data]);

  const onQueryChange = (next: string) => {
    setQuery(next);
    setActive(0);
  };

  const go = (hit: Hit | undefined) => {
    if (!hit) return;
    setOpen(false);
    void navigate({ to: '/coin/$coinId', params: { coinId: hit.id } });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(hits[active]);
    }
  };

  const searching = debounced.trim().length >= 2 && search.isFetching;

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      afterOpenChange={(opened) => {
        if (opened) onQueryChange('');
      }}
      footer={null}
      closable={false}
      width={560}
      styles={{ body: { padding: 0 } }}
      style={{ top: 96 }}
    >
      <Input
        size="large"
        autoFocus
        variant="borderless"
        prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
        suffix={searching ? <Spin size="small" /> : null}
        placeholder="Search any coin…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded
        aria-controls="cmdk-listbox"
        aria-activedescendant={hits[active] ? `cmdk-opt-${hits[active].id}` : undefined}
      />
      <div
        id="cmdk-listbox"
        role="listbox"
        style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, maxHeight: 380, overflowY: 'auto' }}
      >
        {hits.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={searching ? 'Searching…' : 'No matches'}
            style={{ padding: 32 }}
          />
        ) : (
          hits.map((h, i) => (
            <div
              key={h.id}
              id={`cmdk-opt-${h.id}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(h)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                cursor: 'pointer',
                background: i === active ? 'rgba(91,108,255,0.12)' : 'transparent',
              }}
            >
              <Avatar src={h.image} size={24} alt="" />
              <span style={{ fontWeight: 500 }}>{h.name}</span>
              <Typography.Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12 }}>
                {h.symbol}
              </Typography.Text>
              {h.rank != null && (
                <Typography.Text type="secondary" style={{ marginLeft: 'auto', fontSize: 12 }}>
                  #{h.rank}
                </Typography.Text>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
