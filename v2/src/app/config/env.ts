import { z } from 'zod';

/**
 * The single reader of `import.meta.env`. Everything else imports `env` from here.
 *
 * The CoinGecko Demo key is *optional* in dev (the public pool works at low volume),
 * but recommended — we warn loudly when it is missing so the rate-limit story is honest.
 */
const schema = z.object({
  VITE_COINGECKO_DEMO_KEY: z.string().trim().min(1).optional(),
  VITE_CACHE_VERSION: z.string().default('1'),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  // Fail fast on a malformed env rather than limping along with `undefined`.
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
