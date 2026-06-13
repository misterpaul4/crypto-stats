/* eslint-disable react-refresh/only-export-components -- router config module, not an HMR component file */
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useParams,
} from '@tanstack/react-router';
import { AppLayout } from '@app/shell/AppLayout';
import { CataloguePage } from '@features/catalogue/CataloguePage';
import { ExchangesPage } from '@features/exchanges/ExchangesPage';
import { WatchlistPage } from '@features/watchlist/WatchlistPage';
import { CoinDetailPage } from '@features/coin-detail/CoinDetailPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CataloguePage,
});

const exchangesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exchanges',
  component: ExchangesPage,
});

const watchlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watchlist',
  component: WatchlistPage,
});

function CoinRouteComponent() {
  const { coinId } = useParams({ from: '/coin/$coinId' });
  return <CoinDetailPage coinId={coinId} />;
}

const coinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coin/$coinId',
  component: CoinRouteComponent,
});

const routeTree = rootRoute.addChildren([indexRoute, exchangesRoute, watchlistRoute, coinRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
