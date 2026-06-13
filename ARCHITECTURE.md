# Crypto-Stats v2 — Architecture / RFC

> **Status:** Approved for build · **Author:** Tech Lead · **Date:** 2026-06-13
> **Scope:** Full frontend rewrite of the existing CRA crypto-stats app into a state-of-the-art crypto catalogue + real-time price platform. Frontend-only, no backend, public APIs called directly from the browser.

This document is the single source of truth synthesized from seven verified subsystem designs and six adversarial verifications. Where a verifier marked a claim **wrong**, the correction has been folded in and the original is not repeated. Where a verifier listed **missing** items or **needs-fixes** issues, they have been incorporated as decisions below. The testing/CI subsystem had no verifier, so it has been re-reviewed against 2026 reality in §6.6.

---

## 1. Overview & thesis

The current app is a ~75-file Create React App (React 17, react-router v5, a hand-rolled `fetch` + `localStorage` cache in `useAPI`/`useLazyAPI`, `moment`, a dead Redux dependency, and Bootstrap-ish utility classes layered over Ant Design). It works, but it is untyped, polls CoinGecko on every mount, and has no real-time story. We are rewriting it in place on a clean branch.

The rewrite is built around one insight that drives every other decision: **price data has two cadences, and they must live in two different layers.** Low-frequency, slow-moving data (the catalogue snapshot, coin metadata, historical OHLC) comes from CoinGecko's free REST tier, heavily cached and persisted. High-frequency live ticks come from **free, key-less exchange WebSockets (Binance/Coinbase)** — never CoinGecko. This split is not an optimization; it is the only way a backend-less app stays under CoinGecko's free monthly cap while still feeling live.

**What makes this feel senior:** a framework-agnostic WebSocket engine that coalesces a multi-hundred-message-per-second firehose into one paint-aligned store commit per frame, so a 250-row virtualized table flashes individual cells at 60fps without ever re-rendering the table; one design-token source feeding both Ant Design and the TradingView charts so dark/light switch in lockstep; and a disciplined two-layer ownership of price data (REST seeds, WS overlays) with an explicit staleness contract so the UI never silently presents day-old prices as live.

---

## 2. Final stack

| Layer | Choice | Version (pin) | Why |
|---|---|---|---|
| Build / dev server | Vite + `@vitejs/plugin-react-swc` | `vite ^7`, plugin `^4` | Fastest HMR, React 19 JSX transform; replaces react-scripts. Pinned one major behind the released `vite 8` for plugin-matrix maturity (not because 8 is prerelease — it is stable). |
| Language | TypeScript (strict) | `~5.9` | `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`. One major behind released `ts 6`. |
| UI runtime | React | `^19.2` | Up from 17; new `createRoot` entry, native document metadata. |
| Component system | Ant Design 5 (heavily themed) | `antd ^5.29.3` + `@ant-design/v5-patch-for-react-19 ^1.0.3` | Locked decision. `latest-5` dist-tag = 5.29.3 (npm `latest` is now v6 — must pin). The React-19 patch is still required on v5 (peers `antd>=5.22.6`, `react>=19`). |
| Server-state (REST) | TanStack Query v5 + persist | `@tanstack/react-query ^5.101`, `@tanstack/react-query-persist-client ^5.101`, **`@tanstack/query-async-storage-persister ^5.101`** | Single cache for all CoinGecko/DeFiLlama REST. Async persister (idb-keyval is async — see §4.3 / §6.2). |
| IndexedDB | `idb-keyval` | `^6.2.5` | ~600B async KV; backs the Query persister + the symbol-map cache. |
| Client state | Zustand | `^5.0` (with `subscribeWithSelector`) | Live-price store (WS ticks) + UI prefs + watchlist + alerts. Replaces `useLocalStorage`, the favourites context, and the dead Redux. |
| Routing | TanStack Router (type-safe) + plugin | router/`plugin`/`devtools` all `^1.170.x` (version-locked set) | File-based routes, typed search params. Replaces react-router v5. |
| Charts | TradingView `lightweight-charts` v5 | `^5.2.0` | Canvas, imperative, unified `addSeries(CandlestickSeries, opts)` API (v4 `addCandlestickSeries` removed). |
| Dates | `date-fns` | `^4.4` | Tree-shakeable, immutable; drops `moment`. |
| Validation | `zod` | **`^4.x`** (greenfield) | Search-param schemas, env, external-payload validation. v4 is current; starting a 2026 greenfield on v3 was flagged stale and corrected. |
| Fuzzy search | `@leeoniya/ufuzzy` | `^1.0.19` | ~5KB, dependency-free ⌘K ranking over the cached coin list. |
| i18n | `react-i18next` + `i18next` (+ language-detector) | `^15.5` / `^25.2` / `^8.1` | Lazy namespaces; date-fns locale switching; `Intl.NumberFormat`. |
| Fonts | `@fontsource-variable/inter`, `@fontsource/jetbrains-mono` | `^5.1` | Self-hosted; mono tabular-nums for price cells. |
| Package manager | pnpm | `pnpm@9.15`, `engines.node >= 22.10` | Content-addressed store, no phantom deps. **Node raised to ≥22.10** so ESLint's TS-config loads natively (see §6.6). |
| Lint / format | ESLint 9 flat config + `typescript-eslint ^8.61` + Prettier | `eslint ^9`, `prettier ^3.8` | Type-aware rules catch floating-promise / misused-promise classes critical to a WS+Query app. |
| Test | Vitest + Testing Library + MSW v2 + Playwright | `vitest ^4`, `@testing-library/react ^16.3`, see §6.6 | Vitest shares the Vite pipeline; MSW mocks REST **and** WS. |

---

## 3. Target architecture

### 3.1 Data-flow diagram

```
                         ┌──────────────────────────────────────────────────────┐
   LOW-FREQUENCY (cold)  │                     HIGH-FREQUENCY (hot)               │
                         │                                                        │
 CoinGecko REST          │   Binance / Coinbase public WebSockets (key-less)      │
 (catalogue, metadata,   │   !miniTicker@arr (whole market) + <sym>@kline_<iv>    │
  OHLC fallback)         │                                                        │
       │                 │                          │                             │
       │ cgFetch         │                          │ raw frames (60–100+/s)      │
       │ (throttle+429)  │                          ▼                             │
       ▼                 │            ┌────────────────────────────┐              │
 ┌───────────────┐       │            │  TickerSocket (singleton,  │              │
 │ TanStack Query│       │            │  OUTSIDE React)            │              │
 │ cache (v5)    │       │            │  • parse() -> Ticker[]     │              │
 │ + IndexedDB   │       │            │  • rAF-coalesced buffer    │              │
 │ persist       │       │            │  • reconnect/backoff/      │              │
 └──────┬────────┘       │            │    visibility/watchdog     │              │
        │                │            └──────────────┬─────────────┘              │
        │ seed() once    │                           │ one flush / animation frame │
        │ (snapshot →     ───────────────────────────┤  (ticks + conn state)       │
        │  Ticker)                                    ▼                             │
        │                              ┌────────────────────────────┐              │
        │                              │ Zustand realtime store     │              │
        │                              │ bySymbol: Record<sym,Ticker>│             │
        │                              │ candles[sym@iv], connection │              │
        │                              │ (subscribeWithSelector)    │              │
        │                              └───┬───────────────┬────────┘              │
        │                                  │ selector       │ store.subscribe     │
        ▼                                  ▼ (per symbol)    ▼ (imperative)        │
 ┌─────────────────┐            ┌────────────────────┐  ┌──────────────────────┐  │
 │ MarketTable     │  rows ───▶ │ LivePriceCell       │  │ PriceChart           │  │
 │ (AntD virtual,  │  (snapshot │ reads live tick OR  │  │ seed = REST klines   │  │
 │  data = Query)  │  fallback) │ snapshot fallback;  │  │ live = WS update()   │  │
 └─────────────────┘            │ flashes up/down     │  │ (no React re-render) │  │
                                └────────────────────┘  └──────────────────────┘  │
                                                                                   │
   Design tokens (tokens.ts) ──▶ AntD ConfigProvider  ──▶  useChartTheme()  ───────┘
                              (single source, dark/light switch together)
```

### 3.2 Layer responsibilities

- **REST / Query layer** — owns the *slow truth*: catalogue snapshot, coin metadata, OHLC seed, exchanges, derivatives, DeFiLlama, Fear & Greed. Caches, dedupes, persists to IndexedDB, throttles, honors 429 `Retry-After`. **Never holds a per-tick price.**
- **WS engine (`TickerSocket`)** — owns the connection lifecycle entirely outside React: parsing, rAF batching, reconnection, geo-block failover, visibility pause, watchdog. Writes only to the Zustand store.
- **Zustand realtime store** — owns the *fast truth*: `bySymbol` ticks, per-`symbol@interval` live candles, and the connection state machine. Read via narrow selectors so only changed cells re-render.
- **Zustand UI/prefs/watchlist/alerts stores** — sibling slices, `persist`-backed to `localStorage`, the alert evaluator subscribes to the realtime store.
- **Presentation** — AntD-themed shell + virtualized table + lightweight-charts wrapper; leaf cells/charts subscribe to the store, the containers read Query. Tokens flow from one module to both AntD and the charts.

---

## 4. The four cross-cutting resolutions

These are the traps where two subsystems meet. Each has one decided rule that is binding across the codebase.

### 4.1 Ownership of price data — REST seeds, WS overlays

**Rule.** The Query cache holds the immutable REST snapshot row (`current_price`, market cap, 24h %, the 7d sparkline array). The Zustand realtime store holds live ticks keyed by canonical exchange symbol. **A price cell renders `liveTick?.price ?? snapshotPrice`** — the live value if a tick exists for that symbol, otherwise the snapshot. There is exactly one writer per layer; they meet at two points only:

1. **`seed()`** — on a successful markets query, `RealtimeProvider` maps each coin to a `Ticker` keyed by exchange symbol and seeds the store **for missing keys only** (never overwriting an existing live ref — fixes the seed ref-stability bug). This makes cells render a price immediately, before the socket connects.
2. **the symbol-map** — translating CoinGecko id ↔ exchange symbol (see §4.4).

**Critical staleness sub-rule (folds in the "stale-snapshot trap" finding).** The all-market stream sends *only changed* tickers, and many CoinGecko long-tail coins have **no exchange pair at all**. So a cell can sit on a snapshot price indefinitely while looking live. Therefore:

