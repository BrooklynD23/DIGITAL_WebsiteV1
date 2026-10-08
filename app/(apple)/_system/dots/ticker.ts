/**
 * One shared frame loop for every stage and scroll drive on a page.
 * It exists only while something is moving: when the last subscriber returns
 * false (or unsubscribes) the loop cancels itself. At rest: 0 rAF callbacks.
 */
export type Tick = (now: number) => boolean;

const subs = new Set<Tick>();
let handle = 0;
let inFrame = false;

function loop(now: number): void {
  handle = 0;
  inFrame = true;
  for (const fn of Array.from(subs)) {
    let keep = false;
    try {
      keep = fn(now);
    } catch (err) {
      // A broken subscriber must not keep the loop alive or kill the others.
      console.error('[r2 ticker] subscriber failed', err);
    }
    if (!keep) subs.delete(fn);
  }
  inFrame = false;
  if (subs.size > 0) handle = requestAnimationFrame(loop);
}

/** Run `fn` every frame until it returns false or the returned unsubscribe is called. */
export function subscribe(fn: Tick): () => void {
  subs.add(fn);
  if (!handle && !inFrame && typeof window !== 'undefined') handle = requestAnimationFrame(loop);
  return () => {
    subs.delete(fn);
    if (subs.size === 0 && handle) {
      cancelAnimationFrame(handle);
      handle = 0;
    }
  };
}

/** Run `fn` once on the next frame (coalesce bursts of input or scroll events into one draw). */
export function once(fn: (now: number) => void): () => void {
  return subscribe((now) => {
    fn(now);
    return false;
  });
}

/** True while the shared loop is executing subscribers (callers may draw synchronously). */
export const insideFrame = (): boolean => inFrame;

/** Debug/QA: how many subscribers keep the loop alive right now. */
export const activeTicks = (): number => subs.size;

if (typeof window !== 'undefined') {
  (window as unknown as { __r2Ticker?: () => number }).__r2Ticker = activeTicks;
}
