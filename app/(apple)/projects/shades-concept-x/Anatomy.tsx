'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { PARTS, anatomy, type Layout, type Part, type RoleId } from '../../_content/shades-concept-x';
import type { Flat } from './iso-kit';

type Pose = 'pa' | 'pe' | 'xa' | 'xe';
const poseOf = (layout: Layout, exploded: boolean): Pose => `${layout === 'planned' ? 'p' : 'x'}${exploded ? 'e' : 'a'}` as Pose;
const BY_ID: ReadonlyMap<string, Part> = new Map(PARTS.map((p) => [p.id, p]));
const GROUPS: readonly { id: Part['group']; label: string }[] = [
  { id: 'frame', label: 'Frame' },
  { id: 'pod', label: 'Optics' },
  { id: 'link', label: 'Cable' },
  { id: 'controller', label: 'Controller' },
];
const SEG_MS = 760;
const HOLD_MS = 140;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const dist = (a: Flat, b: Flat) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const pathD = (pts: readonly Flat[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');

interface Props {
  readonly width: number;
  readonly height: number;
  readonly light: Readonly<Record<Pose, readonly Flat[]>>;
  readonly owners: Readonly<Record<RoleId, string>>;
  readonly art: ReactNode;
}

export function Anatomy({ width, height, light, owners, art }: Props) {
  const [layout, setLayout] = useState<Layout>('potential');
  const [exploded, setExploded] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);
  const figRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const wordRef = useRef<SVGGElement>(null);
  const rafRef = useRef(0);
  const pose = poseOf(layout, exploded);
  const pts = light[pose];
  const shown = active ?? pinned;

  /* Mark the shown part's pieces; no re-render of the art. */
  useEffect(() => {
    const root = figRef.current;
    if (!root) return;
    root.querySelectorAll('[data-on]').forEach((n) => n.removeAttribute('data-on'));
    if (shown) root.querySelectorAll(`.cx-piece[data-part="${shown}"], .cx-lbl[data-part="${shown}"]`).forEach((n) => n.setAttribute('data-on', ''));
  }, [shown]);

  const switchTo = (next: Layout) => {
    if (next === layout) return;
    setLayout(next);
    setSwitching(true);
  };
  useEffect(() => {
    if (!switching) return;
    const t = window.setTimeout(() => setSwitching(false), 1800);
    return () => window.clearTimeout(t);
  }, [switching, layout]);

  /* Light path: the word rides board → display → splitter → combiner → eye, one eased segment at a time. */
  const play = useCallback(() => {
    const path = pathRef.current;
    const word = wordRef.current;
    if (!path || !word) return;
    cancelAnimationFrame(rafRef.current);
    /* The main path and, when assembled, the Detail A path in the inset, driven by one clock. */
    const runs = [{ path, word, pts }];
    const inset = figRef.current?.querySelector<SVGGElement>(`.cx-inset-light[data-for="${layout}"]`);
    const insetPath = inset?.querySelector<SVGPathElement>('.cx-light-path');
    const insetWord = inset?.querySelector<SVGGElement>('.cx-word');
    const insetPts = insetPath?.dataset.pts?.split(';').map((p) => p.split(' ').map(Number) as unknown as Flat);
    if (!exploded && insetPath && insetWord && insetPts?.length === pts.length) runs.push({ path: insetPath, word: insetWord, pts: insetPts });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const place = (w: SVGGElement, [x, y]: Flat) => w.setAttribute('transform', `translate(${x} ${y})`);
    const lengths = runs.map((r) => r.pts.slice(1).reduce((sum, p, i) => sum + dist(r.pts[i], p), 0));
    const clear = () =>
      runs.forEach((r) => {
        r.path.style.strokeDasharray = '';
        r.path.style.strokeDashoffset = '';
      });
    if (reduce) {
      clear();
      runs.forEach((r) => place(r.word, r.pts[r.pts.length - 1]));
      return;
    }
    runs.forEach((r, n) => (r.path.style.strokeDasharray = `${lengths[n]}`));
    const start = performance.now();
    const segs = pts.length - 1;
    const frame = (now: number) => {
      /* rAF stamps the frame start, which can precede `start`: clamp, or the first frame reads segment −1. */
      const e = Math.max(0, now - start);
      const i = Math.min(segs - 1, Math.floor(e / (SEG_MS + HOLD_MS)));
      const k = ease(Math.min(1, (e - i * (SEG_MS + HOLD_MS)) / SEG_MS));
      runs.forEach((r, n) => {
        const a = r.pts[i];
        const b = r.pts[i + 1];
        place(r.word, [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
        const done = r.pts.slice(1, i + 1).reduce((sum, p, j) => sum + dist(r.pts[j], p), 0) + dist(a, b) * k;
        r.path.style.strokeDashoffset = `${lengths[n] - done}`;
      });
      if (e < segs * (SEG_MS + HOLD_MS)) rafRef.current = requestAnimationFrame(frame);
      else clear();
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [pts, layout, exploded]);

  /* Rest the word at the eye whenever the pose changes. */
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const word = wordRef.current;
    const end = pts[pts.length - 1];
    if (word) word.setAttribute('transform', `translate(${end[0]} ${end[1]})`);
    const paths = [pathRef.current, ...Array.from(figRef.current?.querySelectorAll<SVGPathElement>('.cx-inset-light .cx-light-path') ?? [])];
    paths.forEach((p) => {
      if (!p) return;
      p.style.strokeDasharray = '';
      p.style.strokeDashoffset = '';
      const last = p.dataset.pts?.split(';').pop();
      const w = p.parentElement?.querySelector('.cx-word');
      if (last && w) w.setAttribute('transform', `translate(${last})`);
    });
  }, [pts]);

  /* Play once when the figure first comes into view. */
  const played = useRef(false);
  useEffect(() => {
    const root = figRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true;
          play();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [play]);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /* Pointer on the drawing: delegate to the nearest piece. */
  const partAt = (target: EventTarget | null) => {
    const el = (target as Element | null)?.closest?.('.cx-piece[data-part]');
    const id = el?.getAttribute('data-part') ?? null;
    return id && BY_ID.has(id) ? id : null;
  };

  const part = shown ? BY_ID.get(shown) : undefined;
  const side = part ? part[layout] : null;
  const readout = part
    ? side
      ? `${part.name} · ${side.tag}`
      : `${part.name} · not in this layout`
    : anatomy.rest;

  return (
    <div
      ref={figRef}
      className="iso cx-fig"
      data-layout={layout}
      data-pose={exploded ? 'exploded' : 'assembled'}
      data-switching={switching ? '' : undefined}
      data-focus={shown ? '' : undefined}
    >
      <div className="cx-controls" role="group" aria-label={anatomy.toggles.layout.text}>
        <div className="cx-seg" role="group" aria-label={anatomy.toggles.layout.text}>
          <button type="button" aria-pressed={layout === 'planned'} onClick={() => switchTo('planned')}>
            {anatomy.toggles.planned.text}
          </button>
          <button type="button" aria-pressed={layout === 'potential'} onClick={() => switchTo('potential')}>
            {anatomy.toggles.potential.text}
          </button>
        </div>
        <button type="button" className="cx-btn" aria-pressed={exploded} onClick={() => setExploded((v) => !v)}>
          {exploded ? anatomy.toggles.assemble.text : anatomy.toggles.explode.text}
        </button>
        <button type="button" className="cx-btn" onClick={play}>
          {anatomy.toggles.light.text}
        </button>
      </div>

      <div className="iso-plate cx-plate-card">
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">{anatomy.fig}</span>
          <span className="iso-plate-corner" data-corner="title">{anatomy.plateTitle}</span>
          <span className="iso-plate-corner" data-corner="hint">{anatomy.hint}</span>
          <span className="iso-plate-corner" data-corner="readout">{readout}</span>
        </div>
        <svg
          className="iso-svg"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`SHADES ${layout === 'planned' ? 'planned prototype' : 'Concept X'}, ${exploded ? 'taken apart' : 'assembled'}. ${anatomy.lightCaption.text}`}
          onPointerOver={(e) => setActive(partAt(e.target))}
          onPointerLeave={() => setActive(null)}
          onClick={(e) => setPinned(partAt(e.target))}
        >
          {art}
          <g className="cx-cam">
          <g className="cx-light" aria-hidden="true">
            <path ref={pathRef} className="cx-light-path" d={pathD(pts)} />
            {pts.map(([x, y], i) => (
              <circle key={i} className="cx-light-node" cx={x} cy={y} r={i === pts.length - 1 ? 3.2 : 2.4} />
            ))}
            <g ref={wordRef} className="cx-word" transform={`translate(${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]})`}>
              <rect x={-17} y={-21} width={34} height={14} rx={3} />
              <text x={0} y={-10.5} textAnchor="middle">
                {anatomy.word}
              </text>
            </g>
          </g>
          </g>
        </svg>

        <div className="cx-readout" aria-live="polite">
          {part ? (
            <>
              <p className="cx-readout-name">{part.name}</p>
              <dl>
                <div>
                  <dt>Team</dt>
                  <dd>{owners[part.owner]}</dd>
                </div>
                <div>
                  <dt>Tag</dt>
                  <dd>{side ? <span className="cx-tag" data-tag={side.tag}>{side.tag}</span> : 'Not in this layout'}</dd>
                </div>
                {side?.value ? (
                  <div>
                    <dt>Value</dt>
                    <dd>{side.value.text}</dd>
                  </div>
                ) : null}
              </dl>
              {side ? <p className="cx-readout-note">{side.note.text}</p> : null}
            </>
          ) : (
            <p className="cx-readout-note">{anatomy.rest}. {anatomy.lightCaption.text}</p>
          )}
        </div>
      </div>

      <div className="cx-chips">
        {GROUPS.map((g) => (
          <div key={g.id} className="cx-chip-group" role="group" aria-label={g.label}>
            <p className="cx-chip-label">{g.label}</p>
            {PARTS.filter((p) => p.group === g.id).map((p) => {
              const s = p[layout];
              return (
                <button
                  key={p.id}
                  type="button"
                  className="cx-chip"
                  aria-pressed={pinned === p.id}
                  data-absent={s ? undefined : ''}
                  onPointerEnter={() => setActive(p.id)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(p.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setPinned((v) => (v === p.id ? null : p.id))}
                >
                  <span className="cx-chip-name">
                    <span className="cx-chip-n" aria-hidden="true">
                      {PARTS.indexOf(p) + 1}
                    </span>
                    {p.name}
                  </span>
                  <span className="cx-tag" data-tag={s?.tag ?? 'NONE'}>
                    {s?.tag ?? '—'}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
