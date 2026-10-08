/**
 * SIDEKICK main board: the nine poses of the board story as plain numbers. One source for the pinned playback
 * (BoardStory lerps between neighbouring poses) and for the static stills (Mainboard renders one pose inline).
 * Geometry lives in static SVG files (design-lab/scripts/sidekick-mainboard.mjs); this file only moves boxes.
 */
import type { BoardStageId, PartGroupId } from '../_content/sidekick';
import manifest from './mainboard-manifest.json';

export const STAGE_IDS: readonly BoardStageId[] = ['board', 'layers', 'compute', 'memory', 'power', 'usb', 'rf', 'io', 'whole'];
export const VIEW_BOX = manifest.viewBox as readonly number[] as readonly [number, number, number, number];
export const ANCHOR = manifest.anchor as readonly number[] as readonly [number, number];
export const BASE = '/boards/sidekick-mainboard';

/** Millimetres between neighbouring tiers at full spread, and how far the group in focus travels off its side. */
const GAP = 7;
const LIFT = 12;
/** Behind a lifted group: the other parts, and the copper. The group in focus is the only bright thing. */
const DIM = 0.16;
const DIM_COPPER = 0.22;

interface Pose {
  /** 0 = assembled, 1 = stackup fully separated. */
  readonly spread: number;
  readonly focus: PartGroupId | null;
  /** Every group keeps its colour at this strength (the reassembled legend). */
  readonly legend: number;
  /** Layer tags visible. */
  readonly labels: number;
}
const group = (focus: PartGroupId): Pose => ({ spread: 0.15, focus, legend: 0, labels: 0 });
export const POSES: Record<BoardStageId, Pose> = {
  board: { spread: 0, focus: null, legend: 0, labels: 0 },
  layers: { spread: 1, focus: null, legend: 0, labels: 1 },
  compute: group('compute'),
  memory: group('memory'),
  power: group('power'),
  usb: group('usb'),
  rf: group('rf'),
  io: group('io'),
  whole: { spread: 0, focus: null, legend: 0.75, labels: 0 },
};

export interface El {
  readonly key: string;
  readonly file: string;
  readonly tier: number;
  /** Layer tag (layers only). */
  readonly tag?: string;
  readonly group?: PartGroupId;
  readonly side?: 'f' | 'b';
}

const copper = (from: number, to: number): El[] =>
  manifest.layers
    .filter((l) => l.tier >= from && l.tier <= to)
    .sort((a, b) => a.tier - b.tier)
    .map((l) => ({ key: l.id, file: `${l.id}.svg`, tier: l.tier, tag: l.name.toUpperCase() }));
const parts = (side: 'f' | 'b'): El[] =>
  manifest.groups
    .filter((g) => g.sides.includes(side))
    .map((g) => ({ key: `${g.id}-${side}`, file: `parts-${g.id}-${side}.svg`, tier: side === 'f' ? 3 : -3, group: g.id as PartGroupId, side }));

/** Paint order, back to front: back-side parts, B.Cu … In3, the core, In2 … F.Cu, front-side parts. */
export const ELEMENTS: readonly El[] = [...parts('b'), ...copper(-3, -1), { key: 'core', file: 'core.svg', tier: 0, tag: '' }, ...copper(1, 3), ...parts('f')];

export interface ElState {
  /** Millimetres above the rest position (negative = below). */
  readonly y: number;
  readonly o: number;
  /** Opacity of the group-coloured copy (parts only). */
  readonly tint: number;
}

export function stateOf(el: El, pose: Pose): ElState {
  const y = el.tier * GAP * pose.spread;
  const opened = Math.min(1, pose.spread * 8); // inner copper and back-side parts hide under the assembled board
  if (!el.group) {
    const seen = el.key === 'core' || el.key === 'f-cu' ? 1 : opened;
    return { y, o: seen * (pose.focus ? DIM_COPPER : 1), tint: 0 };
  }
  const up = el.side === 'f' ? 1 : -1;
  const focused = pose.focus === el.group;
  const seen = el.side === 'f' ? 1 : opened;
  return { y: y + (focused ? up * LIFT : 0), o: seen * (pose.focus && !focused ? DIM : 1), tint: focused ? 1 : pose.legend };
}

/** Room the pose needs above and below the assembled box, in millimetres. */
export function extent(pose: Pose): { readonly up: number; readonly down: number } {
  const ys = ELEMENTS.map((el) => stateOf(el, pose).y);
  return { up: Math.max(0, ...ys), down: Math.max(0, ...ys.map((y) => -y)) };
}