- Every `Ticker` carries a `ts` (last live update) and a `source` (`'binance' | 'coinbase' | 'snapshot'`).
- `LivePriceCell` shows a subtle **"snapshot" badge** (and never flashes) when `source === 'snapshot'`, and a **"last live Ns ago"** treatment if a live tick goes stale beyond a threshold.
- For **visible/watchlisted coins with no WS pair**, fall back to a slow periodic REST refetch (60–120s, counted against the budget) — the only place REST touches price after boot. This is the explicit answer to "WS covers everything," which is false for the long tail.

Query never re-renders on a tick because ticks live outside Query; the table's `dataSource` is the immutable Query array, and only the leaf `LivePriceCell` subscribes to the store.

### 4.2 Theming — one token source feeds AntD and the charts

**Rule.** `src/app/theme/tokens.ts` is the **single source of design tokens** (the "Aurora" palette: brand indigo, semantic up/down green/red, `borderRadius:10`, Inter + JetBrains Mono, tightened motion). It feeds:

- **AntD** via one root `ConfigProvider` (`token` + `components` + `algorithm` = `darkAlgorithm | defaultAlgorithm` [+`compactAlgorithm`]). Dark is the default.
- **lightweight-charts** via `useChartTheme()`, which reads `theme.useToken()` and maps tokens → chart options, calling `chart.applyOptions()` / `series.applyOptions()` in an effect when tokens change. Use `CrosshairMode.Normal`/`ColorType.Solid`/`LineStyle` enums (typed), not magic numbers.

Switching scheme flips the AntD algorithm and the chart re-themes in the same render — no second palette, no hardcoded hex.

**Flash colors are NOT AntD CSS vars (corrected).** `cssVar: { key: 'aurora' }` does **not** emit `--aurora-*` variables — `key` is style-isolation only; the prefix defaults to `--ant-*` and is set via the separate `prefix` property. Under React 19 use `cssVar: true` (auto key). The up/down flash keyframes therefore read **our own** custom properties `--mkt-up-bg` / `--mkt-down-bg`, defined in `global.css` from the `tokens.ts` `market` constants. This decouples the hero animation from AntD's internal var naming entirely. Also: a `prefers-reduced-motion` media query disables the flash animation (hard requirement, WCAG 2.3).

### 4.3 Persisted Query-cache staleness — maxAge, buster, and the WS mask

**Rule.** The cache is persisted to IndexedDB via the **async** persister and hydrated on boot for instant SWR. To prevent showing day-old prices:

- `PersistQueryClientProvider persistOptions={{ persister, maxAge, buster }}` — **`buster` and `maxAge` go on the provider, not the persister** (corrected — they are inert on the persister). `buster = VITE_CACHE_VERSION` (build-time constant) discards the whole store on a type/key-shape change; `maxAge` discards stale entries on hydrate.
- **Markets gets a tighter `maxAge` (≈1h)** than the global 24h so a returning user never paints a day-old catalogue. CoinGecko server-caches markets/OHLC ~15 min, so `staleTime` for markets is **2–5 min** (not 60s — 60s refetches ~14× more often than the data can change).
- **Hydration race guard (folds in the boot-burst finding).** The provider exposes `isRestoring`; queries do **not** fire until restore completes, so boot does not double-fetch and burn quota. `refetchOnReconnect` is `'always'` only if proven safe against the throttle; default behavior plus the throttle gate (§6.2) bounds the boot+reconnect burst.
- **The live WS overlay masks the rest.** Once a tick arrives for a symbol, the cell shows the live value, so the brief window of hydrated-stale price is masked within ~1–2s for any coin with a pair. Coins without a pair get the staleness badge from §4.1 — they are never silently presented as live.

### 4.4 Symbol mapping — CoinGecko id ↔ exchange ticker

**Rule.** `src/shared/lib/symbol-map/` owns the bidirectional map. It is **built once** by joining CoinGecko `coins/list` against Binance `exchangeInfo` (tradable USDT pairs), plus a curated `overrides.ts` for famous symbol collisions (many coins share `ETH`/`BTC`). It is **cached in IndexedDB with a schema-version stamp** (folds in the staleness finding — a code change to the map shape busts the cache; refreshed weekly otherwise), so it costs **zero** CoinGecko calls on subsequent loads (the one `coins/list` call is cached; `exchangeInfo` hits Binance, not CoinGecko).

Each entry emits **both** forms so failover needs no remap (corrected): a **Binance symbol** (`BTCUSDT`, lowercased for stream names) **and** a **Coinbase product id** (`BTC-USD`). It also stores per-symbol **price precision** from Binance `exchangeInfo` `tickSize` so low-priced coins (e.g. SHIB) render correctly.

**Canonical key.** The realtime store keys, the symbol-map output, and alert-rule symbols all use **one canonical, exchange-qualified key** (e.g. `BINANCE:BTCUSDT`) so cross-exchange lookups never silently miss. A dev-time invariant logs when a rule/cell references a symbol absent from the prices map.

**Fallback chain.** `Binance pair → Coinbase pair → snapshot-only` (with the §4.1 badge). **Quote-currency caveat is surfaced:** Binance pairs are USDT, CoinGecko snapshots are USD — they are not identical and a USDT depeg makes them diverge; the live cell is labeled with its quote currency rather than presented as the same number.

---

## 5. Folder structure (feature-sliced)

```
crypto-stats/
├─ index.html                      # Vite entry (replaces public/index.html %PUBLIC_URL%)
├─ package.json  pnpm-lock.yaml  .npmrc  .nvmrc  .env.example
├─ vite.config.ts  vitest.config.ts
├─ tsconfig.json  tsconfig.app.json  tsconfig.node.json
├─ eslint.config.mjs               # flat config (.mjs, not .ts — see §6.6)
├─ prettier.config.mjs
├─ src/
│  ├─ main.tsx                      # createRoot + StrictMode + AntD react-19 patch (FIRST import)
│  ├─ routeTree.gen.ts              # generated; COMMITTED, lint/prettier-ignored
│  ├─ vite-env.d.ts
│  ├─ app/                          # composition root, providers, shell, theme, router, env
│  │  ├─ providers/AppProviders.tsx # StyleProvider > ConfigProvider(Theme) > PersistQueryClientProvider > RouterProvider, ErrorBoundary inside ConfigProvider
│  │  ├─ providers/QueryProvider.tsx
│  │  ├─ lib/queryClient.ts
│  │  ├─ router/router.ts           # createRouter, context carries queryClient
│  │  ├─ theme/{tokens.ts, ThemeProvider.tsx, global.css}
│  │  ├─ shell/{AppLayout.tsx, AppHeader.tsx, AppSider.tsx}
│  │  ├─ error/AppErrorBoundary.tsx
│  │  └─ config/env.ts              # zod-validated import.meta.env (only reader)
│  ├─ routes/                       # TanStack file-based
│  │  ├─ __root.tsx  index.tsx  exchanges.tsx  watchlist.tsx  coin.$coinId.tsx
│  ├─ features/
│  │  ├─ catalogue/    {MarketTable.tsx, columns.tsx, MarketCardList.tsx, api/useMarkets.ts}
│  │  ├─ coin-detail/  {api/useCoinDetail.ts, api/useCoinOHLC.ts}
│  │  ├─ exchanges/    {api/useExchanges.ts, api/useDerivatives.ts}
│  │  ├─ watchlist/    {store/watchlist.store.ts, store/watchlist.bootstrap.ts, hooks/useWatchlist.ts, api/useWatchlistMarkets.ts, components/*}
│  │  ├─ alerts/       {store/alerts.store.ts, lib/alertEvaluator.ts, hooks/useAlertNotifications.ts, components/AlertRuleModal.tsx}
│  │  ├─ discovery/    {api/{defillama,fearGreed,trending}.ts, components/{GlobalTvlCard,StablecoinsWidget,YieldsWidget,FearGreedGauge,TrendingMovers}.tsx}
│  │  ├─ search/       {components/CommandPalette.tsx, hooks/useCommandPalette.ts, lib/fuzzyIndex.ts}
│  │  └─ realtime/                  # THE HERO
│  │     ├─ socket.ts               # module-singleton TickerSocket + HMR dispose
│  │     ├─ RealtimeProvider.tsx    # snapshot->seed gate, symbol-map ready gate
│  │     ├─ store/{realtime.store.ts, uiPrefs.store.ts}
│  │     ├─ hooks/{useTickerStream.ts, useConnectionState.ts}
│  │     ├─ components/{LivePriceCell.tsx, ConnectionStatus.tsx}
│  │     └─ charts/{PriceChart.tsx, useChartTheme.ts, useLiveCandle.ts, useHistoricalCandles.ts, chart-options.ts, ChartToolbar.tsx, types.ts}
│  ├─ shared/
│  │  ├─ ui/           {FlashCell.tsx, NumberCell.tsx, PercentTag.tsx, CoinCell.tsx, Sparkline.tsx (inline SVG), CommandPalette host, ThemeToggle.tsx, skeletons/*}
│  │  ├─ hooks/        {useTheme.ts, useBreakpoint.ts, useHotkey.ts}
│  │  ├─ store/        {uiStore.ts}
│  │  ├─ lib/
│  │  │  ├─ api/       {cgFetch.ts, throttle.ts, coingecko.endpoints.ts}
│  │  │  ├─ query/     {queryKeys.ts, persister.ts}
│  │  │  ├─ ws/        {TickerSocket.ts, types.ts, exchanges/{binance.ts, coinbase.ts}}
│  │  │  ├─ symbol-map/{buildSymbolMap.ts, overrides.ts, useSymbolMap.ts}
│  │  │  ├─ market/    {klines.ts, intervals.ts}
│  │  │  ├─ filters/   {catalogueSearchSchema.ts}
│  │  │  ├─ seo/Seo.tsx
│  │  │  ├─ format.ts  datetime.ts
│  │  ├─ types/        {coingecko.gen.ts, coingecko.ts}   # openapi-typescript generated + curated aliases
│  │  └─ i18n/         {index.ts, locales/en/*.json}
│  └─ test/setup.ts                 # MSW server, fake-indexeddb, WS mock
```

Path aliases (`@app`, `@features`, `@shared`, `@routes`) are declared once in `tsconfig.app.json` and honored by Vite via `vite-tsconfig-paths`. No deep relative imports.

