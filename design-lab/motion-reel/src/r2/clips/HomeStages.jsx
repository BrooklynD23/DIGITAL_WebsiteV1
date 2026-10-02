import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from '../tokens.js';
import { FONT } from '../fonts.js';
import { DotLayer, Stage } from '../DotLayer.jsx';
import { frame as engineFrame, clamp, easeInOut, easeOutBack, lerp, seg } from '../engine.js';

// home-stages (6 s, once): Plan → Prototype → Test → Integrate as one continuous dot morph.
// Each stage is the live engine verb (form, orbit, scramble, wire); between stages the dots
// re-pair by angle and travel, so the clip never cuts. Rest (final frame) = wire rest pose.

export const HOME_STAGES_FRAMES = 180;

const ENGINE = 560; // engine size (px) → dot counts + radii
const SEED = 'home-stages';

// [verb, startFrame, endFrame]; morphs fill the gaps.
const STAGES = [
  ['form', 0, 40, { shape: 'triangle' }],
  ['orbit', 52, 88, {}],
  ['scramble', 100, 136, {}],
  ['wire', 148, 172, {}],
];
const MORPH = 12;
// Rail playhead: quick start, firm stop with a 3% overshoot, so stages read as discrete steps.
const snap = (f) => Math.min(1.03, easeOutBack(clamp(f)));

const verbFrame = (i, t) => {
  const [verb, , , opts] = STAGES[i];
  return engineFrame(verb, t, { size: ENGINE, seed: SEED, ...opts });
};

const byAngle = (dots) => [...dots].sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x) || Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y));

/** Pair dots by angular rank and interpolate; lines cross-fade. */
function morph(A, B, f) {
  const a = byAngle(A.dots);
  const b = byAngle(B.dots);
  const n = Math.max(a.length, b.length);
  const e = easeInOut(f);
  const dots = [];
  let lastP = -1;
  let lastQ = -1;
  for (let i = 0; i < n; i++) {
    const pi = Math.floor((i * a.length) / n);
    const qi = Math.floor((i * b.length) / n);
    const p = a[pi];
    const q = b[qi];
    // duplicates (many → few, or few → many) dissolve instead of piling up on one target
    const merging = qi === lastQ;
    const splitting = pi === lastP;
    lastP = pi;
    lastQ = qi;
    const fade = merging ? 1 - e : splitting ? e : 1;
    // slight curl so the regroup reads as motion, not a dissolve
    const curl = Math.sin(e * Math.PI) * 0.06 * (i % 2 ? 1 : -1);
    dots.push({
      x: lerp(p.x, q.x, e) + curl * -lerp(p.y, q.y, e),
      y: lerp(p.y, q.y, e) + curl * lerp(p.x, q.x, e),
      z: 0,
      r: lerp(p.r, q.r, e) * (0.6 + 0.4 * fade),
      a: lerp(p.a, q.a, e) * fade,
      kind: 'dot',
    });
  }
  const lines = [
    ...A.lines.map((l) => ({ ...l, a: l.a * (1 - seg(f, 0, 0.5)) })),
    ...B.lines.map((l) => ({ ...l, a: l.a * seg(f, 0.5, 1) })),
  ];
  return { dots, lines };
}

/** Frame + stage position (0..3, fractional during morphs). */
function stateAt(fr) {
  for (let i = 0; i < STAGES.length; i++) {
    const [, s, e] = STAGES[i];
    if (fr <= e || i === STAGES.length - 1) {
      if (fr < s && i > 0) {
        const f = clamp((fr - (s - MORPH)) / MORPH);
        return { f: morph(verbFrame(i - 1, 1), verbFrame(i, 0), f), pos: i - 1 + snap(f) };
      }
      return { f: verbFrame(i, clamp((fr - s) / ((e - s) * 0.78))), pos: i };
    }
  }
  return { f: verbFrame(3, 1), pos: 3 };
}

function Rail({ x0, x1, y, pos, k }) {
  const nodes = [0, 1, 2, 3].map((i) => lerp(x0, x1, i / 3));
  const px = lerp(x0, x1, pos / 3);
  return (
    <g>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={C.ink} strokeOpacity={0.22} strokeWidth={1.5} strokeDasharray="2 6" strokeLinecap="round" />
      <line x1={x0} y1={y} x2={px} y2={y} stroke={C.ink} strokeOpacity={0.7} strokeWidth={1.5} strokeLinecap="round" />
      {nodes.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={5 * k} fill={pos >= i - 0.02 ? C.ink : C.ground} stroke={C.ink} strokeOpacity={0.7} strokeWidth={1.5} />
          <text x={x} y={y + 40 * k} textAnchor="middle" fill={C.ink3} fontFamily={FONT.mono} fontSize={20 * k} letterSpacing="0.08em">
            {`0${i + 1}`}
          </text>
        </g>
      ))}
      <circle cx={px} cy={y} r={7 * k} fill={C.trigger} />
    </g>
  );
}

export const HomeStages = () => {
  const fr = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tall = height > width;
  const draw = tall ? 900 : 860;
  const cx = width / 2;
  const cy = tall ? height * 0.44 : height * 0.46;
  const zoom = 1 + 0.035 * easeInOut(fr / HOME_STAGES_FRAMES);
  const { f, pos } = stateAt(fr);
  const railW = tall ? 560 : 520;
  const railY = tall ? height - 170 : height - 96;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Stage width={width} height={height}>
        <g transform={`translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}>
          <DotLayer f={f} cx={cx} cy={cy} size={draw} k={draw / ENGINE} stroke={1.4} />
        </g>
        <Rail x0={cx - railW / 2} x1={cx + railW / 2} y={railY} pos={pos} k={1} />
      </Stage>
    </AbsoluteFill>
  );
};
