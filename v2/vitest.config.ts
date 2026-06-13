import { mergeConfig, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Reuse the Vite config (path aliases via vite-tsconfig-paths) for tests.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      css: false,
    },
  }),
);
