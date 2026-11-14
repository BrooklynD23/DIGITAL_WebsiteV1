/** Pure canvas drawing for the BRAIN home sphere (no React), so more directions can sit beside A. Units are CSS px; the context is pre-scaled by dpr.
 *  Direction A "Loop": think = a wave over the dots; act = one dot leaves and returns; check = it lands as a new wave. */
import { clamp, impact, travel, type LoopState, type Travel } from './timeline';

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
export function drawCall(g: CanvasRenderingContext2D, S: number, ink: Ink, tr: Travel, x1: number, y1: number, x2: number, y2: number) {
  const big = S >= 200, x = x1 + (x2 - x1) * tr.f, y = y1 + (y2 - y1) * tr.f;
  g.strokeStyle = g.fillStyle = ink.ink; g.lineWidth = 1;
  seg(g, x1, y1, x2, y2, 0.35 * tr.vis, [4, 3]);
  seg(g, x1, y1, x, y, 0.85 * tr.vis);
  g.globalAlpha = 0.8 * tr.vis; g.beginPath(); g.arc(x2, y2, big ? 5.5 : 3, 0, TAU); g.stroke();
  if (tr.run) dot(g, x2, y2, big ? 3 : 1.6, 1);
  if (tr.held) { // the gate: a short bar across the line, and the one red mark waiting at it
    const gx = x1 + (x2 - x1) * 0.7, gy = y1 + (y2 - y1) * 0.7, L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L * 8, ny = (x2 - x1) / L * 8;
    seg(g, gx - nx, gy - ny, gx + nx, gy + ny, 0.9 * tr.vis);
    g.fillStyle = ink.trigger;
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