---

## 6. Subsystem designs

### 6.1 Scaffolding, tooling & migration

**Key decisions (with rejected alternatives).**
- **Parallel-tree rewrite on a clean branch**, ported feature-by-feature. *Rejected:* incremental in-place dual-bundler (react-scripts and Vite can't co-own an entry; `allowJs` erodes strictness) and Next.js/RSC (violates frontend-only lock).
- **Vite + plugin-react-swc.** *Rejected:* Babel plugin (slower; kept only as fallback if the React Compiler Babel plugin is wanted), Rsbuild/Turbopack (weaker TanStack/Vitest fit).
- **AntD pinned to v5** + the React-19 patch. *Rejected:* v6 (violates the lock and throws away the token work). **Mitigation:** isolate *all* token usage behind `shared/ui` wrappers + the one `tokens.ts` module so a future v6 jump touches one layer.
- **ESLint 9 flat config**, type-aware rules + TanStack plugins; Prettier formats. *Rejected:* legacy airbnb eslintrc (deprecated parser, JS-only), Biome (promise rules still behind typescript-eslint).
- **pnpm** strict, lockfile committed, `engine-strict=true`. *Rejected:* npm/yarn (flat node_modules hides phantom deps).

**Corrections folded in (from the scaffolding verify):**
1. **CoinGecko is no longer reliably key-less.** `env.ts` treats `VITE_COINGECKO_DEMO_KEY` as **effectively required** and warns loudly if absent. The doc no longer claims a key-less public host. See §6.2 for the budget and the CORS consequence.
2. **Use `@tanstack/query-async-storage-persister`** (not the sync persister) — idb-keyval is async.
3. **ESLint TS-config needs `jiti`.** Resolved by using **`eslint.config.mjs`** (plain JS flat config — the type value of a `.ts` config is near-zero) **and** raising `engines.node >= 22.10`.
4. **`zod ^4`** for greenfield (not v3).
5. **Version-lock all `@tanstack/router*` packages** to the same minor (`^1.170.x`) to avoid pnpm peer friction.
6. **`routeTree.gen.ts` is committed** and CI verifies it's current (`tsr generate` + `git diff --exit-code`); a `pretypecheck` generate step runs before `tsc -b` so `tsc -b && vite build` ordering is safe.
7. Port `numberInputFormatter` too (or document its drop in favor of AntD `InputNumber.formatter`); replace `whole!` non-null assertion with `const [whole='0', decimal] = ...` to keep the showcase formatter assertion-free.

**Free-tier notes.** Scaffolding's job is to *enable* the split, not fight it: the WS layer never touches CoinGecko; the REST layer is wrapped by Query + the IndexedDB persister; `env.ts` centralizes the (required) demo key and base URLs. Binance/Coinbase public WS + CoinGecko REST are browser-reachable (subject to §6.2 CORS verification), which is what makes frontend-only viable.

**Skeleton — `vite.config.ts` (router plugin must precede react):**
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', routesDirectory: 'src/routes', generatedRouteTree: 'src/routeTree.gen.ts' }),
    react(),
    tsconfigPaths(),
  ],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ['antd', '@ant-design/icons'],
          charts: ['lightweight-charts'], // lazy on coin-detail only
          query: ['@tanstack/react-query', '@tanstack/react-query-persist-client'],
        },
      },
    },
  },
});
```

**Skeleton — `src/main.tsx` (the patch import MUST be first):**
```tsx
import '@ant-design/v5-patch-for-react-19'; // before any antd import
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { AppProviders } from '@app/providers/AppProviders';
import { router } from '@app/router/router';
import '@app/theme/global.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');
createRoot(rootEl).render(
  <StrictMode>
    <AppProviders><RouterProvider router={router} /></AppProviders>
  </StrictMode>,
);
```

---

### 6.2 Server-state / caching (TanStack Query v5)

**Key decisions (with rejected alternatives).**
- **One tuned `QueryClient`** (long `staleTime`, `gcTime` 24h for persistence, `refetchOnWindowFocus: false` — the #1 cause of silent 429 storms — and a 429-aware retry). *Rejected:* per-hook clients; default focus refetch.
- **`persistQueryClient` (full-cache) to IndexedDB.** *Rejected:* `experimental_createPersister` (still experimental; loses single instant-boot hydration); raw localStorage (sync, 5MB cap, blocks main thread).
- **Global throttle + `Retry-After`-aware backoff in one `cgFetch`.** *Rejected:* relying on TanStack's default uncoordinated exponential retry.
- **`openapi-typescript` v7 for types-only.** *Rejected:* the official `coingecko-typescript` SDK — corrected rationale: it **is** BYO-fetch (so it would *not* fight our throttle), but its resource-client abstraction obscures the raw `Response`/`Retry-After` header and adds runtime bytes we don't need for ~5 endpoints. Commit a **spec snapshot** locally; v7 deprecated glob input.
- **Live price is not a Query concern** — REST seeds, WS overlays.

**Corrections / missing items folded in:**
- **CORS is the #1 deployment risk (high).** A custom `x-cg-demo-api-key` header turns every request into a CORS **preflight** (doubling count) and requires CoinGecko to allow that header. **Default to the query-param form `x_cg_demo_api_key=` (underscores) — a "simple request" that skips preflight.** This must be **empirically verified from the deployed origin before build**, because if CORS is blocked the no-backend premise breaks (the only escape — an edge proxy — contradicts the lock).
- **429 double-sleep bug (high).** Do **not** sleep inside `cgFetch`. Read `Retry-After`, attach it to the error, and let TanStack back off once: `retryDelay: (n, err) => err?.retryAfterMs ?? Math.min(1000 * 2**n, 30_000)`. Release the throttle token before any wait.
- **`throttle.ts` must be real (high).** A FIFO waiter queue with a concurrency counter (~4) **and** min-spacing (`lastStart` timestamp, ~120ms); unit-tested by firing 20 `acquire()` in one tick and asserting ≤4 in flight and no two starts <120ms apart. (TanStack fires queryFns synchronously on mount, so the burst case is the test that matters.)
- **`useWatchlistMarkets` must chunk ids (medium).** `coins/markets?ids=` caps at ~50 ids; chunk into batches of 50 via `useQueries` (each chunk its own cache entry) routed through the throttle.
- **Wire the `buster`/`maxAge` on the provider, not the persister** (see §4.3).
- **Pass `{ signal }` into `fetch`** so navigation cancels in-flight requests.
- **`gcTime` memory:** shorter `gcTime` for detail/OHLC queries (or a max-entries policy) so a tab left open for days doesn't grow the cache unbounded.
- **Error/empty/offline contract:** every hook names its `isError`/empty/skeleton states; a dev-only request counter in `cgFetch` logs req/min + a monthly estimate to catch a stray `refetchInterval` regression.

**Free-tier notes (corrected, conservative).** CoinGecko Demo (registered key) = **100 calls/min, 10,000 calls/month**; the **monthly cap is the binding constraint**. The unregistered public pool is much lower (~5–15/min, IP-shared) and is being deprecated — so **the demo key is effectively required**, and because it ships in the browser bundle it is publicly visible and shared across all users (survivable for a portfolio app with the persister, not for real traffic — stated honestly). Staying under: no price polling (WS does that), markets `staleTime` 2–5 min, detail 5 min, exchanges/derivatives 10 min, OHLC cached long with auto-granularity (1–2d=30m, 3–30d=4h, 31d+=4d; hourly/daily are paid-only and avoided), IndexedDB hydrate-then-SWR, and the throttle making a >100/min burst structurally impossible. An active 30-min session stays well under ~200 calls.

**Skeleton — `queryClient.ts`:**
```ts
import { QueryClient } from '@tanstack/react-query';
export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60_000,                 // markets-class data is server-cached ~15 min
        gcTime: 1000 * 60 * 60 * 24,           // resident long enough for the persister to dehydrate
        refetchOnWindowFocus: false,           // #1 silent-429 cause
        retry: (n, e) => {
          const s = (e as { status?: number })?.status;
          if (s === 429) return n < 3;         // backoff via retryDelay below
          if (s && s >= 400 && s < 500) return false;
          return n < 2;
        },
        retryDelay: (n, e) => (e as { retryAfterMs?: number })?.retryAfterMs
          ?? Math.min(1000 * 2 ** n, 30_000),  // single, coordinated backoff (no double sleep)
      },
    },
  });
}
```

**Skeleton — `cgFetch.ts` (query-param key, no internal sleep, AbortSignal):**
```ts
import { acquire } from './throttle';
const BASE = 'https://api.coingecko.com/api/v3';
const KEY = import.meta.env.VITE_COINGECKO_DEMO_KEY as string | undefined;

