import type { ThemeConfig } from 'antd';

export const market = {
  up: '#16c784',
  upBg: 'rgba(22, 199, 132, 0.16)',
  down: '#ea3943',
  downBg: 'rgba(234, 57, 67, 0.16)',
} as const;

const shared: ThemeConfig['token'] = {
  colorPrimary: '#5b6cff',
  colorInfo: '#5b6cff',
  colorSuccess: market.up,
  colorError: market.down,
  borderRadius: 10,
  borderRadiusLG: 14,
  controlHeight: 38,
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontSize: 14,
  motionDurationMid: '0.15s',
  wireframe: false,
};

export const lightTokens: ThemeConfig['token'] = {
  ...shared,
  colorBgLayout: '#f6f7fb',
  colorBgContainer: '#ffffff',
};

export const darkTokens: ThemeConfig['token'] = {
  ...shared,
  colorBgLayout: '#0b0e14',
  colorBgContainer: '#12161f',
  colorBorderSecondary: '#1d2230',
};

export const components: ThemeConfig['components'] = {
  Table: {
    headerBg: 'transparent',
    headerSplitColor: 'transparent',
    rowHoverBg: 'rgba(91, 108, 255, 0.06)',
    cellPaddingBlock: 12,
    cellFontSize: 13,
  },
  Layout: {
    headerHeight: 60,
    headerPadding: '0 24px',
    headerBg: 'transparent',
  },
  Menu: { itemBorderRadius: 8, itemHeight: 40 },
  Card: { borderRadiusLG: 14 },
};
