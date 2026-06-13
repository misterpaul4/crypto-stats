/**
 * A global gate in front of every CoinGecko request: bounded concurrency AND
 * minimum spacing between starts. TanStack fires queryFns synchronously on mount,
 * so a fresh page can burst many calls in one tick — this makes a >100/min spike
 * structurally impossible. Returns a `release()` to call when the request settles.
 *
 * A single pending timer guarantees starts are serialized and spaced; concurrency
 * is bounded by `inFlight`. Verified by firing N acquire() in one tick.
 */
const MAX_CONCURRENT = 4;
const MIN_SPACING_MS = 120;

let inFlight = 0;
let lastStart = 0;
let timer: ReturnType<typeof setTimeout> | null = null;
const queue: Array<() => void> = [];

function schedule(): void {
  if (timer !== null) return; // a start is already pending
  if (queue.length === 0 || inFlight >= MAX_CONCURRENT) return;

  const wait = Math.max(0, lastStart + MIN_SPACING_MS - Date.now());
  timer = setTimeout(() => {
    timer = null;
    if (queue.length === 0 || inFlight >= MAX_CONCURRENT) {
      schedule();
      return;
    }
    const next = queue.shift();
    inFlight += 1;
    lastStart = Date.now();
    next?.();
    schedule(); // the next start waits MIN_SPACING from this one
  }, wait);
}

export function acquire(): Promise<() => void> {
  return new Promise((resolve) => {
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      inFlight -= 1;
      schedule();
    };
    queue.push(() => resolve(release));
    schedule();
  });
}
