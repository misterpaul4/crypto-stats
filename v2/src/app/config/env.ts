import { z } from 'zod';

const schema = z.object({
  VITE_COINGECKO_DEMO_KEY: z.string().trim().min(1).optional(),
  VITE_CACHE_VERSION: z.string().default('1'),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {

  console.error('[env] invalid environment variables', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;

if (!env.VITE_COINGECKO_DEMO_KEY && import.meta.env.DEV) {
  console.warn(
    '[env] VITE_COINGECKO_DEMO_KEY is not set — using the shared public CoinGecko pool ' +
      '(low, IP-shared rate limit). Add a free Demo key to .env.local for headroom.',
  );
}
