/**
 * The round-2 glyph family: 12 build glyphs + 8 agentic glyphs, one component each.
 * Grid 24 (live area 2–22), 1px non-scaling stroke, 2-unit dot pitch, dot r 0.75 / node r 1 / anchor r 1.5.
 * Dash code (from concept E): solid = exists/owned, dotted = planned, 2 3 = leader, 5 4 = boundary.
 * Every glyph: idle (dotted, 60% ink) → working (its verb, live-only) → done (solid, centre node filled, never red).
 */
import type { CSSProperties } from 'react';
import { GlyphFrame, anim, type GlyphProps } from './Glyph';

type CP = CSSProperties | undefined;
const P = ({ c, d, s }: { c: string; d: string; s?: CP }) => <path className={c} d={d} style={s} />;
const C = ({ c, x, y, r, s }: { c: string; x: number; y: number; r: number; s?: CP }) => (
  <circle className={c} cx={x} cy={y} r={r} style={s} />
);
const f2 = (v: number): number => Math.round(v * 100) / 100;

/* ------------------------------------------------------------------ build */

/** One subsystem / layer. Working: the top face lifts. */
export function GlyphSlab(p: GlyphProps) {
  return (
    <GlyphFrame name="slab" {...p}>
      <P c="r2g-hair" d="M3 10v3.6l9 5.2 9-5.2V10M12 15.2v3.6" />
      <g className="r2g-m" style={anim({ '--a': 'r2g-lift', '--dur': '1.6s' })}>
        <P c="r2g-line" d="M3 10l9-5.2 9 5.2-9 5.2z" />
        <C c="r2g-core" x={12} y={10} r={1} />
      </g>
    </GlyphFrame>
  );
}

const rh = (cy: number, w = 8, h = 2.4): string => `M${12 - w} ${cy}l${w} ${-h} ${w} ${h} ${-w} ${h}z`;

/** Whole build (N layers). Working: the stack explodes and closes. Done: exploded, solid. */
export function GlyphStack(p: GlyphProps) {
  return (
    <GlyphFrame name="stack" {...p}>
      <P c="r2g-bound" d="M12 2.5v19" />
      <g className="r2g-m r2g-to" style={anim({ '--a': 'r2g-slide', '--dx': 0, '--dy': -2.4, '--dur': '2s' })}>
        <P c="r2g-line" d={rh(7.6)} />
      </g>
      <P c="r2g-line" d={rh(12)} />
      <C c="r2g-core" x={12} y={12} r={1} />
      <g className="r2g-m r2g-to" style={anim({ '--a': 'r2g-slide', '--dx': 0, '--dy': 2.4, '--dur': '2s' })}>
        <P c="r2g-line" d={rh(16.4)} />
      </g>
    </GlyphFrame>
  );
}

/** Owner / open role. Idle: dashed seat (open); with `anchor`, the red trigger marks it. Done: taken, solid. */
export function GlyphSeat(p: GlyphProps) {
  return (
    <GlyphFrame name="seat" {...p}>
      <g className="r2g-m" style={anim({ '--a': 'r2g-spin', '--dur': '6s', '--ease': 'linear' })}>
        <C c="r2g-line" x={12} y={11} r={5.5} />
      </g>
      <P c="r2g-hair" d="M5 21c1.4-2.6 4-4 7-4s5.6 1.4 7 4" />
      <C c="r2g-core r2g-done" x={12} y={11} r={1.5} />
      <C c="r2g-anchor r2g-anchor-only" x={12} y={11} r={1.5} />
    </GlyphFrame>
  );
}

/** Review path. Working: a packet runs the leader A → B. Done: leader solid, B filled. */
export function GlyphHandoff(p: GlyphProps) {
  return (
    <GlyphFrame name="handoff" {...p}>
      <P c="r2g-lead" d="M6 17h6V7h6" />
      <C c="r2g-node" x={5} y={17} r={1.25} />
      <C c="r2g-core" x={19} y={7} r={1.25} />
      <g
        className="r2g-m r2g-to"
        style={anim({ '--a': 'r2g-path3', '--x1': 6, '--y1': 0, '--x2': 6, '--y2': -10, '--x3': 12, '--y3': -10, '--dx': 12, '--dy': -10, '--dur': '1.8s' })}
      >
        <C c="r2g-node r2g-pre" x={7} y={17} r={0.9} />
      </g>
    </GlyphFrame>
  );
}

