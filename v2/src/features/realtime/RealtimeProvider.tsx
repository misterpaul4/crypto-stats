import { useEffect, type ReactNode } from 'react';
import { useMarkets } from '@features/catalogue/api/useMarkets';
import { baseSymbol, coinbaseProduct, STABLECOINS } from '@shared/lib/symbol-map/symbols';
import { tickerSocket } from './socket';

/**
 * Derives the symbol universe from the cached markets snapshot and opens the live
 * socket once. Sequencing contract: snapshot ready -> set universe -> open.
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { data } = useMarkets('usd', 100);

  useEffect(() => {
    if (!data?.length) return;
    const keep = new Set<string>();
    const products: string[] = [];
    for (const coin of data) {
      const base = baseSymbol(coin.symbol);
      if (STABLECOINS.has(base) || keep.has(base)) continue;
      keep.add(base);
      products.push(coinbaseProduct(base));
    }
    tickerSocket.setUniverse(keep, products);
    tickerSocket.start();
  }, [data]);

  return <>{children}</>;
}
