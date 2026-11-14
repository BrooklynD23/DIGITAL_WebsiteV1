/** Pure canvas drawing for the BRAIN home sphere (no React), so more directions can sit beside A. Units are CSS px; the context is pre-scaled by dpr.
 *  Direction A "Loop": think = a wave over the dots; act = one dot leaves and returns; check = it lands as a new wave. */
import { clamp, ease, easeOut, held, impact, travel, type LoopState, type Travel } from './timeline';

const TAU = Math.PI * 2;
const N = 420;
const hash = (i: number): number => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const P: ReadonlyArray<readonly [number, number, number]> = Array.from({ length: N }, (_, i) => {
  const y = 1 - ((i + 0.5) / N) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963229728653;
  return [Math.cos(th) * r, y, Math.sin(th) * r] as const;
});
/** Two nearest neighbours of each dot, once. */
const NB: ReadonlyArray<readonly [number, number]> = P.map((p, i) => {
  let a = -1, b = -1, da = -2, db = -2;
  for (let j = 0; j < N; j++) {
    if (j === i) continue;
    const d = p[0] * P[j][0] + p[1] * P[j][1] + p[2] * P[j][2];
    if (d > da) { b = a; db = da; a = j; da = d; } else if (d > db) { b = j; db = d; }
  }
  return [a, b] as const;
});
const SLOT = [-0.55, 0.6, 2.55, 3.7];
const ax = new Float32Array(N), ay = new Float32Array(N), az = new Float32Array(N), aa = new Float32Array(N);

export interface Ink { readonly ink: string; readonly trigger: string }

function dot(g: CanvasRenderingContext2D, x: number, y: number, r: number, a: number) { g.globalAlpha = a; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
function seg(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, a: number, dash: number[] = []) {
  g.globalAlpha = a; g.setLineDash(dash); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
}

/** The call line, the tool slot and the dot in flight. */
export function drawCall(g: CanvasRenderingContext2D, S: number, ink: Ink, tr: Travel, x1: number, y1: number, x2: number, y2: number, red = true) {
  const big = S >= 200, x = x1 + (x2 - x1) * tr.f, y = y1 + (y2 - y1) * tr.f;
  g.strokeStyle = g.fillStyle = ink.ink; g.lineWidth = 1;
  seg(g, x1, y1, x2, y2, 0.35 * tr.vis, [4, 3]);
  seg(g, x1, y1, x, y, 0.85 * tr.vis);
  g.globalAlpha = 0.8 * tr.vis; g.beginPath(); g.arc(x2, y2, big ? 5.5 : 3, 0, TAU); g.stroke();
  if (tr.run) dot(g, x2, y2, big ? 3 : 1.6, 1);
  if (tr.held) { // the gate: a short bar across the line, and the one red mark waiting at it
    const gx = x1 + (x2 - x1) * 0.7, gy = y1 + (y2 - y1) * 0.7, L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L * 8, ny = (x2 - x1) / L * 8;
    seg(g, gx - nx, gy - ny, gx + nx, gy + ny, 0.9 * tr.vis);
    if (red) g.fillStyle = ink.trigger;
  }
  if (tr.f > 0.001 && !tr.run) dot(g, x, y, big ? 3.2 : 2, tr.vis);
  g.fillStyle = ink.ink;
}

export function drawA(g: CanvasRenderingContext2D, S: number, T: number, st: LoopState, ink: Ink) {
  const c = S / 2, R = S * 0.3, big = S >= 200, yaw = T * 0.00016, cy = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(0.38), sn = Math.sin(0.38);
  const waves: number[][] = []; // [ox, oy, oz, front (rad), gain], in view space
  if (st.phase === 'think') for (const off of [0, 500]) {
    const e = st.u + off, a = hash(Math.floor(e / 1000) * 2 + st.ji * 13 + off) * TAU;
    waves.push([Math.cos(a) * 0.8, Math.sin(a) * 0.8, 0.6, ((e % 1000) / 1000) * Math.PI, clamp(st.u / 300)]);
  }
  const im = impact(st);
  if (im) { const a = SLOT[im.i % 4]; waves.push([Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0.31, (im.e / 1000) * Math.PI, 1]); }
  const breath = 1 + Math.sin(T * 0.0021) * 0.008;
  for (let i = 0; i < N; i++) {
    const p = P[i], x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1] * ct - z * sn, zz = p[1] * sn + z * ct;
    let act = 0;
    for (const w of waves) { const d = Math.acos(clamp(x * w[0] + y * w[1] + zz * w[2], -1, 1)); act = Math.max(act, clamp(1 - Math.abs(d - w[3]) / 0.42) * w[4] * (1 - 0.5 * w[3] / Math.PI)); }
    const k = R * breath * (1 + act * 0.045);
    ax[i] = c + x * k; ay[i] = c + y * k; az[i] = (zz + 1) / 2; aa[i] = act;
  }
  g.strokeStyle = ink.ink; g.lineWidth = 1; g.setLineDash([]);
  for (let i = 0; i < N; i++) if (aa[i] > 0.3) for (const j of NB[i]) { g.globalAlpha = aa[i] * 0.6 * (0.3 + 0.7 * az[i]); g.beginPath(); g.moveTo(ax[i], ay[i]); g.lineTo(ax[j], ay[j]); g.stroke(); }
  g.fillStyle = ink.ink;
  const base = big ? 1.5 : 0.9;
  for (let i = 0; i < N; i++) dot(g, ax[i], ay[i], base * (0.65 + 0.5 * az[i]) * (1 + aa[i] * 1.1), clamp(0.14 + 0.5 * az[i] + aa[i] * 0.7));
  const tr = travel(st);
  if (tr && tr.vis > 0) { const a = SLOT[tr.i % 4], cx = Math.cos(a), sx = Math.sin(a); drawCall(g, S, ink, tr, c + cx * R * 1.04, c + sx * R * 1.04, c + cx * S * 0.455, c + sx * S * 0.455); }
}


