import type { ReactNode } from 'react';
import { Layout } from 'antd';
import { AppHeader } from './AppHeader';
import { CommandPalette } from '@features/search/CommandPalette';
import { useCommandPalette } from '@features/search/commandPalette.store';
import { useHotkey } from '@shared/hooks/useHotkey';

const { Header, Content } = Layout;

export function AppLayout({ children }: { children: ReactNode }) {
  const setOpen = useCommandPalette((s) => s.setOpen);
  useHotkey({ key: 'k', meta: true }, () => setOpen(true));

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'transparent',
          paddingInline: 24,
        }}
      >
        <AppHeader />
      </Header>
      <Content style={{ padding: '24px clamp(16px, 4vw, 48px)', maxWidth: 1320, width: '100%', margin: '0 auto' }}>
        {children}
      </Content>
      <CommandPalette />
    </Layout>
  );
}