const GATE_ROWS = [10, 12, 14];
const GATE_COLS = [9, 11, 13, 15];

/** Test gate before merge. Working: rows scramble, then click back. Done: aligned, frame closed. */
export function GlyphGate(p: GlyphProps) {
  return (
    <GlyphFrame name="gate" {...p}>
      <P c="r2g-line" d="M5 4v16M19 4v16" />
      <P c="r2g-hair r2g-done" d="M5 4h14M5 20h14" />
      {GATE_ROWS.map((y, r) => (
        <g key={y} className="r2g-m" style={anim({ '--a': 'r2g-shift', '--dx': r % 2 ? -2 : 2, '--delay': `${r * 0.08}s`, '--dur': '1.6s' })}>
          {GATE_COLS.map((x) => (
            <C key={x} c="r2g-node" x={x} y={y} r={0.75} />
          ))}
        </g>
      ))}
    </GlyphFrame>
  );
}

const PENTA = Array.from({ length: 5 }, (_, k) => {
  const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
  return [f2(12 + Math.cos(a) * 7), f2(12.5 + Math.sin(a) * 7)] as const;
});
const PENTA_D = `M${PENTA.map(([x, y]) => `${x} ${y}`).join('L')}Z`;
const STAR_D = [0, 2, 4, 1, 3].map((k, i) => `${i ? 'L' : 'M'}${PENTA[k][0]} ${PENTA[k][1]}`).join('') + 'Z';

/** Integrate. Working: edges draw between the nodes. Done: closed graph + chords. */
export function GlyphWire(p: GlyphProps) {
  return (
    <GlyphFrame name="wire" {...p}>
      <P c="r2g-line" d={PENTA_D} />
      <P c="r2g-hair r2g-done" d={STAR_D} />
      <P c="r2g-draw r2g-m" d={PENTA_D} s={anim({ '--a': 'r2g-draw', '--len': 41.2, '--dur': '2.2s' })} />
      {PENTA.map(([x, y]) => (
        <C key={`${x}${y}`} c="r2g-node" x={x} y={y} r={1.1} />
      ))}
    </GlyphFrame>
  );
}

/** square perimeter point for s in [0,1), starting top-centre, clockwise; half-size h. */
function squareAt(s: number, h: number): [number, number] {
  const per = 8 * h;
  let d = (((s % 1) + 1) % 1) * per;
  const legs: Array<[number, number, number, number]> = [
    [12, 12 - h, 1, 0],
    [12 + h, 12 - h, 0, 1],
    [12 + h, 12 + h, -1, 0],
    [12 - h, 12 + h, 0, -1],
    [12 - h, 12 - h, 1, 0],
  ];
  const lens = [h, 2 * h, 2 * h, 2 * h, h];
  for (let k = 0; k < legs.length; k++) {
    if (d <= lens[k]) return [legs[k][0] + legs[k][2] * d, legs[k][1] + legs[k][3] * d];
    d -= lens[k];
  }
  return [12, 12 - h];
}
const FORM_DOTS = Array.from({ length: 12 }, (_, k) => {
  const a = -Math.PI / 2 + (k * Math.PI) / 6;
  const x = 12 + Math.cos(a) * 7;
  const y = 12 + Math.sin(a) * 7;
  const [sx, sy] = squareAt(k / 12, 6.5);
  return { x: f2(x), y: f2(y), dx: f2(sx - x), dy: f2(sy - y) };
});

/** Plan. Working: the 12-dot circle morphs to a square. Done: solid square. */
export function GlyphForm(p: GlyphProps) {
  return (
    <GlyphFrame name="form" {...p}>
      <P c="r2g-line r2g-done" d="M5.5 5.5h13v13h-13z" />
      {FORM_DOTS.map((d, k) => (
        <C
          key={k}
          c="r2g-node r2g-m r2g-to"
          x={d.x}
          y={d.y}
          r={0.85}
          s={anim({ '--a': 'r2g-slide', '--dx': d.dx, '--dy': d.dy, '--dur': '2.2s', '--delay': `${k * 0.02}s` })}
        />
      ))}
      <C c="r2g-core" x={12} y={12} r={1} />
    </GlyphFrame>
  );
}

