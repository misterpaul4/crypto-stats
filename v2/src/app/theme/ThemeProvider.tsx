import { useEffect, type ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd';
import { useUiStore, resolveTheme } from '@shared/store/uiStore';
import { darkTokens, lightTokens, components } from './tokens';

/**
 * Wraps the app in a single themed ConfigProvider. Flips the AntD algorithm
 * (dark/light) and keeps `<html data-theme>` in sync so global.css + the
 * background gradient track the active scheme.
 */
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
      {/* AntApp provides themed static message/notification/modal under React 19. */}
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
