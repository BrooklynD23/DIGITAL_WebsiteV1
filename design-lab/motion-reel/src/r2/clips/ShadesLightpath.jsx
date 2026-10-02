import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useC } from '../tokens.js';
import { FONT } from '../fonts.js';
import { Stage } from '../DotLayer.jsx';
import { TAU, clamp, easeOut, lerp } from '../engine.js';

// shades-lightpath (6 s, scrub): the SHADES signal path as a line/dot diagram.
//   text source → word timing (FPGA chip + word clock) → control (handheld pill) → display → optics →
//   the eye's fixation point. Matches the page's SVG fallback (_shades/LightPath.tsx) and copy.
// A word packet runs the leader at constant speed; the leader turns from dotted (planned) to solid
// (live) behind it and each stage's outline goes from dotted to solid as it is reached.
// Built for scrubbing: one monotonic motion, no cuts. Rest (last frame) = path live, fixation marked red.

export const SHADES_LIGHTPATH_FRAMES = 180;

const STAGES = ['TEXT SOURCE', 'WORD TIMING', 'CONTROL', 'DISPLAY', 'OPTICS', 'FIXATION POINT'];
const START = 14;
const END = 160;
/** Arrival of the packet at stage i, as a fraction of the clip (frame / 180). Mirrored in the manifest `markers`. */
export const SHADES_LIGHTPATH_MARKERS = STAGES.map((_, i) => +((START + ((END - START) * i) / 5) / SHADES_LIGHTPATH_FRAMES).toFixed(4));

/** Node centres along the path: a row (16:9) or a gentle zig-zag column (4:5). */
function nodes(width, height) {
  const tall = height > width;
  if (!tall) {
    const x0 = 190;
    const x1 = width - 190;
    return STAGES.map((_, i) => [lerp(x0, x1, i / 5), height / 2 - 10]);
  }
  const y0 = 190;
  const y1 = height - 210;
  return STAGES.map((_, i) => [width / 2 + (i % 2 ? 150 : -150), lerp(y0, y1, i / 5)]);
}

const on = (p, i) => clamp((p * 5 - i + 0.15) / 0.3); // 0..1 as the packet reaches stage i

// ---- stage glyphs (each ~120 px, drawn around 0,0). `a` = arrival 0..1 ----
const ink = (a, lo = 0.35) => lerp(lo, 1, a);
const dash = (a) => (a >= 1 ? undefined : '2 5');

function Text({ a }) {
  const C = useC();
  const rows = [9, 11, 8, 10, 6];
  return (
    <g>
      {rows.map((n, r) =>
        Array.from({ length: n }, (_, k) => (
          <circle key={`${r}-${k}`} cx={-50 + k * 10} cy={-40 + r * 20} r={3} fill={C.ink} fillOpacity={ink(a) * (k === 0 && r === 0 ? 1 : 0.85)} />
        )),
      )}
    </g>
  );
}

function Timing({ a, p }) {
  // word timing on the FPGA: a QFP chip, with the word clock (a pulse train) running under it
  const C = useC();
  const pins = [-24, -12, 0, 12, 24];
  const phase = clamp(p * 5 - 1, 0, 1); // pulse train scrolls while the packet sits here
  const train = Array.from({ length: 5 }, (_, k) => -40 + k * 20 - (phase * 20) % 20);
  return (
    <g>
      <g fill="none" stroke={C.ink} strokeWidth={1.5} strokeOpacity={ink(a)}>
        {pins.map((d) => (
          <g key={d}>
            <line x1={d} y1={-36} x2={d} y2={-46} />
            <line x1={d} y1={36} x2={d} y2={46} />
            <line x1={-36} y1={d} x2={-46} y2={d} />
            <line x1={36} y1={d} x2={46} y2={d} />
          </g>
        ))}
        <rect x={-36} y={-36} width={72} height={72} rx={3} strokeDasharray={dash(a)} />
        <rect x={-16} y={-16} width={32} height={32} strokeOpacity={ink(a) * 0.6} />
      </g>
      <g stroke={C.ink} strokeWidth={1.5} strokeOpacity={ink(a, 0.3)} fill="none" strokeLinejoin="round">
        <path d={train.map((x) => `M${x} 74h6v-10h8v10h6`).join('')} />
      </g>
    </g>
  );
}

function Control({ a }) {
  // the reader's handheld control: a rounded pill with pause and play buttons
  const C = useC();
  return (
    <g fill="none" stroke={C.ink} strokeWidth={1.5} strokeOpacity={ink(a)}>
      <rect x={-52} y={-28} width={104} height={56} rx={28} strokeDasharray={dash(a)} />
      <circle cx={-18} cy={0} r={13} />
      <circle cx={18} cy={0} r={13} />
      <path d="M-22 -5v10M-14 -5v10" strokeLinecap="round" />
      <path d="M14 -6l9 6-9 6z" fill={C.ink} fillOpacity={ink(a)} stroke="none" />
    </g>
  );
}

function Display({ a }) {
  const C = useC();
  return (
    <g>
      <rect x={-56} y={-38} width={112} height={76} rx={4} fill="none" stroke={C.ink} strokeOpacity={ink(a)} strokeWidth={1.5} strokeDasharray={dash(a)} />
      {Array.from({ length: 6 * 4 }, (_, i) => {
        const cx = -40 + (i % 6) * 16;
        const cy = -24 + Math.floor(i / 6) * 16;
        const lit = clamp(a * 24 - i * 0.6);
        return <circle key={i} cx={cx} cy={cy} r={lerp(2, 3.4, lit)} fill={C.ink} fillOpacity={lerp(0.22, 0.95, lit)} />;
      })}
    </g>
  );
}

