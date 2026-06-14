import { useEffect, type ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd';
import { useUiStore, resolveTheme } from '@shared/store/uiStore';
import { darkTokens, lightTokens, components } from './tokens';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUiStore((s) => s.theme);
  const resolved = resolveTheme(theme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);
    root.style.colorScheme = resolved;
  }, [resolved]);

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        hashed: false,
        algorithm: resolved === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: resolved === 'dark' ? darkTokens : lightTokens,
        components,
      }}
    >
      {}
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
