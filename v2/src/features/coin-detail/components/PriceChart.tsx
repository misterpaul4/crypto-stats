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

  liveSymbol?: string;
  height?: number;
}

export default function PriceChart({ data, liveSymbol, height = 380 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lastBarRef = useRef<CandlestickData | null>(null);
  const themeOptions = useChartTheme();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chart = createChart(el, { width: el.clientWidth, height, ...themeOptions.chart });
    const series = chart.addSeries(CandlestickSeries, themeOptions.series);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- create once; theme applied separately
  }, [height]);

  useEffect(() => {
    chartRef.current?.applyOptions(themeOptions.chart);
    seriesRef.current?.applyOptions(themeOptions.series);
  }, [themeOptions]);

  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setData(data);
    lastBarRef.current = data.length ? data[data.length - 1]! : null;
    chartRef.current?.timeScale().fitContent();
  }, [data]);

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