function Optics({ a }) {
  const C = useC();
  // biconvex lens drawn as two dotted arcs; rays drawn by the parent
  const arc = (side) =>
    Array.from({ length: 15 }, (_, k) => {
      const t = -0.75 + (k / 14) * 1.5;
      return [side * (Math.cos(t) * 60 - 46), Math.sin(t) * 60];
    });
  return (
    <g>
      {[...arc(1), ...arc(-1)].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill={C.ink} fillOpacity={ink(a)} />
      ))}
    </g>
  );
}

function Eye({ a, fix }) {
  const C = useC();
  const pts = Array.from({ length: 28 }, (_, k) => {
    const t = (k / 28) * TAU;
    return [Math.cos(t) * 62, Math.sin(t) * 30 * (1 - 0.15 * Math.cos(t) ** 2)];
  });
  return (
    <g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.4} fill={C.ink} fillOpacity={ink(a) * 0.9} />
      ))}
      <circle cx={0} cy={0} r={22} fill="none" stroke={C.ink} strokeOpacity={ink(a)} strokeWidth={1.5} strokeDasharray={dash(a)} />
      {/* fixation point: bone until the word lands, then the clip's one red mark */}
      <circle cx={0} cy={0} r={lerp(3, 7, fix)} fill={fix >= 1 ? C.trigger : C.ink} fillOpacity={lerp(0.4, 1, a)} />
      {fix > 0 && fix < 1 && <circle cx={0} cy={0} r={lerp(40, 10, fix)} fill="none" stroke={C.ink} strokeOpacity={0.6 * (1 - fix)} strokeWidth={1.5} />}
    </g>
  );
}

export const ShadesLightpath = () => {
  const C = useC();
  const fr = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tall = height > width;
  const N = nodes(width, height);
  const p = clamp((fr - START) / (END - START)); // linear: steady under scrub
  const fix = easeOut(clamp((fr - END + 4) / 14));
  // packet position along the polyline
  const segF = p * 5;
  const si = Math.min(4, Math.floor(segF));
  const sf = segF - si;
  const [px, py] = [lerp(N[si][0], N[si + 1][0], sf), lerp(N[si][1], N[si + 1][1], sf)];
  const G = [Text, Timing, Control, Display, Optics, Eye];
  const lens = N[4];
  const eye = N[5];
  const rayA = clamp(p * 5 - 4); // light from optics to the eye
  const GS = tall ? 1.25 : 1.45; // glyph scale
  const R = 72 * GS; // gap from node centre where leaders stop
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Stage width={width} height={height}>
        {/* leaders: dotted ahead of the packet, solid behind */}
        {N.slice(0, 5).map(([x1, y1], i) => {
          const [x2, y2] = N[i + 1];
          const len = Math.hypot(x2 - x1, y2 - y1);
          const ux = (x2 - x1) / len;
          const uy = (y2 - y1) / len;
          const ax = x1 + ux * (i === 4 ? 52 * GS : R) * (tall ? 0.8 : 1);
          const ay = y1 + uy * (i === 4 ? 52 * GS : R) * (tall ? 0.8 : 1);
          const bx = x2 - ux * (i === 3 ? 68 * GS : R) * (tall ? 0.8 : 1);
          const by = y2 - uy * (i === 3 ? 68 * GS : R) * (tall ? 0.8 : 1);
          const f = clamp(segF - i);
          if (i === 4) {
            // optics → eye: three rays converging on the fixation point
            return (
              <g key={i}>
                {[-28, 0, 28].map((o) => {
                  const sx = lens[0] + (tall ? o : 0);
                  const sy = lens[1] + (tall ? 0 : o);
                  return (
                    <g key={o}>
                      <line x1={sx} y1={sy} x2={eye[0]} y2={eye[1]} stroke={C.ink} strokeOpacity={0.22} strokeWidth={1.5} strokeDasharray="2 6" />
                      <line x1={sx} y1={sy} x2={lerp(sx, eye[0], rayA)} y2={lerp(sy, eye[1], rayA)} stroke={C.ink} strokeOpacity={0.8} strokeWidth={1.5} />
                    </g>
                  );
                })}
              </g>
            );
          }
          return (
            <g key={i}>
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke={C.ink} strokeOpacity={0.28} strokeWidth={1.5} strokeDasharray="2 6" strokeLinecap="round" />
              <line x1={ax} y1={ay} x2={lerp(ax, bx, f)} y2={lerp(ay, by, f)} stroke={C.ink} strokeOpacity={0.95} strokeWidth={2.5} strokeLinecap="round" />
            </g>
          );
        })}
        {/* stages */}
        {N.map(([x, y], i) => {
          const Glyph = G[i];
          const a = i === 0 ? Math.max(0.6, on(p, 0)) : on(p, i);
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <g transform={`scale(${GS})`}>
                <Glyph a={a} p={p} fix={fix} />
              </g>
              <text
                x={0}
                y={(tall ? 96 : 100) * GS}
                textAnchor="middle"
                fontFamily={FONT.mono}
                fontSize={tall ? 22 : 22}
                letterSpacing="0.08em"
                fill={a >= 1 ? C.ink2 : C.ink3}
              >
                {STAGES[i]}
              </text>
            </g>
          );
        })}
        {/* word packet: 3 dots in a short row */}
        {p > 0 && p < 1 && (
          <g transform={`translate(${px} ${py})`}>
            {[-12, 0, 12].map((o, k) => (
              <circle key={o} cx={tall ? 0 : o} cy={tall ? o : 0} r={k === 1 ? 6 : 4.5} fill={C.ink} />
            ))}
          </g>
        )}
      </Stage>
    </AbsoluteFill>
  );
};