export function fib(n: number): ReadonlyArray<readonly [number, number, number]> {
  return Array.from({ length: n }, (_, i) => { const y = 1 - ((i + 0.5) / n) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963229728653; return [Math.cos(th) * r, y, Math.sin(th) * r] as const; });
}
function rot(p: readonly [number, number, number], cy: number, sy: number, ct: number, st: number): [number, number, number] {
  const x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy;
  return [x, p[1] * ct - z * st, p[1] * st + z * ct];
}
function label(g: CanvasRenderingContext2D, s: string, x: number, y: number, S: number, a: number) {
  g.font = '11px "Geist Mono", ui-monospace, monospace'; g.textBaseline = 'middle';
  const w = g.measureText(s).width; g.globalAlpha = a; g.fillText(s, clamp(x - w / 2, 4, S - w - 4), y);
}

/* Direction B "Context": the sphere is the context window; dots fill in spiral order as the thought and each result land. */
const B_N = 560, B_P = fib(B_N);
/** How full the window is, 0..1. A held call adds nothing. */
export function levelAt(st: LoopState): number {
  const B0 = 0.12, TH = 0.14, TA = 0.16, tl = st.job.tools;
  const add = (n: number) => tl.slice(0, n).reduce((a, t) => a + (held(t) ? 0 : TA), 0);
  if (st.phase === 'think') return B0 + TH * st.p;
  if (st.phase === 'tool') return B0 + TH + add(st.ti) + (held(tl[st.ti]) ? 0 : TA * ease(clamp((st.p - 0.1) / 0.5)));
  const top = B0 + TH + add(tl.length);
  return st.phase === 'done' ? top : top + (B0 - top) * ease(st.p);
}
export function drawB(g: CanvasRenderingContext2D, S: number, T: number, st: LoopState, ink: Ink) {
  const c = S / 2, R = S * 0.33, big = S >= 200, yaw = T * 0.00016, cy = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(0.5), sn = Math.sin(0.5);
  const lv = levelAt(st), F = lv * B_N, base = big ? 1.5 : 0.9;
  g.fillStyle = ink.ink;
  for (let i = 0; i < B_N; i++) {
    const v = rot(B_P[i], cy, sy, ct, sn), z = (v[2] + 1) / 2, q = clamp((F - i) / 14);
    if (q <= 0) { dot(g, c + v[0] * R, c + v[1] * R, base * 0.55, 0.1 + 0.12 * z); continue; }
    const k = R * (1 + (1 - easeOut(q)) * 0.5), a = clamp(0.3 + 0.7 * z) * (0.35 + 0.65 * q);
    dot(g, c + v[0] * k, c + v[1] * k, base * (0.7 + 0.5 * z) * (1 + (1 - q) * 1.3), q < 1 ? Math.max(a, 0.75) : a);
  }
  // the meter: a hairline ring that closes as the window fills, and the figure in mono (ink, no colour)
  g.strokeStyle = g.fillStyle = ink.ink; g.lineWidth = 1; g.setLineDash([]);
  g.globalAlpha = 0.16; g.beginPath(); g.arc(c, c, R * 1.3, 0, TAU); g.stroke();
  g.globalAlpha = 0.8; g.beginPath(); g.arc(c, c, R * 1.3, -TAU / 4, -TAU / 4 + lv * TAU); g.stroke();
  const ea = -TAU / 4 + lv * TAU; dot(g, c + Math.cos(ea) * R * 1.3, c + Math.sin(ea) * R * 1.3, big ? 2.4 : 1.4, 1);
  if (big) label(g, Math.round(lv * 100) + '%', c, c + R * 1.3 + 16, S, 0.75);
}

