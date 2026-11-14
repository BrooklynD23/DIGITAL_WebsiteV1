/**
 * BRAIN · live HTML labels for the tools, MCP and context figures. Driven by the same loop clock and phases as the
 * canvas scenes (stageLoop / ctxFill in _brain/lessons), written straight to the DOM from the paint loop:
 * no React state per frame, and a node is only touched when its value changes.
 */
import { figureExamples as ex } from '../../_content/brain';
import { ctxFill, stageLoop } from '../../_brain/lessons';

export const TOOLS_STAGE = 2;
export const MCP_STAGE = 3;
export const CONTEXT_STAGE = 4;

const clamp = (v: number): number => Math.max(0, Math.min(1, v));
const seg = (u: number, a: number, b: number): number => clamp((u - a) / (b - a));
const bump = (v: number): number => Math.sin(clamp(v) * Math.PI);
const RING = 2 * Math.PI * 7.5;

export interface LiveEls {
  readonly call: HTMLElement;
  readonly result: HTMLElement;
  readonly tool: HTMLElement;
  readonly servers: readonly { readonly box: HTMLElement; readonly req: HTMLElement }[];
  readonly meter: HTMLElement;
  readonly pct: HTMLElement;
  readonly ring: SVGElement;
}

export function findLive(root: HTMLElement): LiveEls | null {
  const q = <T extends Element>(k: string): T | null => root.querySelector<T>(`[data-live="${k}"]`);
  const call = q<HTMLElement>('call');
  const result = q<HTMLElement>('result');
  const tool = q<HTMLElement>('tool');
  const meter = q<HTMLElement>('meter');
  const pct = q<HTMLElement>('pct');
  const ring = q<SVGElement>('ring');
  const servers = ex.servers.map((_, i) => ({ box: q<HTMLElement>(`srv${i}`), req: q<HTMLElement>(`req${i}`) }));
  if (!call || !result || !tool || !meter || !pct || !ring || servers.some((x) => !x.box || !x.req)) return null;
  return { call, result, tool, meter, pct, ring, servers: servers as LiveEls['servers'] };
}

const setO = (el: HTMLElement, v: number): void => {
  const o = v < 0.01 ? '0' : v.toFixed(2);
  if (el.style.opacity !== o) el.style.opacity = o;
};
const setT = (el: HTMLElement, t: string): void => {
  if (el.textContent !== t) el.textContent = t;
};

/** Update the labels of the stage the figure is on. Only stages 2..4 have live labels. */
export function updateLive(els: LiveEls, stage: number, time: number): void {
  if (stage === TOOLS_STAGE) {
    const { u, n } = stageLoop(TOOLS_STAGE, time);
    const c = ex.calls[n % ex.calls.length];
    setT(els.call, c.call);
    setT(els.result, `→ ${c.result}`);
    setT(els.tool, c.name);
    setO(els.call, 0.9 * seg(u, 0, 0.08) * (1 - seg(u, 0.5, 0.58)));
    setO(els.result, 0.9 * seg(u, 0.55, 0.62) * (1 - seg(u, 0.96, 1)));
    setO(els.tool, 0.85);
  } else if (stage === MCP_STAGE) {
    const { u } = stageLoop(MCP_STAGE, time);
    const k = Math.min(3, Math.floor(u * 4));
    const v = (u * 4) % 1;
    els.servers.forEach((x, i) => {
      const live = i === k ? bump(v) : 0;
      setO(x.box, 0.5 + 0.45 * live);
      setO(x.req, live > 0.05 ? 0.85 * live : 0);
    });
  } else if (stage === CONTEXT_STAGE) {
    const { u } = stageLoop(CONTEXT_STAGE, time);
    const p = ctxFill(u) * 100;
    const txt = `${p.toFixed(1)}%`;
    if (els.pct.textContent === txt) return;
    els.pct.textContent = txt;
    els.meter.dataset.tone = p < ex.warn ? 'ok' : p < ex.hot ? 'warn' : 'hot';
    els.ring.setAttribute('stroke-dasharray', `${((RING * p) / 100).toFixed(2)} ${RING.toFixed(2)}`);
  }
}
