/**
 * RSVP timing + layout math for the SHADES reader demo. Pure, deterministic, no DOM.
 * The pivot letter (optimal recognition point) sits on the fixation point; the rest of the
 * word hangs left and right of it, so the eye never has to move.
 */

/** Index of the pivot letter for a word (punctuation ignored for length). */
export function pivotIndex(word: string): number {
  const len = word.replace(/[^A-Za-z0-9]/g, '').length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

export interface WordParts {
  readonly pre: string;
  readonly pivot: string;
  readonly post: string;
}

export function splitWord(word: string): WordParts {
  const i = Math.min(pivotIndex(word), Math.max(0, word.length - 1));
  return { pre: word.slice(0, i), pivot: word.charAt(i), post: word.slice(i + 1) };
}

/** How long a word stays on the point, in ms, at a given words-per-minute. */
export function wordDelay(word: string, wpm: number): number {
  const base = 60000 / Math.max(1, wpm);
  let factor = 1;
  if (/[.!?]$/.test(word)) factor = 2;
  else if (/[,;:]$/.test(word)) factor = 1.5;
  else if (word.length > 8) factor = 1.3;
  return Math.round(base * factor);
}

export const clampWpm = (v: number, min: number, max: number, step: number): number => {
  const n = Number.isFinite(v) ? v : min;
  return Math.min(max, Math.max(min, Math.round(n / step) * step));
};
