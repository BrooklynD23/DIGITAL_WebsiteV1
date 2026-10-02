import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../tokens.js';
import { Stage } from '../DotLayer.jsx';
import { clamp, easeIn, easeInOut, easeOut, fibDir, hash, latticeDisc, lerp } from '../engine.js';

// brain-context (5 s, scrub): illustrative fixed-slot context window, one continuous sequence on the
// live engine's lattice (latticeDisc, same as the fill / evict verbs):
//   fill  — slots fill in reading order behind a write head; the pinned top band is outlined
//   evict — the oldest unpinned rows exit right; their slots stay empty (dashed)
//   compress — a spread middle group collapses into a dense summary that seats in the freed slots
// The red trigger dot is the write head ("next slot"); at rest it waits on the first free slot.
// Monotonic and cut-free so currentTime scrubbing reads cleanly. Rest = last frame.

export const BRAIN_CONTEXT_FRAMES = 150;

const G = 13;
const SLOTS = latticeDisc(G, 0.72); // row-major, top → bottom
const ROWS = Array.from(new Set(SLOTS.map(([, y]) => y)));
const rowOf = SLOTS.map(([, y]) => ROWS.indexOf(y));
const PINNED_ROWS = 2;
const EVICT_ROWS = [2, 3];
const COMPRESS_ROWS = [4, 5, 6, 7];
const isRow = (i, rows) => rows.includes(rowOf[i]);
const pinned = (i) => rowOf[i] < PINNED_ROWS;
const evicted = SLOTS.map((_, i) => isRow(i, EVICT_ROWS));
const compressed = SLOTS.map((_, i) => isRow(i, COMPRESS_ROWS));
const SUMMARY = 7; // dense summary dots, seated in the middle of the first freed row
const firstFreed = SLOTS.map((_, i) => i).filter((i) => rowOf[i] === EVICT_ROWS[0]);
const off = Math.floor((firstFreed.length - SUMMARY) / 2);
const freed = firstFreed.slice(off, off + SUMMARY + 1); // SUMMARY seats + the next free slot
const lastFillable = SLOTS.length - 1;

// timeline (frames)
const T = { fill: [8, 70], evict: [72, 100], compress: [100, 138] };
const sp = (fr, [a, b]) => clamp((fr - a) / (b - a));

export const BrainContext = () => {
  const fr = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tall = height > width;
  const size = tall ? 1100 : 1150; // lattice draw size px
  const cx = width / 2 - (tall ? 0 : 40);
  const cy = height / 2;
  const P = ([x, y]) => [cx + x * 0.92 * (size / 2), cy + y * 0.92 * (size / 2)];
  const pitch = ((2 * 0.72) / (G - 1)) * 0.92 * (size / 2);
  const r = pitch * 0.17;

  const fillHead = SLOTS.length * easeInOut(sp(fr, T.fill)); // slots filled so far (fractional)
  const ev = sp(fr, T.evict);
  const cp = sp(fr, T.compress);

  const dots = [];
  const rings = [];
  SLOTS.forEach((s, i) => {
    const [x, y] = P(s);
    // empty slot marker, always
    dots.push({ x, y, r: r * 0.45, a: 0.22 });
    if (pinned(i)) rings.push({ x, y, r: r * 2.1, a: 0.55, dash: true });
    const f = clamp(fillHead - i);
    if (f <= 0) return;
    if (evicted[i]) {
      const v = easeIn(clamp(ev * 1.6 - (i % G) * 0.04));
      const a = 0.9 * (1 - v);
      if (a > 0.02) dots.push({ x: x + v * pitch * 7, y: y - v * pitch * 0.4, r: r * lerp(0.6, 1, f), a });
      if (ev > 0.3) rings.push({ x, y, r: r * 1.15, a: 0.5 * clamp((ev - 0.3) / 0.4), dash: true });
      return;
    }
    if (compressed[i]) {
      // spread group collapses toward a cluster, then the leaders seat into freed slots
      const k = i % SUMMARY;
      const lead = i % 9 === 0 && k < SUMMARY;
      const [dx, dy] = fibDir(i, 40);
      const hub = P([0.0, (ROWS[2] + ROWS[3]) / 2]);
      const c1 = easeInOut(clamp(cp / 0.55 - hash(i, 3) * 0.25));
      const c2 = easeInOut(clamp((cp - 0.55) / 0.4));
      const mid = [lerp(x, hub[0] + dx * pitch * 1.4, c1), lerp(y, hub[1] + dy * pitch * 0.8, c1)];
      const slotIdx = freed[Math.floor(hash(i, 5) * SUMMARY)];
      const dest = P(SLOTS[slotIdx]);
      const pos = [lerp(mid[0], dest[0], c2), lerp(mid[1], dest[1], c2)];
      const a = lead ? 0.95 : 0.85 * (1 - c2);
      if (cp > 0) rings.push({ x, y, r: r * 1.15, a: 0.5 * clamp(cp * 2), dash: true });
      if (a > 0.02) dots.push({ x: pos[0], y: pos[1], r: r * lerp(lerp(0.6, 1, f), lead ? 1.1 : 0.8, c1), a });
      return;
    }
    dots.push({ x, y, r: r * lerp(0.6, 1, f), a: lerp(0.35, pinned(i) ? 0.98 : 0.85, f) });
  });

  // summary: seated dense dots on the first SUMMARY freed slots (fade in as c2 completes)
  const seat = easeOut(clamp((cp - 0.85) / 0.15));
  freed.slice(0, SUMMARY).forEach((si) => {
    const [x, y] = P(SLOTS[si]);
    if (seat > 0) {
      dots.push({ x, y, r: r * 1.25, a: 0.98 * seat });
      rings.push({ x, y, r: r * 2.0, a: 0.7 * seat, dash: false });
    }
  });

  // write head: rides the fill, waits at the end of the window; at rest marks the first free slot
  let head;
  if (cp < 0.85) {
    const hi = Math.min(lastFillable, Math.floor(fillHead));
    head = P(SLOTS[hi]);
    if (fillHead >= SLOTS.length - 0.001) head = [head[0] + pitch, head[1]];
  } else {
    const from = P(SLOTS[lastFillable]);
    const to = P(SLOTS[freed[SUMMARY]]);
    const m = easeInOut(clamp((cp - 0.85) / 0.15));
    head = [lerp(from[0] + pitch, to[0], m), lerp(from[1], to[1], m)];
  }

  // window boundary: the fixed capacity, dashed
  const [bx, by] = [cx, cy];
  const BR = 0.72 * 0.92 * (size / 2) + pitch * 0.9;

  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Stage width={width} height={height}>
        <circle cx={bx} cy={by} r={BR} fill="none" stroke={C.ink} strokeOpacity={0.22} strokeWidth={1.5} strokeDasharray="3 7" />
        {rings.map((g, i) => (
          <circle key={`g${i}`} cx={g.x} cy={g.y} r={g.r} fill="none" stroke={C.ink} strokeOpacity={g.a} strokeWidth={1.3} strokeDasharray={g.dash ? '3 3' : undefined} />
        ))}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={C.ink} fillOpacity={d.a} />
        ))}
        <circle cx={head[0]} cy={head[1]} r={r * 1.1} fill={C.trigger} />
      </Stage>
    </AbsoluteFill>
  );
};