export class CgError extends Error {
  constructor(message: string, readonly status: number, readonly retryAfterMs?: number) { super(message); }
}
export async function cgFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const release = await acquire();             // global concurrency + spacing gate
  try {
    const sep = path.includes('?') ? '&' : '?';
    const url = `${BASE}${path}${KEY ? `${sep}x_cg_demo_api_key=${KEY}` : ''}`; // query-param = no preflight
    const res = await fetch(url, { headers: { accept: 'application/json' }, signal });
    if (res.status === 429) {
      const ra = Number(res.headers.get('retry-after') ?? 5) * 1000;
      throw new CgError('CoinGecko 429', 429, ra);   // do NOT sleep here; TanStack backs off
    }
    if (!res.ok) throw new CgError(`CoinGecko ${res.status}`, res.status);
    return (await res.json()) as T;
  } finally { release(); }                      // token released before any backoff
}
```

---

### 6.3 Real-time WebSocket live-price layer — THE HERO

This is the deepest subsystem. The verifier found three high-severity bugs in the original skeleton; **all are fixed below** and several are eliminated by a simplified connection model.

**Decision — single always-on all-market stream (resolves the highest-severity issues at once).** Use **one persistent connection to Binance `!miniTicker@arr`** (the whole market in one subscription) for the catalogue, detail, and watchlist. Subscriptions become **pure client-side refcounts with zero wire traffic** — no `SUBSCRIBE`/`UNSUBSCRIBE` frames ever, which sidesteps the 5-msg/s subscribe cap, the 1024-stream cap, and the "refcount doesn't drive the wire" bug. Kline streams for charts are added to the same combined connection. *Rejected:* per-symbol combined streams with dynamic SUBSCRIBE frames (the refcount-vs-wire mismatch, the 5-msg/s cap risk on fast scroll). *Rejected:* `react-use-websocket` / a `useEffect`-owned socket (ties lifetime to a component, re-opens on StrictMode double-invoke, no place to coalesce). *Rejected:* React Context for prices (no selector granularity — melts the table) and TanStack Query for ticks (request/response cache, not a push firehose).

**Other key decisions.**
- **Zustand flat `Record<symbol, Ticker>` read by a per-symbol selector** so only ticked cells re-render. *Never select the whole `bySymbol` map in a component* (lint/doc guard).
- **rAF-coalesced flush** — one store commit per animation frame; a 250ms `setTimeout` is only a non-DOM fallback (and moot because the socket closes when the tab is hidden).
- **Connection state machine** (`idle/connecting/live/reconnecting/paused/degraded`) with exponential backoff + full jitter; **proactive reconnect at 23h** (before Binance's 24h kill); **pause on `document.hidden`**.

**High-severity fixes folded in:**
1. **`parse()` returns `Ticker[]`, always.** `!miniTicker@arr` arrives as a JSON **array**; the old `if (Array.isArray) return null` dropped every catalogue tick. `onmessage` now does `for (const t of adapter.parse(e.data)) buffer.set(t.symbol, t)`. Handles all three wire shapes: bare array, `{stream,data}` envelope, bare object. Regression-tested with a recorded `!miniTicker@arr` sample.
2. **Connection state flows through the same rAF buffer** as ticks (pending `connectionState` flushed together), so prices and connection state commit on one schedule and can't interleave. Only a terminal `degraded` flushes immediately.
3. **The refcount model is now correct by construction** — with one always-on stream, refcounts only decide which symbols to *retain/prune* in the store, not what to send on the wire.

**Medium/low fixes folded in:**
- **HMR + StrictMode safety:** `socket.ts` adds `if (import.meta.hot) import.meta.hot.dispose(() => tickerSocket.destroy())`; `destroy()` removes the visibility listener, clears timers, closes the socket. The singleton is idempotent.
- **Geo-block failover (real, not a stub):** track `connectedAt`; if a close happens <2s after open N times consecutively, **flip the primary adapter to Coinbase and reset attempt** (don't back off forever on a Binance URL that will never connect from a US IP). The Coinbase adapter is implemented for real: legacy Exchange feed `wss://ws-feed.exchange.coinbase.com`, `ticker` channel, **`{type:'subscribe',product_ids,channel:'ticker'}` sent in `onopen` within 5s**, 24h % derived from `open_24h`, product ids in `BTC-USD` form (from the symbol-map). A one-line note marks this as the **legacy** Exchange feed (public, no JWT); Advanced Trade (`advanced-trade-ws.coinbase.com`) is a documented future path.
- **Circuit breaker:** after K consecutive failures, surface a hard **"offline — using snapshot prices"** state and stop hammering (essential under geo-block).
- **Watchdog / degraded detection (was missing):** a timer compares last-tick time; "no tick in N seconds while live" → `degraded` → forced reconnect, so the machine can't sit `live` over a silently dead socket.
- **Store eviction (was missing):** the all-market stream carries thousands of irrelevant pairs. `parse`/buffer **filters to symbols present in the symbol-map**; periodically prune symbols with zero refs and no snapshot, so memory grows with what the user views, not market breadth.
- **`seed()` merges missing keys only** (preserve live refs); never re-create all entries on refetch.
- **Accessibility & motion:** `LivePriceCell` is `aria-live="off"` (never spam SR 60×/s); a single polite live region elsewhere announces only the focused/watchlisted row; up/down uses **icon + color, not color alone**; `prefers-reduced-motion` disables the flash.
- **CSP:** the deploy must allow `connect-src wss://stream.binance.com wss://ws-feed.exchange.coinbase.com https://api.coingecko.com https://api.binance.com https://api.llama.fi …`.
- **Provider sequencing contract:** `persisted hydrate → seed → symbol-map ready → socket open`. `RealtimeProvider` gates the socket open on both the seed and the map being ready.

**Verified facts (hedges removed):** Binance spot WS pings every 20s / 60s pong window (browser auto-pongs — verified, not a guess); limits 1024 streams/conn, 5 incoming msg/s, 24h lifetime, 300 conns/5min/IP — all confirmed; `!miniTicker@arr` carries `e/s/c/o/h/l/v` and pushes ~1/s with only changed tickers.

**Free-tier notes.** Zero CoinGecko cost for any live price/Δ — all from free, key-less Binance `!miniTicker@arr` (one subscription) + per-symbol `@kline_<iv>` for charts, Coinbase `ticker` on failover. Binance limits respected by the single-stream model (no SUBSCRIBE spam, proactive 23h reconnect, browser-handled keepalive).

**Skeleton — `TickerSocket.ts` (array parse, buffered state, watchdog, destroy):**
```ts
import type { ConnectionState, Ticker } from './types';
import { binanceAdapter } from './exchanges/binance';

type FlushFn = (batch: Record<string, Ticker>, state: ConnectionState) => void;
const MAX_BACKOFF = 30_000, BASE_BACKOFF = 500;
const PROACTIVE_MS = 23 * 60 * 60 * 1000;       // before the 24h kill
const STALE_MS = 15_000;                        // watchdog: no tick while "live" => degraded

export class TickerSocket {
  private ws: WebSocket | null = null;
  private state: ConnectionState = 'idle';
  private pendingState: ConnectionState | null = null;
  private attempt = 0;
  private buffer = new Map<string, Ticker>();
  private rafId: number | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private refs = new Map<string, number>();
  private lastTickAt = 0;
  private connectedAt = 0;
  private fastCloses = 0;
  private adapter = binanceAdapter;

  constructor(private readonly flush: FlushFn) {
    document.addEventListener('visibilitychange', this.onVisibility);
    setInterval(this.watchdog, STALE_MS);
  }

  subscribe(symbol: string): () => void {
    this.refs.set(symbol, (this.refs.get(symbol) ?? 0) + 1);
    this.ensureOpen();
    return () => {
      const n = (this.refs.get(symbol) ?? 1) - 1;
      n <= 0 ? this.refs.delete(symbol) : this.refs.set(symbol, n);
    };
  }

  private ensureOpen() {
    if (this.ws || document.hidden) return;
    this.setState('connecting');
    this.ws = new WebSocket(this.adapter.url());      // single all-market stream
    this.connectedAt = Date.now();
    this.ws.onopen = () => { this.attempt = 0; this.fastCloses = 0; this.setState('live'); this.armProactive(); this.adapter.onOpen?.(this.ws!); };
    this.ws.onmessage = (e) => {
      for (const t of this.adapter.parse(e.data)) {   // <-- always an array; never drops
        if (this.refs.has(t.symbol) || this.adapter.inMap(t.symbol)) { this.buffer.set(t.symbol, t); this.lastTickAt = Date.now(); }
      }
      this.scheduleFlush();
    };
    this.ws.onclose = () => this.handleDrop();
    this.ws.onerror = () => this.ws?.close();
  }

  private scheduleFlush() {
    if (this.rafId != null) return;
    const commit = () => {
      this.rafId = null;
      const state = this.pendingState ?? this.state; this.pendingState = null;
      if (this.buffer.size === 0 && state === this.state) return;
      const batch = Object.fromEntries(this.buffer); this.buffer.clear();
      this.state = state;
      this.flush(batch, state);                       // ticks + connection state, ONE schedule
    };
    this.rafId = typeof requestAnimationFrame !== 'undefined'
      ? requestAnimationFrame(commit) : (setTimeout(commit, 250) as unknown as number);
  }

  private handleDrop() {
    const fast = Date.now() - this.connectedAt < 2000;
    this.cleanupSocket();
    if (document.hidden) return this.setState('paused');
    if (fast && ++this.fastCloses >= 3) { this.failover(); return; }   // geo-block / CSP
    if (this.attempt >= 8) return this.setState('degraded');           // circuit breaker
    this.setState('reconnecting');
    const backoff = Math.min(MAX_BACKOFF, BASE_BACKOFF * 2 ** this.attempt++);
    this.timers.push(setTimeout(() => this.ensureOpen(), Math.random() * backoff)); // full jitter
  }

  private failover() { this.adapter = this.adapter.fallback(); this.attempt = 0; this.fastCloses = 0; this.setState('reconnecting'); this.ensureOpen(); }
  private watchdog = () => { if (this.state === 'live' && Date.now() - this.lastTickAt > STALE_MS) { this.setState('degraded'); this.ws?.close(); } };
  private armProactive() { this.timers.push(setTimeout(() => { this.attempt = 0; this.ws?.close(); }, PROACTIVE_MS)); }
  private onVisibility = () => { if (document.hidden) { this.setState('paused'); this.ws?.close(); } else { this.attempt = 0; this.ensureOpen(); } };
  private setState(s: ConnectionState) { this.pendingState = s; if (s === 'degraded') this.flush({}, s); else this.scheduleFlush(); }
  private cleanupSocket() { if (this.ws) { this.ws.onclose = null; this.ws.close(); this.ws = null; } }
  destroy() { document.removeEventListener('visibilitychange', this.onVisibility); this.timers.forEach(clearTimeout); this.cleanupSocket(); }
}
```

**Skeleton — `realtime.store.ts` (subscribeWithSelector, ref-stable merge, missing-key seed):**
```ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ConnectionState, Ticker, Candle } from '@shared/lib/ws/types';

interface RealtimeState {
  bySymbol: Record<string, Ticker>;
  candles: Record<string, Candle>;               // `${symbol}@kline_${iv}`
  connection: ConnectionState;
  flush: (batch: Record<string, Ticker>, conn: ConnectionState) => void;
  seed: (snapshot: Record<string, Ticker>) => void;
  setCandle: (key: string, bar: Candle) => void;
}

export const useRealtimeStore = create<RealtimeState>()(
  subscribeWithSelector((set) => ({           // REQUIRED for the chart/alert selector-subscribe
    bySymbol: {}, candles: {}, connection: 'idle',
    flush: (batch, conn) => set((p) => {
      const ticks = Object.keys(batch).length > 0;
      if (!ticks) return p.connection === conn ? p : { ...p, connection: conn };
      return { ...p, connection: conn, bySymbol: { ...p.bySymbol, ...batch } }; // stable refs for untouched
    }),
    seed: (snap) => set((p) => {
      const next = { ...p.bySymbol };
      for (const [k, v] of Object.entries(snap)) if (!(k in next)) next[k] = v;  // missing keys only
      return { ...p, bySymbol: next };
    }),
    setCandle: (key, bar) => set((p) => ({ ...p, candles: { ...p.candles, [key]: bar } })),
  })),
);

export const useTicker = (symbol?: string) =>
  useRealtimeStore((s) => (symbol ? s.bySymbol[symbol] : undefined));
```

