/**
 * Home (both worlds): ONE dot stage carries Plan → Prototype → Test → Integrate. The stage is driven with the
 * pin's progress p (setProgress(p)); this scene maps p to a step and draws it with the shared engine.
 *
 *   Plan     holds its rest pose (the finished dotted triangle: the first viewport's artifact).
 *   others   play their verb over the step's play window, then hold rest.
 *   'cut'    (Signal Capture) a deliberate retrigger: the new verb starts on the step boundary.
 *   'morph'  (Apple) a true morph: every dot travels from the previous stage's rest pose into the new verb
 *            (angle-sorted correspondence, eased weight), lines cross-fade. Continuous at every boundary.
 *
 * Pure and deterministic (SSR = the same frame as the first client paint). 0 rAF of its own.
 */
import { frame, restFrame, stepAt, type Dot, type Frame, type FrameOpts, type Line, type StepOptions } from '../_system';
import { stages } from '../_content/home';

export type SceneMode = 'cut' | 'morph';

const MORPH_SHARE = 0.55;
const ease = (x: number): number => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
const byAngle = (a: Dot, b: Dot): number => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x) || a.x * a.x + a.y * a.y - (b.x * b.x + b.y * b.y);

function blend(A: readonly Dot[], B: readonly Dot[], aLines: readonly Line[], bLines: readonly Line[], w: number): Frame {
  const nA = A.length;
  const nB = B.length;
  const n = Math.max(nA, nB);
  const dots: Dot[] = [];
  let lastA = -1;
  let lastB = -1;
  for (let k = 0; k < n; k++) {
    const ia = Math.floor((k * nA) / n);
    const ib = Math.floor((k * nB) / n);
    const a = A[ia];
    const b = B[ib];
    // A dot that only exists on one side fades in or out instead of double-drawing at the endpoints.
    let alpha = a.a + (b.a - a.a) * w;
    if (ia === lastA) alpha *= w;
    if (ib === lastB) alpha *= 1 - w;
    lastA = ia;
    lastB = ib;
    if (alpha <= 0.01) continue;
    dots.push({
      x: a.x + (b.x - a.x) * w,
      y: a.y + (b.y - a.y) * w,
      z: a.z + (b.z - a.z) * w,
      r: a.r + (b.r - a.r) * w,
      a: alpha,
      kind: w < 0.5 ? (a.kind === 'anchor' ? 'dot' : a.kind) : b.kind,
    });
  }
  dots.sort((p, q) => p.z - q.z);
  const lines: Line[] = [
    ...aLines.map((l) => ({ ...l, a: l.a * (1 - w) })),
    ...bLines.map((l) => ({ ...l, a: l.a * w })),
  ].filter((l) => l.a > 0.01);
  return { dots, lines };
}

export function makeStageScene(mode: SceneMode, steps: StepOptions): (p: number, opts: FrameOpts) => Frame {
  const restCache = new Map<string, { readonly dots: readonly Dot[]; readonly lines: readonly Line[] }>();
  const restSorted = (i: number, opts: FrameOpts): { readonly dots: readonly Dot[]; readonly lines: readonly Line[] } => {
    const key = `${i}|${opts.size}|${opts.seed}`;
    let hit = restCache.get(key);
    if (!hit) {
      const f = restFrame(stages[i].verb, opts);
      hit = { dots: [...f.dots].sort(byAngle), lines: f.lines };
      restCache.set(key, hit);
    }
    return hit;
  };

  return (p, opts) => {
    const { i, t } = stepAt(p, steps);
    const verb = stages[i].verb;
    if (i === 0) return restFrame(verb, opts);
    if (mode === 'cut') return frame(verb, t, opts);
    const target = frame(verb, t, opts);
    const w = ease(Math.min(1, t / MORPH_SHARE));
    if (w >= 1) return target;
    const prev = restSorted(i - 1, opts);
    return blend(prev.dots, [...target.dots].sort(byAngle), prev.lines, target.lines, w);
  };
}
