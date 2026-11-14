/** BRAIN home sphere: one timeline, a pure function of time. The sphere and the readout both read it (Direction A, "Loop"). */
import { homeJobs, type HomeJob } from '../../_content/home';

export type Tool = HomeJob['tools'][number];
export type Phase = 'think' | 'tool' | 'done' | 'rest';
export interface LoopState { readonly ji: number; readonly job: HomeJob; readonly u: number; readonly phase: Phase; readonly ti: number; readonly p: number }
export interface Travel { readonly i: number; readonly f: number; readonly held: boolean; readonly run?: boolean; readonly vis: number }

export const TOOL = 1300, HOLD = 2200, REST = 1400, CHAR = 24;
export const clamp = (v: number, a = 0, b = 1): number => (v < a ? a : v > b ? b : v);
export const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOut = (t: number): number => 1 - (1 - t) ** 3;
export const held = (tool: Tool): boolean => tool[3] === false;

/** One looping timeline over a list of jobs. The home sphere and the BRAIN page each build their own. */
export function makeTimeline(jobs: readonly HomeJob[]) {
  let acc = 0;
  const TL = jobs.map((job, ji) => {
    const think = Math.max(1200, job.think.length * CHAR), toolsEnd = think + job.tools.length * TOOL;
    const o = { job, ji, start: acc, think, toolsEnd, len: toolsEnd + HOLD + REST };
    acc += o.len;
    return o;
  });
  const LOOP = acc;
  /** Reduced motion: job 1, second call, the dot at its tool. */
  const still = TL[0].think + TOOL * 1.45;
  const stateAt = (T: number): LoopState => {
    const t = ((T % LOOP) + LOOP) % LOOP;
    const o = TL.find((x) => t < x.start + x.len) ?? TL[0], u = t - o.start;
    if (u < o.think) return { ji: o.ji, job: o.job, u, phase: 'think', ti: -1, p: u / o.think };
    if (u < o.toolsEnd) return { ji: o.ji, job: o.job, u, phase: 'tool', ti: Math.floor((u - o.think) / TOOL), p: ((u - o.think) % TOOL) / TOOL };
    if (u < o.toolsEnd + HOLD) return { ji: o.ji, job: o.job, u, phase: 'done', ti: -1, p: (u - o.toolsEnd) / HOLD };
    return { ji: o.ji, job: o.job, u, phase: 'rest', ti: -1, p: (u - o.toolsEnd - HOLD) / REST };
  };
  return { stateAt, still };
}

const home = makeTimeline(homeJobs);
export const STILL = home.still;
export const stateAt = home.stateAt;

/** The call in flight: f = 0 at the model, 1 at the tool. A held call stops at 0.6, at the gate. */
export function travel(st: LoopState): Travel | null {
  const tl = st.job.tools;
  if (st.phase === 'tool') {
    const p = st.p;
    if (held(tl[st.ti])) return { i: st.ti, f: 0.6 * easeOut(clamp(p / 0.35)), held: true, vis: clamp(p / 0.1) };
    const f = p < 0.35 ? ease(p / 0.35) : p < 0.6 ? 1 : p < 0.9 ? 1 - ease((p - 0.6) / 0.3) : 0;
    return { i: st.ti, f, held: false, run: p >= 0.35 && p < 0.6, vis: clamp(p / 0.1) * clamp((1 - p) / 0.1) };
  }
  const li = tl.length - 1;
  if (held(tl[li])) {
    if (st.phase === 'done') return { i: li, f: 0.6, held: true, vis: 1 };
    if (st.phase === 'rest') return { i: li, f: 0.6 * (1 - ease(st.p)), held: true, vis: 1 - st.p };
  }
  return null;
}

/** The last result that came back: which tool, and ms since it landed (null after 1s or when nothing landed). */
export function impact(st: LoopState): { i: number; e: number } | null {
  const tl = st.job.tools;
  let i = -1, e = 0;
  if (st.phase === 'tool') { if (st.p >= 0.9) { i = st.ti; e = (st.p - 0.9) * TOOL; } else if (st.ti > 0) { i = st.ti - 1; e = (st.p + 0.1) * TOOL; } }
  else if (st.phase === 'done') { i = tl.length - 1; e = st.p * HOLD + 0.1 * TOOL; }
  return i < 0 || e > 1000 || held(tl[i]) ? null : { i, e };
}
