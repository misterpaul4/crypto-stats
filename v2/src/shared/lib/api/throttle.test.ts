import { describe, it, expect, vi, afterEach } from 'vitest';
import { acquire } from './throttle';

afterEach(() => {
  vi.useRealTimers();
});

describe('throttle.acquire', () => {
  it('caps concurrency at 4, spaces starts >= 120ms, and drains the whole burst', async () => {
    vi.useFakeTimers();
    const startTimes: number[] = [];
    let concurrent = 0;
    let maxConcurrent = 0;

    // Fire 12 acquisitions in one tick (mimics TanStack firing queryFns on mount).
    // Each holds its slot for 2000ms so a full batch of 4 piles up before any release.
    for (let i = 0; i < 12; i++) {
      void acquire().then((release) => {
        startTimes.push(Date.now());
        concurrent += 1;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        setTimeout(() => {
          concurrent -= 1;
          release();
        }, 2000);
      });
    }

    await vi.advanceTimersByTimeAsync(15_000);

    expect(maxConcurrent).toBe(4); // never more than 4 in flight
    expect(startTimes).toHaveLength(12); // all eventually run (no deadlock)
    for (let i = 1; i < startTimes.length; i++) {
      expect(startTimes[i]! - startTimes[i - 1]!).toBeGreaterThanOrEqual(119); // >= ~120ms apart
    }
  });
});