**Skeleton — `useTickerStream.ts`:**
```ts
import { useEffect } from 'react';
import { useTicker } from '../store/realtime.store';
import { tickerSocket } from '../socket';
import { useSymbolFor } from '@shared/lib/symbol-map/useSymbolMap';

export function useTickerStream(coinGeckoId?: string) {
  const symbol = useSymbolFor(coinGeckoId);     // 'bitcoin' -> 'BINANCE:BTCUSDT'
  const ticker = useTicker(symbol);
  useEffect(() => {
    if (!symbol) return;                        // unmappable: caller renders snapshot + badge
    return tickerSocket.subscribe(symbol);      // pure local refcount, zero wire traffic
  }, [symbol]);
  return { ticker, symbol };
}
```

---

### 6.4 Charts (lightweight-charts v5)

**Key decisions (with rejected alternatives).**
- **Imperative ref-based wrapper** that creates the chart **once** and mutates via refs. *Rejected:* `react-financial-charts`/`recharts`/`@ant-design/plots` (SVG/DOM, choke on streaming financial candles); a declarative wrapper that `setData` on every render (re-seed flicker).
- **Seed history from Binance REST `/api/v3/klines`** at the user-selected interval (same exchange as the live WS → the seed's last bucket and the WS's first in-progress bucket align to the millisecond). *Rejected:* CoinGecko OHLC as the primary seed (fixed granularities almost never match an arbitrary live interval → disjoint grids). CoinGecko is the **fallback** (see geo-block below).
- **All chart colors from AntD tokens via `useChartTheme()`** (see §4.2).
- **v5 `autoSize: true`** with a ResizeObserver fallback.

**Corrections folded in (the verifier found 4 high-severity issues):**
1. **Rationale corrected (was a false premise):** Binance **kline** streams push every **2000ms** (~0.5/s), not "10×/sec." The imperative pattern is justified by canvas immutability and avoiding chart re-creation — **not** tick frequency. Sub-second motion, if wanted, comes from overlaying the in-progress candle's `close` from the `@trade`/`@miniTicker` stream (debounced to a frame). The two cadences are documented explicitly.
2. **`subscribeWithSelector` is a hard contract** (§6.3 store). The chart's `store.subscribe(selector, listener, {fireImmediately})` only works because the realtime store is wrapped in `subscribeWithSelector` — stated as non-negotiable, not assumed.
3. **Series-type toggle swaps the series on the existing chart** (`chart.removeSeries(old)` + `chart.addSeries(new)` + re-apply seed), keyed on `[kind]` in a *separate* effect. The chart is created in a `[]`-deps mount effect. No more chart teardown/zoom-loss/flicker on toggle.
4. **Seed-vs-live ordering is gated at runtime** (not a dev assert): a `seededRef` is set true after `setData()`; `useLiveCandle` drops/queues ticks until seeded and **skips any bar with `time < lastSeedTime`** (lightweight-charts requires ascending time; equal time replaces). The latest live bar is re-applied after a re-seed.

