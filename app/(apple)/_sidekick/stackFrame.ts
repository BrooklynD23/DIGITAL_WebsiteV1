/**
 * Pure DOM writer for <SidekickStack>, called from a scroll driver's frame (useScrollSteps onFrame).
 * Writes each tier's transform and the active board's --e; toggles data-active / data-exploding / data-cur.
 * No transitions on these transforms: scroll position is the timebase. Nothing runs at rest.
 */
import { MODULE_COUNT, STACK_H, clamp01, subExplode, tierOffset } from './geometry';

export const SUB_LAYERS = ['B.Cu', 'substrate', 'F.Cu', 'F.Pads', 'F.Silk'] as const;
export type SubLayer = (typeof SUB_LAYERS)[number];

export const SUB_NAME: Readonly<Record<SubLayer, string>> = {
  'B.Cu': 'Back copper',
  substrate: 'FR-4 core',
  'F.Cu': 'Front copper',
  'F.Pads': 'Front pads',
  'F.Silk': 'Silkscreen',
};

export interface StackCache {
  readonly stack: HTMLElement;
  readonly tiers: ReadonlyArray<{ readonly el: HTMLElement; readonly slot: number; readonly layers: ReadonlyArray<HTMLElement> }>;
  cur: HTMLElement | null;
}

export function cacheStack(stack: HTMLElement): StackCache {
  const tiers = Array.from(stack.querySelectorAll<HTMLElement>('[data-tier]')).map((el) => ({
    el,
    slot: Number(el.dataset.slot),
    layers: Array.from(el.querySelectorAll<HTMLElement>('[data-board-layer]')),
  }));
  return { stack, tiers, cur: null };
}

/** P = drive position 0 … MODULE_COUNT. Returns the active module and its cursor layer. */
export function applyStackFrame(c: StackCache, P: number): { active: number; sub: SubLayer | null } {
  const p = Math.max(0, Math.min(MODULE_COUNT, P));
  const scale = c.stack.offsetHeight / STACK_H;
  const active = Math.min(MODULE_COUNT - 1, Math.floor(p));
  let sub: SubLayer | null = null;
  let curEl: HTMLElement | null = null;
  for (const t of c.tiers) {
    const dy = tierOffset(t.slot, p) * scale;
    t.el.style.transform = `translate(-50%, calc(-50% + ${dy.toFixed(1)}px))`;
    if (t.slot < 0 || t.slot >= MODULE_COUNT) continue;
    t.el.dataset.active = String(t.slot === active);
    // A name shows once its tier has room (its gap is opening), so collapsed labels never pile up.
    t.el.dataset.labelOpen = String(t.slot <= p + 0.35);
    if (t.layers.length === 0) continue;
    const e = subExplode(t.slot, p);
    t.el.style.setProperty('--e', e.toFixed(3));
    const open = e > 0.04;
    t.el.dataset.exploding = String(open);
    if (t.slot === active && open) {
      const f = clamp01((p - t.slot - 0.08) / 0.8);
      sub = SUB_LAYERS[Math.min(SUB_LAYERS.length - 1, Math.floor(f * SUB_LAYERS.length))];
      curEl = t.layers.find((l) => l.dataset.boardLayer === sub) ?? null;
    }
  }
  if (curEl !== c.cur) {
    c.cur?.removeAttribute('data-cur');
    curEl?.setAttribute('data-cur', '');
    c.cur = curEl;
  }
  return { active, sub };
}

/** Undo every write (unmount / reduced-motion switch). */
export function resetStack(c: StackCache): void {
  c.cur?.removeAttribute('data-cur');
  for (const t of c.tiers) {
    t.el.style.transform = '';
    t.el.style.removeProperty('--e');
    delete t.el.dataset.active;
    delete t.el.dataset.exploding;
    delete t.el.dataset.labelOpen;
  }
}

/** Static highlight only (no motion): mark one module active. */
export function markActive(c: StackCache, active: number): void {
  for (const t of c.tiers) if (t.slot >= 0 && t.slot < MODULE_COUNT) t.el.dataset.active = String(t.slot === active);
}