/* Direction C "Tools": one small sphere, four tools and four servers on an orbit; a call travels out and back. */
const C_N = 300, C_P = fib(C_N);
/** Names exactly as figureExamples (calls, then servers) in _content/brain.ts. */
export const C_SAT = ['run_tests', 'read_file', 'web_search', 'send_message', 'GitHub', 'Notion', 'Discord', 'Google Drive'] as const;
export function drawC(g: CanvasRenderingContext2D, S: number, T: number, st: LoopState, ink: Ink) {
  const c = S / 2, big = S >= 200, im = impact(st), kick = im ? Math.exp(-im.e / 280) : 0, R = S * 0.185 * (1 + kick * 0.07);
  const yaw = T * 0.0002, cy = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(0.38), sn = Math.sin(0.38);
  const tr = travel(st), active = tr ? C_SAT.indexOf(st.job.tools[tr.i][0] as (typeof C_SAT)[number]) : -1;
  const co = Math.cos(-0.3), so = Math.sin(-0.3), RX = S * 0.43, RY = RX * 0.36;
  const sat = C_SAT.map((_, k) => { const a = (k / C_SAT.length) * TAU + T * 0.00005, ex = Math.cos(a) * RX, ey = Math.sin(a) * RY; return { x: c + ex * co - ey * so, y: c + ex * so + ey * co, front: Math.sin(a) > 0 }; });
  g.strokeStyle = g.fillStyle = ink.ink; g.lineWidth = 1;
  g.globalAlpha = 0.22; g.setLineDash([1, 4]); g.beginPath(); g.ellipse(c, c, RX, RY, -0.3, 0, TAU); g.stroke();
  sat.forEach((s, k) => {
    const L = Math.hypot(s.x - c, s.y - c), x1 = c + (s.x - c) / L * R * 1.08, y1 = c + (s.y - c) / L * R * 1.08;
    if (k === active && tr && tr.vis > 0) return;
    seg(g, x1, y1, s.x, s.y, s.front ? 0.2 : 0.11, [1, 4]);
    g.setLineDash([]); g.globalAlpha = s.front ? 0.6 : 0.3; g.beginPath(); g.arc(s.x, s.y, big ? 4.5 : 2.5, 0, TAU); g.stroke();
  });
  const think = st.phase === 'think' ? 1 : st.phase === 'tool' ? 0.3 : 0.06, base = big ? 1.4 : 0.9;
  g.fillStyle = ink.ink;
  for (let i = 0; i < C_N; i++) {
    const v = rot(C_P[i], cy, sy, ct, sn), z = (v[2] + 1) / 2;
    const tw = Math.max(Math.pow(Math.max(0, Math.sin(T * 0.005 + hash(i) * 40)), 8) * think, kick);
    dot(g, c + v[0] * R, c + v[1] * R, base * (0.65 + 0.5 * z) * (1 + tw * 0.9), clamp(0.16 + 0.5 * z + tw * 0.6));
  }
  if (active >= 0 && tr && tr.vis > 0) {
    const s = sat[active], L = Math.hypot(s.x - c, s.y - c);
    drawCall(g, S, ink, tr, c + (s.x - c) / L * R * 1.08, c + (s.y - c) / L * R * 1.08, s.x, s.y, false); // held stops at its gate in ink
    if (big) label(g, C_SAT[active], s.x, s.y + (s.y > c ? 17 : -17), S, 0.9 * tr.vis);
  }
}