const ell = (deg: number, th: number): [number, number] => {
  const r = (deg * Math.PI) / 180;
  const x = 9 * Math.cos(th);
  const y = 3.5 * Math.sin(th);
  return [f2(12 + x * Math.cos(r) - y * Math.sin(r)), f2(12 + x * Math.sin(r) + y * Math.cos(r))];
};
const ORBIT_PARTS = [ell(-28, 0.35), ell(28, 3.5), ell(-28, 2.6)];

/** Prototype. Working: the orbits turn. Done: parts parked, solid. */
export function GlyphOrbit(p: GlyphProps) {
  return (
    <GlyphFrame name="orbit" {...p}>
      <g className="r2g-m" style={anim({ '--a': 'r2g-spin', '--dur': '4.8s', '--ease': 'linear' })}>
        <ellipse className="r2g-line" cx={12} cy={12} rx={9} ry={3.5} style={{ transform: 'rotate(-28deg)' }} />
        <ellipse className="r2g-line" cx={12} cy={12} rx={9} ry={3.5} style={{ transform: 'rotate(28deg)' }} />
        {ORBIT_PARTS.map(([x, y]) => (
          <C key={`${x}${y}`} c="r2g-node" x={x} y={y} r={1.2} />
        ))}
      </g>
      <C c="r2g-core" x={12} y={12} r={1.25} />
    </GlyphFrame>
  );
}

/** Repair plan / replaceable part. Idle: module slid out 4u. Working: slides in and out. Done: slotted. */
export function GlyphSwap(p: GlyphProps) {
  return (
    <GlyphFrame name="swap" {...p}>
      <P c="r2g-line" d="M3 13l9-5.2 9 5.2-9 5.2z" />
      <P c="r2g-hair" d="M3 13v2.6l9 5.2 9-5.2V13" />
      <P c="r2g-hair" d="M8.5 13l3.5-2 3.5 2-3.5 2z" />
      <g className="r2g-m r2g-out" style={anim({ '--a': 'r2g-swap', '--ox': 4, '--oy': -6.9, '--dur': '2s' })}>
        <P c="r2g-line" d="M8.5 13l3.5-2 3.5 2-3.5 2z" />
        <C c="r2g-core" x={12} y={13} r={0.9} />
      </g>
    </GlyphFrame>
  );
}

const TRACE_D = 'M3 17h5V9h7v5h6';

/** Signal / PCB / data path. Working: a packet runs the trace. Done: solid trace. */
export function GlyphTrace(p: GlyphProps) {
  return (
    <GlyphFrame name="trace" {...p}>
      <P c="r2g-line" d={TRACE_D} />
      <P c="r2g-draw r2g-m" d={TRACE_D} s={anim({ '--a': 'r2g-packet', '--len': 31, '--dur': '1.6s', '--ease': 'linear' })} />
      <C c="r2g-via" x={8} y={17} r={1.25} />
      <C c="r2g-via" x={15} y={9} r={1.25} />
      <C c="r2g-core" x={21} y={14} r={1.25} />
    </GlyphFrame>
  );
}

const RAY_Y = [8, 10, 12, 14, 16];

/** Optical path (SHADES). Working: rays converge on the fixation point. Done: point + reticle. */
export function GlyphLens(p: GlyphProps) {
  return (
    <GlyphFrame name="lens" {...p}>
      <ellipse className="r2g-line" cx={10} cy={12} rx={2.2} ry={7} />
      {RAY_Y.map((y) => (
        <P key={`l${y}`} c="r2g-lead r2g-pre" d={`M4.5 ${y}L18 12`} />
      ))}
      {RAY_Y.map((y, i) => (
        <C
          key={y}
          c="r2g-dot r2g-m"
          x={3}
          y={y}
          r={0.75}
          s={anim({ '--a': 'r2g-travel', '--dx': 16, '--dy': 12 - y, '--dur': '1.8s', '--delay': `${i * 0.06}s` })}
        />
      ))}
      <P c="r2g-hair r2g-done" d="M19 7.5v2M19 14.5v2M14.5 12h2M21.5 12h1" />
      <C c="r2g-core" x={19} y={12} r={1.1} />
    </GlyphFrame>
  );
}

