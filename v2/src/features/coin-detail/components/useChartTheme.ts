import { useMemo } from 'react';
import { theme } from 'antd';
import {
  ColorType,
  CrosshairMode,
  type ChartOptions,
  type CandlestickSeriesPartialOptions,
  type DeepPartial,
} from 'lightweight-charts';
import { market } from '@app/theme/tokens';

/**
 * Maps the AntD design tokens to lightweight-charts options so the chart re-themes
 * in lockstep with dark/light (ARCHITECTURE §4.2). One token source, two consumers.
 */
export function useChartTheme(): {
  chart: DeepPartial<ChartOptions>;
  series: CandlestickSeriesPartialOptions;
} {
  const { token } = theme.useToken();

  return useMemo(() => {
    const grid = token.colorBorderSecondary ?? 'rgba(255,255,255,0.06)';
    return {
      chart: {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: token.colorTextSecondary,
          fontFamily: token.fontFamily,
          attributionLogo: false,
        },
        grid: { vertLines: { color: grid }, horzLines: { color: grid } },
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: { borderColor: grid },
        timeScale: { borderColor: grid, timeVisible: true, secondsVisible: false },
      },
      series: {
        upColor: market.up,
        downColor: market.down,
        borderUpColor: market.up,
        borderDownColor: market.down,
        wickUpColor: market.up,
        wickDownColor: market.down,
      },
    };
  }, [token]);
}
