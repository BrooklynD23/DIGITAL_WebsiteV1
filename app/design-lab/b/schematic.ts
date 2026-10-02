/**
 * Concept B — procedural schematic generators.
 *
 * Every drawing on /design-lab/b is computed here from real records in lib/data:
 *   - interface map  ← phoneV2Copy.subsystemSections[].activePartIds
 *   - signal chain   ← GLASSES_CONTENT.info[].specs + projects.ts techStack
 *   - timing diagram ← GLASSES_CONTENT.pov.words + GLASSES_CONTENT.hud.wpm
 * Nothing is hand-placed. Change the data and the drawings change.
 * Pure functions only: safe to call from server or client components.
 */

export interface SubsystemInput {
  readonly id: string;
  readonly title: string;
  readonly scrubberLabel: string;
  readonly activePartIds: readonly string[];
}

export interface MapNode {
  readonly id: string;
  readonly ref: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface MapPart extends MapNode {
  readonly owners: readonly string[];
  /** Handoff ref (H1…) when two or more subsystems touch this part. */
  readonly handoff: string | null;
}

export interface MapWire {
  readonly key: string;
  readonly subsystemId: string;
  readonly partId: string;
  readonly d: string;
  readonly pin: { readonly x: number; readonly y: number };
  readonly length: number;
}

export interface InterfaceMap {
  readonly width: number;
  readonly height: number;
  readonly subsystems: readonly MapNode[];
  readonly parts: readonly MapPart[];
  readonly wires: readonly MapWire[];
  readonly handoffCount: number;
}

export interface MapLayout {
  readonly width: number;
  readonly subW: number;
  readonly partW: number;
  readonly nodeH: number;
  readonly partPitch: number;
  readonly laneGap: number;
  readonly compact: boolean;
  readonly pad: number;
}

export const WIDE_MAP: MapLayout = {
  width: 760,
  subW: 214,
  partW: 168,
  nodeH: 34,
  partPitch: 44,
  laneGap: 16,
  compact: false,
  pad: 12,
};

export const COMPACT_MAP: MapLayout = {
  width: 358,
  subW: 112,
  partW: 118,
  nodeH: 30,
  partPitch: 38,
  laneGap: 9,
  compact: true,
  pad: 8,
};

/** "phone-flex-cables" → "FLEX CABLES" */
export function partLabel(partId: string): string {
  return partId.replace(/^phone-/, '').replace(/-/g, ' ').toUpperCase();
}

export function buildInterfaceMap(
  subsystems: readonly SubsystemInput[],
  layout: MapLayout,
): InterfaceMap {
  const { width, subW, partW, nodeH, partPitch, laneGap, compact, pad } = layout;

  // Parts: unique activePartIds in order of first appearance.
  const partOrder = subsystems.flatMap((s) => s.activePartIds).filter((id, i, all) => all.indexOf(id) === i);
  const ownersOf = (partId: string) =>
    subsystems.filter((s) => s.activePartIds.includes(partId)).map((s) => s.id);

  const height = pad * 2 + partOrder.length * partPitch;
  const subPitch = (height - pad * 2) / subsystems.length;

  const subNodes: MapNode[] = subsystems.map((s, i) => ({
    id: s.id,
    ref: `S${i + 1}`,
    label: compact ? s.scrubberLabel : s.title.toUpperCase(),
    x: 0,
    y: pad + i * subPitch + (subPitch - nodeH) / 2,
    w: subW,
    h: nodeH,
  }));

  const partX = compact ? width - partW : subW + laneGap * (subsystems.length + 1) + 56;
  let handoffIndex = 0;
  const partNodes: MapPart[] = partOrder.map((id, i) => {
    const owners = ownersOf(id);
    const handoff = owners.length > 1 ? `H${++handoffIndex}` : null;
    return {
      id,
      ref: `P${String(i + 1).padStart(2, '0')}`,
      label: partLabel(id),
      x: partX,
      y: pad + i * partPitch + (partPitch - nodeH) / 2,
      w: partW,
      h: nodeH,
      owners,
      handoff,
    };
  });

  const wires: MapWire[] = [];
  subsystems.forEach((s, si) => {
    const src = subNodes[si];
    const sx = src.x + src.w;
    const n = s.activePartIds.length;
    const laneX = sx + laneGap * (si + 1);
    s.activePartIds.forEach((partId, k) => {
      const part = partNodes.find((p) => p.id === partId);
      if (!part) return;
      // Fan the source pins so two wires leaving one block don't overlap.
      const sy = src.y + src.h / 2 + (n > 1 ? (k - (n - 1) / 2) * 8 : 0);
      // Stagger destination pins on shared parts.
      const slot = part.owners.indexOf(s.id);
      const m = part.owners.length;
      const py = part.y + part.h / 2 + (m > 1 ? (slot - (m - 1) / 2) * 8 : 0);
      const d = `M${sx} ${sy} H${laneX} V${py} H${part.x}`;
      const length = laneX - sx + Math.abs(py - sy) + (part.x - laneX);
      wires.push({ key: `${s.id}>${partId}`, subsystemId: s.id, partId, d, pin: { x: part.x, y: py }, length });
    });
  });

  return {
    width,
    height,
    subsystems: subNodes,
    parts: partNodes,
    wires,
    handoffCount: handoffIndex,
  };
}

/* ------------------------------------------------------------------ */
/* Signal chain (DG-002)                                               */
/* ------------------------------------------------------------------ */

export interface ChainStageInput {
  readonly key: string;
  readonly label: string;
  readonly detail: string;
}

export interface ChainStage extends ChainStageInput {
  readonly ref: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface SignalChain {
  readonly width: number;
  readonly height: number;
  readonly stages: readonly ChainStage[];
  readonly links: readonly string[];
  /** Feedback path from the last stage back to `feedbackTo`. */
  readonly feedback: { readonly d: string; readonly labelX: number; readonly labelY: number } | null;
}

export function buildSignalChain(
  stages: readonly ChainStageInput[],
  opts: { readonly vertical: boolean; readonly width: number; readonly feedbackTo: number },
): SignalChain {
  const { vertical, width, feedbackTo } = opts;
  const gap = vertical ? 22 : 28;
  const h = vertical ? 50 : 64;
  const w = vertical ? width - 64 : (width - gap * (stages.length - 1)) / stages.length;
  const placed: ChainStage[] = stages.map((s, i) => ({
    ...s,
    ref: `B${i + 1}`,
    x: vertical ? 0 : i * (w + gap),
    y: vertical ? 8 + i * (h + gap) : 8,
    w,
    h,
  }));

  const links = placed.slice(1).map((s, i) => {
    const a = placed[i];
    return vertical
      ? `M${a.x + a.w / 2} ${a.y + a.h} V${s.y}`
      : `M${a.x + a.w} ${a.y + a.h / 2} H${s.x}`;
  });

  const last = placed[placed.length - 1];
  const target = placed[feedbackTo];
  let feedback: SignalChain['feedback'] = null;
  if (last && target && target !== last) {
    if (vertical) {
      const rx = last.x + last.w + 28;
      feedback = {
        d: `M${last.x + last.w} ${last.y + last.h / 2} H${rx} V${target.y + target.h / 2} H${target.x + target.w}`,
        labelX: rx + 6,
        labelY: target.y + target.h / 2 + 16,
      };
    } else {
      const by = last.y + last.h + 34;
      feedback = {
        d: `M${last.x + last.w / 2} ${last.y + last.h} V${by} H${target.x + target.w / 2} V${target.y + target.h}`,
        labelX: (target.x + target.w / 2 + last.x + last.w / 2) / 2,
        labelY: by - 8,
      };
    }
  }

  const height = vertical ? last.y + last.h + 8 : last.y + last.h + 50;
  return { width: vertical ? width : width, height, stages: placed, links, feedback };
}

/* ------------------------------------------------------------------ */
/* RSVP timing                                                         */
/* ------------------------------------------------------------------ */

export interface TimingSlot {
  readonly index: number;
  readonly word: string;
  readonly startMs: number;
  readonly x: number;
  readonly w: number;
}

export interface Timing {
  readonly msPerWord: number;
  readonly totalMs: number;
  readonly slots: readonly TimingSlot[];
  readonly ticks: readonly { readonly x: number; readonly ms: number }[];
}

/** At a fixed WPM every word gets the same slot: 60 000 / wpm ms. */
export function buildTiming(words: readonly string[], wpm: number, width: number): Timing {
  const msPerWord = 60000 / wpm;
  const totalMs = msPerWord * words.length;
  const w = width / words.length;
  const slots = words.map((word, index) => ({
    index,
    word,
    startMs: index * msPerWord,
    x: index * w,
    w,
  }));
  const tickEvery = totalMs > 1200 ? 250 : 100;
  const ticks: { x: number; ms: number }[] = [];
  for (let ms = 0; ms <= totalMs + 0.5; ms += tickEvery) ticks.push({ x: (ms / totalMs) * width, ms });
  return { msPerWord, totalMs, slots, ticks };
}