const NIGHT = Array.from({ length: 7 }, (_, k) => {
  const a = -Math.PI / 2 + (k * 2 * Math.PI) / 7;
  return [f2(12 + Math.cos(a) * 7.5), f2(12 + Math.sin(a) * 7.5)] as const;
});

/** Build night. 7 seats; filled = attending, the dashed one is open (red only with `anchor`). Working: seats light in turn. */
export function GlyphNight(p: GlyphProps) {
  return (
    <GlyphFrame name="night" {...p}>
      {NIGHT.slice(1).map(([x, y], i) => (
        <C key={`${x}${y}`} c="r2g-node r2g-m" x={x} y={y} r={1.15} s={anim({ '--a': 'r2g-light', '--dur': '2.4s', '--delay': `${i * 0.12}s` })} />
      ))}
      <C c="r2g-line r2g-pre" x={NIGHT[0][0]} y={NIGHT[0][1]} r={1.6} />
      <C c="r2g-anchor r2g-anchor-only" x={NIGHT[0][0]} y={NIGHT[0][1]} r={0.9} />
      <C c="r2g-node r2g-done" x={NIGHT[0][0]} y={NIGHT[0][1]} r={1.15} />
      <P c="r2g-hair" d="M14.2 10.4a3 3 0 1 1-3.6-2.9 2.4 2.4 0 0 0 3.6 2.9z" />
    </GlyphFrame>
  );
}

/* ------------------------------------------------------------------ agentic */

/** Agent loop. Working: the packet laps. Done (halt): packet in the centre, ring solid. */
export function GlyphLoop(p: GlyphProps) {
  return (
    <GlyphFrame name="loop" {...p}>
      <C c="r2g-line" x={12} y={12} r={7} />
      <P c="r2g-hair" d="M16.5 3.6l2 1.6-2.4.9" />
      <g className="r2g-m" style={anim({ '--a': 'r2g-spin', '--dur': '2s' })}>
        <g className="r2g-to" style={anim({ '--dx': 0, '--dy': 7 })}>
          <C c="r2g-node" x={12} y={5} r={1.4} />
        </g>
      </g>
    </GlyphFrame>
  );
}

/** Tool call: request + result. Working: a dot goes out and comes back. Done: link solid, node lit. */
export function GlyphTool(p: GlyphProps) {
  return (
    <GlyphFrame name="tool" {...p}>
      <C c="r2g-line" x={6.5} y={12} r={3.5} />
      <C c="r2g-core" x={6.5} y={12} r={1.1} />
      {[11, 13, 15].map((x) => (
        <C key={x} c="r2g-dot r2g-pre" x={x} y={12} r={0.75} />
      ))}
      <P c="r2g-hair r2g-done" d="M10.5 12h6" />
      <P c="r2g-line" d="M17.5 9.5h4v5h-4z" />
      <g className="r2g-done">
        {[
          [18.75, 11],
          [20.25, 11],
          [18.75, 13],
          [20.25, 13],
        ].map(([x, y]) => (
          <C key={`${x}${y}`} c="r2g-node" x={x} y={y} r={0.6} />
        ))}
      </g>
      <C c="r2g-node r2g-m r2g-pre" x={10.5} y={12} r={1} s={anim({ '--a': 'r2g-slide', '--dx': 6, '--dy': 0, '--dur': '1.4s' })} />
    </GlyphFrame>
  );
}

/** MCP port: one host port per server. Working: the tether draws. Done: tether solid, server lit. */
export function GlyphMcpPort(p: GlyphProps) {
  return (
    <GlyphFrame name="mcp-port" {...p}>
      <P c="r2g-line" d="M8.5 6.5a5.5 5.5 0 0 0 0 11" />
      <P c="r2g-hair" d="M8.5 10h-3M8.5 14h-3" />
      <P c="r2g-lead" d="M9 12h5" />
      <P c="r2g-draw r2g-m" d="M9 12h5" s={anim({ '--a': 'r2g-draw', '--len': 5, '--dur': '1.6s' })} />
      {[10, 12, 14].map((y) =>
        [16, 18, 20].map((x) => <C key={`${x}${y}`} c={x === 16 && y === 12 ? 'r2g-core' : 'r2g-dot'} x={x} y={y} r={x === 16 && y === 12 ? 0.9 : 0.75} />),
      )}
    </GlyphFrame>
  );
}

