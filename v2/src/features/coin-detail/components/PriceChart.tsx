import { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
} from 'lightweight-charts';
import { useRealtimeStore } from '@features/realtime/store/realtime.store';
import { useChartTheme } from './useChartTheme';

interface Props {
  data: CandlestickData[];
  /** Base symbol whose live tick overlays the most recent candle. */
  liveSymbol?: string;
  height?: number;
}

/**
 * Candlestick chart. Created ONCE; data and theme are applied via separate effects
 * (never re-create on a data change). The live price extends the last bar's
 * high/low/close in real time without a separate kline subscription.
 */
export default function PriceChart({ data, liveSymbol, height = 380 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lastBarRef = useRef<CandlestickData | null>(null);
  const themeOptions = useChartTheme();
  const themeRef = useRef(themeOptions);
  themeRef.current = themeOptions;

  // Create once. Size via ResizeObserver (fires regardless of tab visibility,
  // unlike requestAnimationFrame) and re-fit all bars on every resize so the
  // candles always span the full width.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chart = createChart(el, { width: el.clientWidth, height, ...themeRef.current.chart });
    const series = chart.addSeries(CandlestickSeries, themeRef.current.series);
    chartRef.current = chart;
    seriesRef.current = series;

    const ro = new ResizeObserver((entries) => {
      const width = Math.floor(entries[0]?.contentRect.width ?? el.clientWidth);
      if (width > 0) {
        chart.applyOptions({ width });
        chart.timeScale().fitContent();
      }
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [height]);

  // Re-theme in lockstep with dark/light.
  useEffect(() => {
    chartRef.current?.applyOptions(themeOptions.chart);
    seriesRef.current?.applyOptions(themeOptions.series);
  }, [themeOptions]);

  // Apply historical data; seed the live overlay's reference bar.
  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setData(data);
    lastBarRef.current = data.length ? data[data.length - 1]! : null;
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  // Live overlay: extend the last candle from the realtime store.
  const livePrice = useRealtimeStore((s) => (liveSymbol ? s.bySymbol[liveSymbol]?.price : undefined));
  useEffect(() => {
    const bar = lastBarRef.current;
    if (livePrice == null || !seriesRef.current || !bar) return;
    const updated: CandlestickData = {
      ...bar,
      high: Math.max(bar.high, livePrice),
      low: Math.min(bar.low, livePrice),
      close: livePrice,
    };
    lastBarRef.current = updated;
    seriesRef.current.update(updated);
  }, [livePrice]);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
}