**Missing items folded in.**
- **Geo-block (HTTP 451) is a first-class failure mode**, not "noted." Detect 451/refused on klines **or** WS-connect failure and **fall back to CoinGecko OHLC for the whole chart history + disable the live overlay** (with a "no live feed" badge) — the fallback trigger is `(no pair) OR (geo-block) OR (WS connect fail)`. Try `data.binance.com` once before falling back.
- **Loading/error/empty states:** `PriceChart` destructures `{ data, isLoading, isError }`; renders Skeleton while loading, an `Alert` with retry on error, the "no live feed" badge when unmappable.
- **Accessibility:** `role="img"` + `aria-label` (symbol/interval/last price), a visually-hidden `aria-live="polite"` throttled price, a data-table/CSV fallback, `prefers-reduced-motion`.
- **Partial seed bar:** keep Binance's last (partial) kline row; the WS `update()` for the same `openTime` replaces it. Do **not** trim it (avoids a 1-bar gap).
- **Reconnect re-seed:** after any reconnect / tab-resume / the 24h kill, refetch klines to backfill the gap (`update()` can't insert older bars).
- **Per-symbol price precision** from `exchangeInfo` `tickSize` (SHIB-class coins).
- Query owns **closed** history; the **open** bar is owned by the store (so `staleTime` ≠ interval duration confusion is removed).

**Free-tier notes.** History from free Binance REST `/api/v3/klines` (≤500 bars, well within weight budget, cached hard by Query). One shared combined Binance connection for all charts + tickers (never one socket per chart). CoinGecko OHLC only as fallback (auto-granularity, monthly cap aware).

**Skeleton — `PriceChart.tsx` (chart created once; series swapped separately; seed-gated live):**
```tsx
import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, AreaSeries, type IChartApi, type ISeriesApi, type CandlestickData, type UTCTimestamp } from 'lightweight-charts';
import { useChartTheme } from './useChartTheme';
import { baseChartOptions } from './chart-options';
import { useHistoricalCandles } from './useHistoricalCandles';
import { useLiveCandle } from './useLiveCandle';
import type { ChartInterval, SeriesKind } from './types';

export function PriceChart({ symbol, interval, kind, height = 420 }:
  { symbol: string; interval: ChartInterval; kind: SeriesKind; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick' | 'Area'> | null>(null);
  const seededRef = useRef(false);
  const t = useChartTheme();
  const { data: seed, isLoading, isError } = useHistoricalCandles(symbol, interval);

  useEffect(() => {                                   // create chart ONCE
    const el = containerRef.current; if (!el) return;
    const chart = createChart(el, { ...baseChartOptions, autoSize: true, height });
    chartRef.current = chart;
    return () => { chart.remove(); chartRef.current = null; seriesRef.current = null; };
  }, [height]);

  useEffect(() => {                                   // swap SERIES on kind change (no chart teardown)
    const chart = chartRef.current; if (!chart) return;
    if (seriesRef.current) chart.removeSeries(seriesRef.current);
    seriesRef.current = kind === 'candles' ? chart.addSeries(CandlestickSeries, t.candle) : chart.addSeries(AreaSeries, t.area);
    if (seed) { seriesRef.current.setData(seed as CandlestickData<UTCTimestamp>[]); chart.timeScale().fitContent(); seededRef.current = true; }
  }, [kind, seed, t]);

  useEffect(() => { chartRef.current?.applyOptions(t.chart); }, [t]);

  useLiveCandle(symbol, interval, seriesRef, seededRef);  // gated; skips bars older than last seed

  if (isError) return <ChartError symbol={symbol} />;
  return (
    <div role="img" aria-label={`${symbol} ${interval} price chart`} style={{ position: 'relative', height }}>
      {isLoading && <ChartSkeleton />}
      <div ref={containerRef} style={{ width: '100%', height }} />
    </div>
  );
}
```

**Skeleton — `useChartTheme.ts` (typed; tokens → chart options):**
```ts
import { useMemo } from 'react';
import { theme } from 'antd';
import { ColorType, LineStyle, CrosshairMode } from 'lightweight-charts';

export function useChartTheme() {
  const { token } = theme.useToken();
  return useMemo(() => ({
    chart: {
      layout: { background: { type: ColorType.Solid, color: token.colorBgContainer }, textColor: token.colorTextSecondary, fontFamily: token.fontFamily },
      grid: { vertLines: { color: token.colorBorderSecondary, style: LineStyle.Dotted }, horzLines: { color: token.colorBorderSecondary, style: LineStyle.Dotted } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: token.colorBorder },
      timeScale: { borderColor: token.colorBorder, timeVisible: true, secondsVisible: false },
    },
    candle: { upColor: token.colorSuccess, downColor: token.colorError, wickUpColor: token.colorSuccess, wickDownColor: token.colorError, borderVisible: false },
    area: { lineColor: token.colorPrimary, topColor: token.colorPrimaryBg, bottomColor: 'rgba(0,0,0,0)', lineWidth: 2 as const },
  }), [token]);
}
```

---

### 6.5 AntD 5 design system, theming & the virtualized table

**Key decisions (with rejected alternatives).**
- **One `ConfigProvider`** with the Aurora token object + algorithm switching; a tiny `global.css` (font-face + flash keyframes + our own `--mkt-*` vars). *Rejected:* per-component CSS overrides (the legacy `!important` approach — brittle); a second CSS framework (redundant with AntD Space/Flex).
- **AntD built-in `<Table virtual />`** (core since 5.9; no extra dep). *Rejected:* `virtualizedtableforantd` (unmaintained third-party body hack); rolling our own with `@tanstack/react-virtual` (reimplements sticky headers/sorting/selection AntD gives themed for free).
- **Per-cell Zustand subscription + CSS keyframe flash.** *Rejected:* live price in Query cache invalidated per tick (thrashes the cache); inline `style={{background:…}}` per tick (allocates objects, can't composite, bypasses tokens).
- **Command palette on AntD `Modal + Input + List`** (zero new runtime dep, themed). *Rejected:* `cmdk` (unstyled, own focus mgmt that can conflict with AntD; React-19 peer unverified) — but see the a11y cost below.
- **Dark default, persisted in the Zustand UI-prefs slice** via `matchMedia` fallback. *Rejected:* the legacy `useLocalStorage` pattern (scatters state, no cross-tab sync).

**Corrections folded in (verifier found 3 high-severity):**
1. **`FlashCell` logic bug fixed.** The original set `prev.current = price` *before* comparing, so direction was always equal and the flash never cleared. Corrected: capture previous **before** mutating, compute direction against the old value, then update the ref; **restart the keyframe on repeated same-direction ticks** via a numeric `tick` key (re-adding an existing class doesn't replay a CSS animation); clear via `onAnimationEnd`, not a drift-prone 600ms timeout.
2. **Drop `rowSelection` for the virtual table; render the watchlist star as a custom fixed-left first column.** `virtual` + `rowSelection` + fixed columns is documented-flaky (checkbox col and fixed col both resolve to `left:0` and overlap on horizontal scroll). A custom `render`-based star column is robust, gives proper `aria-label`/role, and is decided now (not deferred to a smoke test).
3. **Flash colors use our own `--mkt-*` vars** (`cssVar:{key}` does not emit `--aurora-*`); see §4.2.

**Missing items folded in.**
- **Sparkline = inline SVG `<path>`**, not 250 lightweight-charts instances (a per-row canvas is a perf trap). Markets must request `sparkline=true&price_change_percentage=24h,7d` (note the larger payload + larger persisted cache entry — currently `sparkline=false`).
- **Error/empty/stale states** for the table (query failure, WS-disconnected degraded UX, no-mapping snapshot badge), **persisted-cache hydration gate** (don't flash empty then snap to data; CommandPalette must not open with 0 coins), and **theme FOUC fix** (inline pre-hydration script sets `data-theme` on `<html>` + a matching background before React mounts, since dark is JS-resolved).
- **Pagination dropped cleanly** — the catalogue is a fixed top-250 virtualized list; **do not migrate the old `pageSize` pref** into a store that no longer paginates (dead state). >250 ("load more") is explicitly out of scope.
- **a11y:** virtual table fixed `scroll={{ x:<num>, y:<num> }}` and uniform row height; keep fixed columns to just `CoinCell` (left) + actions (right); ⌘K palette gets `role=listbox/option`, `aria-activedescendant`, real ↑/↓/Enter/Esc and focus return.
- **Bundle budget:** lightweight-charts lazy-loaded on coin-detail only; route-level code splitting; size-limit per-chunk budgets (§6.6).

**Free-tier notes.** Touches no rate-limited API directly — renders the cached markets snapshot; 250 sparklines come from the single markets response (`sparkline_in_7d`), zero extra calls; ⌘K searches the in-memory cached list. All price motion is WS. Only network cost is one-time fingerprinted font woff2.

**Skeleton — `tokens.ts`:**
```ts
import type { ThemeConfig } from 'antd';
export const market = { up: '#16c784', upBg: 'rgba(22,199,132,.16)', down: '#ea3943', downBg: 'rgba(234,57,67,.16)' } as const;
const shared: ThemeConfig['token'] = {
  colorPrimary: '#5b6cff', colorInfo: '#5b6cff', colorSuccess: market.up, colorError: market.down,
  borderRadius: 10, borderRadiusLG: 14, controlHeight: 38,
  fontFamily: "'Inter Variable', system-ui, sans-serif", fontSize: 14, motionDurationMid: '0.15s', wireframe: false,
};
export const lightTokens: ThemeConfig['token'] = { ...shared, colorBgLayout: '#f6f7fb', colorBgContainer: '#ffffff' };
export const darkTokens: ThemeConfig['token'] = { ...shared, colorBgLayout: '#0b0e14', colorBgContainer: '#12161f', colorBorderSecondary: '#1d2230' };
export const components: ThemeConfig['components'] = {
  Table: { headerBg: 'transparent', headerSplitColor: 'transparent', rowHoverBg: 'rgba(91,108,255,.06)', cellPaddingBlock: 10, cellFontSize: 13 },
  Layout: { headerHeight: 56, headerPadding: '0 20px' }, Menu: { itemBorderRadius: 8, itemHeight: 40 }, Card: { borderRadiusLG: 14 },
};
```

**Skeleton — `FlashCell.tsx` (corrected logic; reads live OR snapshot per §4.1):**
```tsx
import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useRealtimeStore } from '@features/realtime/store/realtime.store';
import { formatPrice } from '@shared/lib/format';
import styles from './FlashCell.module.css';   // uses --mkt-up-bg / --mkt-down-bg + prefers-reduced-motion

export const FlashCell = memo(function FlashCell({ symbol, fallbackPrice }: { symbol?: string; fallbackPrice: number }) {
  const live = useRealtimeStore((s) => (symbol ? s.bySymbol[symbol]?.price : undefined));
  const isLive = live != null;
  const price = live ?? fallbackPrice;          // live tick OR snapshot — single source per §4.1
  const prevRef = useRef(price);
  const [dir, setDir] = useState<'up' | 'down' | null>(null);
  const [tick, setTick] = useState(0);          // forces keyframe restart on same-direction repeats

  useEffect(() => {
    const prev = prevRef.current;
    if (price === prev) return;
    setDir(price > prev ? 'up' : 'down');
    setTick((n) => n + 1);
    prevRef.current = price;
  }, [price]);

  return (
    <span
      key={tick}
      aria-live="off"
      onAnimationEnd={() => setDir(null)}
      className={clsx(styles.cell, isLive && dir === 'up' && styles.flashUp, isLive && dir === 'down' && styles.flashDown)}
      title={isLive ? undefined : 'snapshot price'}
    >
      {formatPrice(price)}{!isLive && <span className={styles.badge} aria-label="snapshot, not live" />}
    </span>
  );
});
```

**Skeleton — `MarketTable.tsx` (virtual; custom star column, no rowSelection; mobile fallback):**
```tsx
import { Table, Grid } from 'antd';
import type { TableProps } from 'antd';
import { useMarketColumns } from './columns';
import { MarketCardList } from './MarketCardList';
import { MarketTableSkeleton } from '@shared/ui/skeletons/MarketTableSkeleton';
import type { CoinMarket } from '@shared/types/coingecko';

export function MarketTable({ data, isLoading, onQuickLook }:
  { data: CoinMarket[] | undefined; isLoading: boolean; onQuickLook: (c: CoinMarket) => void }) {
  const screens = Grid.useBreakpoint();
  const columns = useMarketColumns({ onQuickLook }); // includes a custom fixed-left star column
  if (isLoading && !data) return <MarketTableSkeleton rows={20} />;
  if (!screens.md) return <MarketCardList data={data ?? []} onQuickLook={onQuickLook} />;
  const props: TableProps<CoinMarket> = {
    virtual: true, scroll: { x: 1600, y: 640 },        // both required for virtual
    columns, dataSource: data ?? [], rowKey: 'id', pagination: false, size: 'middle',
  };                                                    // NO rowSelection (flaky w/ fixed cols in virtual)
  return <Table<CoinMarket> {...props} />;
}
```

---

### 6.6 Testing, CI/CD, DX, PWA, Observability (re-reviewed by tech lead — no external verifier)

I sanity-checked every tool/version against 2026 reality. The original design's *recovered* form was a corrupted "probe" stub; the decisions array survived and is sound with the following corrections.

**Decisions (post-review).**
- **Vitest + Testing Library 16 + jest-dom 6.** Shares the Vite transform/aliases. **Correction:** the design said "Vitest 3"; the scaffolding pins **Vitest 4** (registry `latest` 4.1.8) — use **4** to match the rest of the stack. *Rejected:* Jest 30 + ts-jest (a second toolchain mirroring Vite by hand).
- **MSW v2 for HTTP and WebSocket.** `ws.link` + `client.send` reproduces CoinGecko REST and the Binance stream; `setupServer` for Vitest, `setupWorker` for dev. *Rejected:* nock (HTTP only) + jest-websocket-mock (WS only). **Added (was a gap):** jsdom has **no WebSocket and no IndexedDB** — both hero subsystems — so the test setup **must** include **`fake-indexeddb`** and MSW's WS mock (or `mock-socket`); these are now explicit dev deps and `src/test/setup.ts` wires them. This is the regression harness that would have caught the `!miniTicker@arr` array-parse bug.
- **Playwright E2E with a fake WS** via `addInitScript` + `page.route` mocks. *Rejected:* Cypress (weaker WS story); real exchange WS (non-deterministic, and geo-blocked from US CI).
- **Single `ci.yml`** (typecheck → lint → unit/coverage → build → e2e → lighthouse). `linters.yml` is Node-12 EOL and is deleted. **Correction confirmed:** Lighthouse 12 removed the PWA category, so PWA is checked by a manifest test + an offline Playwright test. *Rejected:* per-tool workflows (no shared cache); lhci on a dev server (flaky).
- **`size-limit` + `preset-app`** per-chunk gzip budgets (antd / charts / query / route chunks budgeted independently). *Rejected:* bundlewatch (less maintained); Lighthouse byte-weight (misses per-chunk regressions). This enforces the §6.5 bundle-budget gap.
- **Husky 9 + lint-staged + commitlint; Renovate** (grouped ecosystems, pinned Action SHAs). *Rejected:* full suite on pre-commit (gets bypassed); Dependabot (no grouping). **Correction:** pre-commit runs lint-staged on staged files only — but because ESLint is type-aware (`projectService`), keep the pre-commit scope to lint/format and run the full type-aware lint + `typecheck` in CI (type-aware lint on staged-only files is unreliable).
- **`@sentry/react` v9** error boundary; `beforeSend` drops WS-reconnect noise + 429s; source maps only on tags (free 5k errors/mo). *Rejected:* LogRocket (replay-heavy); `window.onerror` POST (no symbolication). **Added:** a global error→AntD-notification bridge (via `App.useApp()`) so async Query/WS failures surface as toasts, not just Sentry — this closes the scaffolding "where do rate-limit toasts live" gap.
- **`vite-plugin-pwa` (`generateSW`, `autoUpdate`)**; precache the shell, SWR on `api.coingecko.com`, **never cache the WS** (so stale ticks never surface). **Correction:** pin to the current `vite-plugin-pwa` major compatible with Vite 7 at install (the "0.21" pin is stale) and confirm the Workbox runtime-caching route excludes WS upgrade requests. *Rejected:* hand-written SW (stale-price risk); injectManifest (overkill).
- **Cloudflare Pages per-PR previews** (deterministic URL CI smoke-tests; repo already ships `public/_redirects`). *Rejected:* GitHub Pages (no per-PR previews); Netlify (lower free bandwidth).

**DX.** `pnpm` scripts: `dev`, `build` (`tsr generate` → `tsc -b` → `vite build`), `preview`, `lint`, `typecheck`, `test`, `test:watch`, `e2e`. TanStack Query + Router devtools dev-only/lazy. `engine-strict` + committed lockfile enforce the toolchain.

**Free-tier notes.** Sentry free 5k errors/mo (errors-only, noise filtered, tag-only source maps). Cloudflare Pages free previews. All CI runners use the GitHub free tier; Lighthouse runs against the built `dist` artifact (deterministic). No paid services.

**Skeleton — `vitest.config.ts` + `src/test/setup.ts` intent:**
```ts
// vitest.config.ts — shares vite.config via mergeConfig; environment 'jsdom', globals true, setupFiles ['./src/test/setup.ts']
// setup.ts wires: MSW setupServer (REST + ws.link), fake-indexeddb/auto, @testing-library/jest-dom,
//                 and a deterministic WS frame player feeding recorded !miniTicker@arr + @kline samples.
```

---

### 6.7 Feature depth & data sources

**Key decisions (with rejected alternatives).**
- **DeFiLlama (free, no key) as a second REST source** through the same Query layer: `GlobalTvlCard` (`/v2/historicalChainTvl`), `StablecoinsWidget` (`/stablecoins?includePrices=true`), `YieldsWidget` (`/pools`). *Rejected:* CoinGecko `/global`+DeFi (burns the scarce monthly budget); DeFiLlama Pro ($300/mo).
- **Versioned Zustand watchlist** (multiple named lists, per-coin alerts). *Rejected:* `useLocalStorage` + favourites context (untyped, no versioning, can't express alerts).
- **Client-side price alerts** evaluated against the existing WS tick stream (zero extra REST). *Rejected:* polling `/simple/price` (burns budget, laggy); Web Push/service-worker (needs a push server — violates the lock; documented as future).
- **⌘K palette: AntD primitives + uFuzzy** over the cached coin list + debounced `/search` fallback. *Rejected:* cmdk (React-19 peer unverified, unstyled); Algolia/Meilisearch (external service + key).
- **TanStack Router typed search params (Zod) as the single source of truth** for catalogue filters/sort/pagination. *Rejected:* local/Zustand state (not shareable); legacy `useTable.js` localStorage filters (not linkable, stale across tabs).
- **i18n: react-i18next + date-fns locales + `Intl.NumberFormat`.** *Rejected:* react-intl (heavier); hand-rolled `t()`.
- **SEO/OG (corrected — see below).**

**Corrections folded in (verifier found 3 high-severity):**
1. **Watchlist migration uses the wrong Zustand mechanism.** `persist`'s `migrate(state, version)` only runs when a blob already exists under *this* store's key (`cs.watchlist`) — which it never does for legacy users, so the legacy `favourites` array is never read and the list is silently lost. **Fix:** fold the legacy `favourites` (a bare `string[]` under `LOCAL_STORAGE_KEYS.favourites`) **outside** `migrate()` — in `onRehydrateStorage` (or a one-time `watchlist.bootstrap.ts` on store creation) that reads `localStorage.getItem('favourites')` when `lists` is empty, folds it into a "Default" list, and **leaves the legacy key intact for one release** as a rollback net. `version`/`migrate` are reserved for future `cs.watchlist` shape changes. Unit-tested against the real `string[]` shape.
2. **Alert evaluator canonical symbol + throttle.** Keys must use the §4.4 canonical exchange-qualified form (Binance `btcusdt` vs Coinbase `BTC-USD` otherwise silently miss). **Fix:** evaluate at most every 250–500ms off the *batched* tick (not per raw message), snapshot `rules` into an array before iterating, add a per-rule cooldown/last-fired timestamp (no oscillation spam), and only consider symbols that actually changed. A dev invariant logs rules referencing a symbol absent from the prices map. **Surface at rule-creation time** that a coin with no WS pair can never fire.
3. **SEO/OG rationale corrected.** React 19 metadata hoisting helps the **client DOM only** and does **not** dedupe tags or help non-JS social crawlers. **Crawlable OG requires the build-time prerender** — name a real plugin (Vike, `@prerenderer/rollup-plugin`, or `react-snap`, verified against the Vite major), accept that dynamic `/coin/:id` OG for the long tail won't unfurl without SSR or an edge OG-image function, and own `<title>` dedup with a single `<Seo>` per route.

**Other corrections.** Budget against the conservative CoinGecko ceiling: ⌘K `/search` capped to 1 in-flight, debounce 400–500ms, min query length ≥2; re-pin `@leeoniya/ufuzzy ^1.0.19`. Write **real Zod schemas** for the DeFiLlama fields actually consumed (drop the `z.any()` placeholders); confirm `historicalChainTvl.date` is unix seconds and map to `{ time, value }`; treat the three Llama hosts as **independent failure domains** (DeFiLlama 403'd an automated fetch during review — the degrade path is load-bearing). Notification API: request permission from a **user gesture**, feature-detect `isSecureContext`, on iOS-non-PWA skip to the in-app AntD fallback. Memoize the uFuzzy haystack/index outside the per-keystroke call. `Intl.NumberFormat` needs a custom path for sub-cent prices and for non-fiat vs-currencies (BTC/ETH aren't ISO codes — `style:'currency'` throws). Guard `startAlertEvaluator` and i18n init against StrictMode double-mount. Genuinely-local view prefs (density, column config) live in the UI-prefs Zustand slice (the filters move to the URL).

**Free-tier notes.** DeFiLlama free/no-key (5–10 min `staleTime`, no polling). Alternative.me Fear & Greed free/no-key (~daily; read `time_until_update` seconds, ~1h staleTime). CoinGecko `/search` only on a true cache miss (debounced, cached long). All alert evaluation rides the WS at zero REST cost.

**Skeleton — `watchlist.bootstrap.ts` (legacy fold OUTSIDE persist.migrate):**
```ts
import { useWatchlistStore } from './watchlist.store';
const LEGACY_KEY = 'favourites'; // LOCAL_STORAGE_KEYS.favourites in the old app
export function bootstrapLegacyWatchlist() {
  const s = useWatchlistStore.getState();
  const def = s.lists.default;
  if (def && def.coinIds.length > 0) return;             // already populated
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    const ids: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(ids) && ids.length) {
      ids.filter((x): x is string => typeof x === 'string').forEach((id) => s.addCoin(id, 'default'));
      // leave LEGACY_KEY intact for one release (rollback safety)
    }
  } catch { /* defensive: ignore malformed legacy blob */ }
}
```

**Skeleton — `catalogueSearchSchema.ts` (URL = source of truth):**
```ts
import { z } from 'zod';
export const catalogueSearchSchema = z.object({
  q: z.string().optional(),
  vs: z.enum(['usd', 'eur', 'btc', 'eth']).default('usd'),
  sort: z.enum(['market_cap_desc', 'market_cap_asc', 'volume_desc', 'price_change_24h_desc']).default('market_cap_desc'),
  category: z.string().optional(),
  page: z.number().int().min(1).catch(1).default(1),
  perPage: z.union([z.literal(50), z.literal(100), z.literal(250)]).default(100),
});
export type CatalogueSearch = z.infer<typeof catalogueSearchSchema>;
// route: createFileRoute('/')({ validateSearch: catalogueSearchSchema, ... })  — .catch/.default make hostile URLs safe
```

---

## 7. Phased roadmap

No big bang. Each phase ships behind the previous one's exit criteria.

| Phase | Goal | Key tasks | Deliverable | Exit criteria |
|---|---|---|---|---|
| **P0 — Scaffold & spike** | Stand up the toolchain; de-risk the load-bearing assumptions | Vite+React19+TS-strict tree, pnpm, ESLint flat (`.mjs`)/Prettier, path aliases, `env.ts`; **verify CoinGecko CORS from the deployed origin (query-param key)**; **verify Binance WS/REST reachability** from target regions; commit lockfile + `.nvmrc` (node ≥22.10) | Empty app boots; CI green (typecheck/lint/build) | App builds & runs under React 19; `pnpm lint` works on a fresh clone (jiti issue gone); **CORS + geo-block findings documented with the chosen fallback**; no peer warnings |
| **P1 — Server-state foundation** | Replace `useAPI`/`useLazyAPI` with Query | `queryClient`, `cgFetch` (query-param key, AbortSignal), **real `throttle.ts` + its test**, query-key factory, async IndexedDB persister with provider `buster`/`maxAge` + `isRestoring` gate, `openapi-typescript` gen + curated aliases, `useMarkets`/`useCoinDetail`/`useExchanges`/`useDerivatives`, chunked `useWatchlistMarkets` | Catalogue + exchanges render from cached REST | Throttle test passes (≤4 concurrent, ≥120ms spacing on a 20-call burst); no 429 in a normal session; cache hydrates from IndexedDB on reload with no double-fetch |
| **P2 — Theme & shell** | Make it not look stock | `tokens.ts`, `ThemeProvider` (algorithm + `cssVar:true`), `global.css` (`--mkt-*` vars + flash keyframes + reduced-motion), pre-hydration theme script (no FOUC), `AppLayout`/`Header`/`Sider`, TanStack Router file routes, route skeletons, error boundary + error→toast bridge | Themed shell + routed pages | Dark default with no light flash; lighthouse a11y ≥ 90; routes navigate with typed params; AntD looks unmistakably custom |
| **P3 — Virtualized catalogue** | The 250-row table | `MarketTable` (`virtual`, fixed `scroll`), typed `columns.tsx`, custom fixed-left star column (no rowSelection), inline-SVG `Sparkline`, `CoinCell`/`PercentTag`/`NumberCell`, mobile card fallback, watchlist Zustand + **legacy `favourites` bootstrap** | Working, themed, virtualized catalogue + watchlist | 250 rows scroll at 60fps (4× CPU throttle, paint-flashing); fixed columns don't overlap; legacy favourites migrate (unit-tested) |
| **P4 — Realtime hero** | Live prices flashing in the table | symbol-map (IndexedDB + version stamp + Binance/Coinbase forms + precision), `TickerSocket` (array parse, rAF buffer, backoff+jitter, watchdog, failover, circuit breaker, HMR destroy), `realtime.store` (`subscribeWithSelector`, missing-key seed, eviction), `useTickerStream`, `LivePriceCell` (corrected flash, snapshot badge), `ConnectionStatus`, `RealtimeProvider` sequencing gate; **WS mock harness + parse tests** | Live, flashing, self-healing prices | `!miniTicker@arr` array sample yields N tickers (regression test); only changed cells re-render (React Profiler); survives StrictMode + HMR with no leaked sockets; geo-block fails over to Coinbase or degrades to snapshot+badge |
| **P5 — Charts** | Live + historical coin-detail chart | `PriceChart` (create-once, series-swap, seed-gated live, autoSize), `useChartTheme`, `useHistoricalCandles` (Binance klines, cached), `useLiveCandle`, geo-block→CoinGecko-OHLC whole-chart fallback, loading/error/no-live-feed states, a11y + CSV fallback, reconnect re-seed, lazy-load the charts chunk | Deep-linkable coin-detail with live chart | Seamless seed→live join (no gap/duplicate bar); kind toggle keeps zoom; no chart re-create on data change; charts chunk not in initial bundle |
| **P6 — Depth & polish** | Senior product surface | DeFiLlama widgets (real Zod schemas, independent failure domains), Fear & Greed, trending, ⌘K palette (a11y combobox + uFuzzy + debounced search), URL-synced filters, price alerts (canonical symbol, throttled, gesture-gated notifications), i18n (+ crypto-aware number formatting), prerender for OG | Full-featured platform | ⌘K fully keyboard-operable; alerts fire off WS with no spam; filters shareable via URL; key routes prerender crawlable OG; one Llama host down doesn't break the others |
| **P7 — Hardening & ship** | Observability, PWA, CI gates | Sentry (noise-filtered, tag-only maps), `vite-plugin-pwa` (SWR REST, WS bypassed), `size-limit` budgets, Playwright E2E (fake WS), Lighthouse-on-dist, Cloudflare Pages previews, Renovate/Husky/commitlint | Production-ready, monitored, budgeted | All CI gates green; bundle within per-chunk budgets; offline shell works; PR previews smoke-tested; error rate visible in Sentry |

---

## 8. Migration notes (port vs delete, sequencing)

Grounded in the real existing files.

**PORT (rewritten to strict TS):**
- `src/utils/index.js` pure formatters → `src/shared/lib/format.ts` (`to2Decimal`, `moneyWithCommas`, `formatNumber`; decide `numberInputFormatter`/`toDecimal` — port or document drop). Replace `whole!` with destructuring defaults. **Verbatim-logic, the only code worth keeping as-is.**
- `src/endpoints.js` URL strings → `src/shared/lib/api/coingecko.endpoints.ts` + the typed `queryKeys.ts` factory. `ALL_TOKENS` becomes `useMarkets` (flip to `sparkline=true`); `CRYPTO_DETAILS(id)` → `useCoinDetail`; `FAVOURITE_TOKENS(favourites)` → **chunked** `useWatchlistMarkets` (the 50-id cap the old single-URL form silently violated); `EXCHANGES`/`DERIVATIVES` → `useExchanges`/`useDerivatives`.
- `src/pages/Cryptocurrencies/components/columns.js` → typed `features/catalogue/columns.tsx` (`ColumnsType<CoinMarket>`). The price column's `moneyWithCommas(current_price)` render → `<LivePriceCell coinGeckoId={record.id} fallbackPrice={record.current_price} />`. The `<Tag color={d<0?'red':'green'}>` 24h/7d cells → `<PercentTag>` reading tokens. The `fixed:'left'` on name & price is kept (CoinCell left), but the **right-side `Dropdown` + deprecated `Menu overlay=` is replaced** with AntD `Dropdown menu={{items}}` (the `overlay` API is deprecated).
- `LOCAL_STORAGE_KEYS.favourites` (`'favourites'`, a `string[]`) → versioned Zustand watchlist via the **`bootstrap` fold** (§6.7), not `persist.migrate`.
- `moment` date formats in `utils/index.js` (`dateFormat`/`dateFormatWithTime`) → `shared/lib/datetime.ts` (date-fns): `'MMM Do, YYYY'`→`'MMM do, yyyy'`, `'lll'`→`'MMM d, yyyy h:mm a'`.
- The *concepts* in `useTable.js` (density, column visibility) → UI-prefs Zustand slice + a `ColumnCustomizer` Drawer. **Do NOT port** `pageSize`/`paginationPlacement`/`tableScroll` (catalogue is now a fixed virtualized list).

**DELETE:**
- `react-scripts` + all CRA config; `react-redux`/`redux` (unused dead dep); `moment`; `react-router-dom` v5 (`src/routes/index.js`, `src/paths.js` → TanStack file routes); `react-icons` (→ `@ant-design/icons`, with a mapping table: `BsThreeDots→MoreOutlined`, `FiRefreshCcw→ReloadOutlined`, `AiFillCaretUp/Down→CaretUpOutlined/CaretDownOutlined`, `FcLike→HeartFilled`, `BsEye→EyeOutlined`, `IoMdLink→LinkOutlined`).
- `src/app/hooks/useAPI.js` + `useLazyAPI.js` (the `fetch`+`localStorage`+`DEV_MODE` cache) → TanStack Query. **Note:** `useAPI`'s `useEffect` deps are `[refresh]` only — it never refetches when `url` changes, a latent bug Query eliminates.
- `src/app/hooks/useLocalStorage.js` + `getLs`/`setLS` → Zustand `persist`.
- `useTable.js`'s pagination/scroll/legacy-icon machinery and the Bootstrap-ish utility classes (`d-flex`, `mr-2`, `container-fluid`) → AntD `Space`/`Flex`/`Grid` + tokens.
- `antd/dist/reset.css` global import and the `css/index.css` `!important` table overrides → token theming + `global.css` resets under `@layer`.

**Sequencing.** Data layer (P1) and router migration are the genuinely slow parts and are total rewrites regardless — do them first on the clean tree, port the pure formatters/endpoints early (they unblock everything), and migrate favourites in P3 alongside the table so the watchlist lands with its data intact.

---

## 9. Risks & open questions (with recommendation)

| # | Risk / question | Recommendation |
|---|---|---|
| 1 | **CoinGecko CORS + demo-key in-browser.** Header auth triggers preflight; the key is publicly visible in the bundle; key-less is now ~5–15/min and deprecating. | **Use the query-param key form (no preflight). Verify CORS from the deployed origin in P0.** Accept the exposed demo key for a portfolio app (rate-limited per key; persister cushions it). If CORS is hard-blocked, the only fix is an edge proxy — which breaks the lock; surface that decision to stakeholders *before* P1. |
| 2 | **Binance geo-block (HTTP 451) from the user's IP** (US + others) breaks both WS and klines. | Ship the failover (Coinbase WS) + whole-chart CoinGecko-OHLC fallback + snapshot-badge degrade. **Open question:** is the primary audience in a Binance-restricted region? If yes, consider making **Coinbase the default adapter** and Binance the fallback. |
| 3 | **Long-tail coins with no exchange pair** never get a live tick. | The §4.1 snapshot badge + slow REST refetch for visible/watchlisted no-pair coins. Don't pretend WS covers everything. |
| 4 | **USDT (Binance) vs USD (CoinGecko) quote mismatch.** | Label the live cell's quote currency; never present USDT and USD as the same number. A USDT depeg is then explainable, not a bug report. |
| 5 | **In-browser demo key shared across all users burns 10k/month.** | Survivable for a portfolio/demo with the persister + the WS split. **Open question:** expected traffic? Real traffic needs a proxy (out of lock scope) — flag, don't silently assume. |
| 6 | **AntD v5 is in maintenance; v6 shipped.** | Keep v5 (locked). Isolate all token usage behind `shared/ui` + `tokens.ts` so a future v6 jump is one layer. Revisit post-launch. |
| 7 | **Prerender for dynamic `/coin/:id` OG** won't cover the long tail without SSR. | Prerender the static + top-N routes; accept long-tail OG won't unfurl, or add an edge OG-image function later (out of v1 scope). State the limitation. |
| 8 | **StrictMode/HMR double-invoke** on the module-singleton socket and the alert evaluator. | `import.meta.hot.dispose` + idempotent `destroy()`; guard the evaluator/i18n init against double-mount. Verified explicitly in P4. |

---

## 10. Principal-engineer critique (final harsh review)

**What most moves the needle on "senior-built" (top 5):**
1. **The two-cadence price architecture, made explicit and honest.** REST seeds, WS overlays, with a *named staleness contract* (badge + `source` + slow-refetch for no-pair coins) instead of pretending WS covers everything. The honesty about the long tail and the USDT/USD mismatch is the senior tell — juniors ship the happy path and get a bug report.
2. **The WS engine outside React with rAF coalescing + the single all-market stream.** One connection, zero SUBSCRIBE frames, per-symbol selector subscriptions — a 250-row table flashing at 60fps with surgical re-renders. The fact that it's regression-tested against a recorded `!miniTicker@arr` frame (the exact bug that silently killed the hero feature) is what separates "it demos" from "it ships."
3. **One token source feeding AntD and the charts**, switching together, with the flash animation deliberately decoupled from AntD's internal CSS-var naming. It reads as a system, not a pile of components.
4. **Disciplined failure modes everywhere:** geo-block failover + circuit breaker, persisted-cache hydration gate (no quota-burning boot burst), 429 single-backoff, error/empty/offline states named per hook and per chart. Resilience is designed, not bolted on.
5. **The rate-limit math is the whole product thesis**, and it's defended with a real throttle (tested), conservative staleTimes aligned to CoinGecko's 15-min server cache, and the query-param-key/CORS verification gated in P0.

**Remaining gaps & top fixes before writing code:**
- **CORS is still theoretical.** Everything rests on CoinGecko allowing browser-direct calls from the deployed origin. **Fix:** P0 must produce an actual browser network trace, not a plan. If it fails, the architecture changes (proxy), so this is the single highest-leverage thing to verify on day one.
- **Geo-block default.** If the audience is US-heavy, Binance-first is the wrong default. **Fix:** decide the default adapter from the audience before P4, not at runtime only.
- **Demo-key economics.** A shared in-browser key + 10k/month is fine for a portfolio piece and a liability for real traffic. **Fix:** get an expected-traffic number; if it's "real," accept that the no-backend lock has a ceiling and document it.
- **Test infra is load-bearing and easy to under-build.** jsdom has no WebSocket or IndexedDB. **Fix:** stand up `fake-indexeddb` + the MSW WS harness in P0/P1, before the hero subsystems, so they're testable from line one.
- **Accessibility of the live surface.** Constantly-flashing color-coded prices are a contrast/colorblind/motion hazard. **Fix:** icon+color (never color alone), `prefers-reduced-motion`, a single polite live region (not 250), and the ⌘K combobox a11y are requirements, not P6 nice-to-haves.

The plan is sound and the corrections close the bugs the verifiers caught. The biggest residual risk is not in the code — it's the unverified assumption that a backend-less browser app can talk to CoinGecko directly under real CORS and real rate limits. Prove that in P0 and the rest is execution.