const CTX = (() => {
  const out: Array<{ x: number; y: number; pinned: boolean }> = [];
  for (const y of [6, 9, 12, 15, 18]) {
    for (const x of [6, 9, 12, 15, 18]) {
      if ((x - 12) ** 2 + (y - 12) ** 2 <= 7.2 ** 2) out.push({ x, y, pinned: y === 6 });
    }
  }
  return out;
})();
const CTX_HALF = Math.ceil(CTX.length / 2);

/** Context window: a fixed lattice, top row pinned. Idle: half full. Working: fills in order. Done: full. */
export function GlyphContext(p: GlyphProps) {
  return (
    <GlyphFrame name="context" {...p}>
      <P c="r2g-bound" d="M7.5 4.4h9v3.2h-9z" />
      {CTX.map(({ x, y }, i) => (
        <g key={`${x}${y}`}>
          <C c="r2g-dot" x={x} y={y} r={0.5} />
          {i < CTX_HALF ? (
            <C c="r2g-node" x={x} y={y} r={1} />
          ) : (
            <C c="r2g-node r2g-done r2g-m" x={x} y={y} r={1} s={anim({ '--a': 'r2g-light', '--dur': '2.6s', '--delay': `${(i - CTX_HALF) * 0.09}s` })} />
          )}
        </g>
      ))}
    </GlyphFrame>
  );
}

const SCATTER: ReadonlyArray<readonly [number, number]> = [
  [3, 6], [6, 4], [9, 7], [4, 11], [8, 12], [5, 17], [9, 19], [3, 20], [11, 15], [7, 9], [10, 4], [12, 10],
];
const CLUSTER: ReadonlyArray<readonly [number, number]> = [
  [16.5, 10.75], [18, 10.75], [16.5, 12.25], [18, 12.25],
];

/** Compaction. Working: scattered dots collapse into a dense cluster. Done: cluster past the boundary. */
export function GlyphCompact(p: GlyphProps) {
  return (
    <GlyphFrame name="compact" {...p}>
      <P c="r2g-bound" d="M14 3v18" />
      {SCATTER.map(([x, y], i) => {
        const [tx, ty] = CLUSTER[i % 4];
        return (
          <C
            key={`${x}${y}`}
            c="r2g-node r2g-m r2g-to"
            x={x}
            y={y}
            r={0.8}
            s={anim({ '--a': 'r2g-slide', '--dx': tx - x, '--dy': ty - y, '--dur': '2.4s', '--delay': `${(i % 6) * 0.05}s` })}
          />
        );
      })}
      <P c="r2g-hair r2g-done" d="M15 9.2h4.5v4.6H15z" />
    </GlyphFrame>
  );
}

/** Harness gate: a call waits at the notch (red only with `anchor` = needs approval now). Working: passes. Done: through. */
export function GlyphHarnessGate(p: GlyphProps) {
  return (
    <GlyphFrame name="harness-gate" {...p}>
      <P c="r2g-line" d="M18.34 14.96A7 7 0 1 1 18.34 9.04" />
      <P c="r2g-hair" d="M18.3 9h2M18.3 15h2" />
      <C c="r2g-core" x={12} y={12} r={2.2} />
      <C c="r2g-anchor r2g-m" x={19} y={12} r={1.5} s={anim({ '--a': 'r2g-gate', '--dx': 3, '--dur': '2s' })} />
      <C c="r2g-node r2g-done" x={21.5} y={12} r={1.2} />
    </GlyphFrame>
  );
}

