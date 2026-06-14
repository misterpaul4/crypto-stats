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

    expect(maxConcurrent).toBe(4);
    expect(startTimes).toHaveLength(12);
    for (let i = 1; i < startTimes.length; i++) {
      expect(startTimes[i]! - startTimes[i - 1]!).toBeGreaterThanOrEqual(119);
    }
  });
});