/** Subagent: delegate. Working: children bud out and back. Done: each returned as one summary dot. */
export function GlyphSubagent(p: GlyphProps) {
  return (
    <GlyphFrame name="subagent" {...p}>
      <C c="r2g-line" x={8.5} y={12} r={4} />
      <C c="r2g-core" x={8.5} y={12} r={1.2} />
      <P c="r2g-lead r2g-pre" d="M12 10l4-3M12 14l4 3" />
      <g className="r2g-pre">
        <C c="r2g-line r2g-m" x={18} y={6} r={2} s={anim({ '--a': 'r2g-bud', '--dx': -6, '--dy': 4, '--dur': '2.4s' })} />
        <C c="r2g-line r2g-m" x={18} y={18} r={2} s={anim({ '--a': 'r2g-bud', '--dx': -6, '--dy': -4, '--dur': '2.4s', '--delay': '0.12s' })} />
      </g>
      <C c="r2g-node r2g-done" x={14} y={9.8} r={1} />
      <C c="r2g-node r2g-done" x={14} y={14.2} r={1} />
    </GlyphFrame>
  );
}

const EVAL_ROWS = [6, 9, 12, 15, 18];

/** Eval trial. Working: bands scramble, then click back. Done: aligned, framed. */
export function GlyphEval(p: GlyphProps) {
  return (
    <GlyphFrame name="eval" {...p}>
      <P c="r2g-hair r2g-done" d="M3.5 3.5h17v17h-17z" />
      {EVAL_ROWS.map((y, r) => (
        <g key={y} className="r2g-m" style={anim({ '--a': 'r2g-shift', '--dx': [3, -3, 1.5, -1.5, 3][r], '--delay': `${r * 0.06}s`, '--dur': '1.8s' })}>
          {[6, 9, 12, 15, 18].map((x) => (
            <C key={x} c={x === 12 && y === 12 ? 'r2g-core' : 'r2g-node'} x={x} y={y} r={x === 12 && y === 12 ? 1.1 : 0.8} />
          ))}
        </g>
      ))}
    </GlyphFrame>
  );
}

/* ------------------------------------------------------------------ registry */

export type GlyphName =
  | 'slab' | 'stack' | 'seat' | 'handoff' | 'gate' | 'wire' | 'form' | 'orbit' | 'swap' | 'trace' | 'lens' | 'night'
  | 'loop' | 'tool' | 'mcp-port' | 'context' | 'compact' | 'harness-gate' | 'subagent' | 'eval';

export interface GlyphEntry {
  readonly name: GlyphName;
  readonly set: 'build' | 'agentic';
  readonly means: string;
  readonly Component: (p: GlyphProps) => JSX.Element;
}

export const GLYPHS: readonly GlyphEntry[] = [
  { name: 'slab', set: 'build', means: 'One subsystem / layer', Component: GlyphSlab },
  { name: 'stack', set: 'build', means: 'Whole build, N layers', Component: GlyphStack },
  { name: 'seat', set: 'build', means: 'Owner / open role', Component: GlyphSeat },
  { name: 'handoff', set: 'build', means: 'Review path', Component: GlyphHandoff },
  { name: 'gate', set: 'build', means: 'Test gate before merge', Component: GlyphGate },
  { name: 'wire', set: 'build', means: 'Integrate', Component: GlyphWire },
  { name: 'form', set: 'build', means: 'Plan', Component: GlyphForm },
  { name: 'orbit', set: 'build', means: 'Prototype', Component: GlyphOrbit },
  { name: 'swap', set: 'build', means: 'Repair plan / replaceable part', Component: GlyphSwap },
  { name: 'trace', set: 'build', means: 'Signal / PCB / data path', Component: GlyphTrace },
  { name: 'lens', set: 'build', means: 'Optical path (SHADES)', Component: GlyphLens },
  { name: 'night', set: 'build', means: 'Build night, one open seat', Component: GlyphNight },
  { name: 'loop', set: 'agentic', means: 'Agent loop', Component: GlyphLoop },
  { name: 'tool', set: 'agentic', means: 'Tool call: request + result', Component: GlyphTool },
  { name: 'mcp-port', set: 'agentic', means: 'MCP: one port per server', Component: GlyphMcpPort },
  { name: 'context', set: 'agentic', means: 'Context window, pinned top row', Component: GlyphContext },
  { name: 'compact', set: 'agentic', means: 'Compaction', Component: GlyphCompact },
  { name: 'harness-gate', set: 'agentic', means: 'Permission / hook gate', Component: GlyphHarnessGate },
  { name: 'subagent', set: 'agentic', means: 'Delegate to a clean window', Component: GlyphSubagent },
  { name: 'eval', set: 'agentic', means: 'Eval trial: scramble, click back', Component: GlyphEval },
];
