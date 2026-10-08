'use client';

/**
 * SHADES mockup B · "the book leads": ONE pinned section, seven played stages, on the book photograph.
 * Scroll only picks the target stage (useScrollSteps); useStagePlayback tweens a playhead to it and every update
 * re-projects one glasses geometry (./_frame/geometry) between the two neighbouring poses. Native scroll is untouched.
 *
 * The hero is the theory on the page: fixation dots hop along the typeset lines, then land on one fixed point, where
 * the words of the page arrive one at a time (a setTimeout chain: 0 rAF, only on screen, tab visible, not paused).
 * From stage 1 the same word plate is the display inside the lens.
 *
 * Reduced motion / no JS: the same captions stack in normal flow, each with its still (full parity, no pin).
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { SHADES } from '../../_content/shades';
import { bookWords, conceptLabels, hero, heldWord, heldWordIndex, stages, systemGroups, viewNote } from '../../_content/shades-concept';
import { useScrollSteps } from '../../_system';
import { splitWord, wordDelay } from '../../_shades/rsvp';
import { useStagePlayback } from '../_hero/useStagePlayback';
import { Still } from './_frame/Still';
import { EX_DISPLAY, EX_OPTICS, HELD, POSES, camera, framePaths, mix, outline, planeMatrix, poseAt, poseScale, project, type P3 } from './_frame/geometry';
import s from './book.module.css';

const VIEWS = [{ id: 'hero', still: hero.still }, ...stages];
const STEPS = { count: VIEWS.length, lead: 0, playShare: 0.72 } as const;
const LABEL = conceptLabels.find((c) => c.usedBy === 'b') ?? conceptLabels[0];
const NOTES: readonly (string | null)[] = [SHADES.problem.figureNote, null, null, SHADES.lightPath.note, SHADES.lightPath.note, viewNote, null];
const DARK = new Set([3, 4]);
const SPLIT = 23; // the page is set in two halves around the fixed point; the sentence break after word 23
const WPM = SHADES.reader.wpm.min;
/** Words the illustrative fixations land on, in order. One jump goes back. */
const SEQ = [0, 2, 4, 7, 5, 9, 11, 14, 12, 16, 19, 22];
const DWELL = [7, 5, 8, 5, 9, 5, 7, 8, 5, 6, 9, 6];
const HOP = 150; // ms between fixations
const SCAN_MS = SEQ.length * HOP + 500;
const PLATE_W = 300;
const INK = [29, 29, 31];
const BONE = [245, 245, 247];
const ON_FRAME = systemGroups.filter((g) => g.onFrame);
const OFF_FRAME = systemGroups.filter((g) => !g.onFrame);
/** Where each on-frame tag hangs: a point on the frame, the lift it rides, and above (-1) or below (1). */
const TAG_AT: Readonly<Record<string, { readonly at: P3; readonly lift: number; readonly side: 1 | -1 }>> = {
  frame: { at: [31, -25.5, 0], lift: 0, side: -1 },
  optics: { at: [-31, -25.5, 0], lift: EX_OPTICS, side: -1 },
  display: { at: [-31, 7.5, 0], lift: EX_DISPLAY, side: 1 },
};

interface Pt { readonly x: number; readonly y: number }
interface Els {
  readonly fig: HTMLElement;
  readonly svg: SVGSVGElement;
  readonly shade: HTMLElement;
  readonly held: HTMLElement;
  readonly clip: HTMLElement;
  readonly paths: Readonly<Record<string, SVGPathElement>>;
  readonly tags: readonly HTMLElement[];
  readonly offs: readonly HTMLElement[];
  w: number;
  h: number;
}

/** Playhead (float stage index) → DOM. Linear in pos: the playhead tween supplies the easing. */
function paint(E: Els, pos: number): void {
  const { w, h } = E;
  if (!w || !h) return;
  const { p, cam } = poseAt(pos, w, h);
  const f = framePaths(cam, p.explode);
  (Object.keys(f) as (keyof typeof f)[]).forEach((key) => E.paths[key]?.setAttribute('d', f[key]));
  const u = Math.min(1, Math.max(0, (p.shade - 0.15) / 0.5));
  E.svg.style.color = `rgb(${INK.map((c, n) => Math.round(mix(c, BONE[n], u))).join(' ')})`;
  E.svg.dataset.line = p.fill < 0.5 ? 'dashed' : 'solid';
  const set = (name: string, v: number): void => E.fig.style.setProperty(name, v.toFixed(3));
  set('--frame', p.frame);
  set('--fill', p.fill);
  set('--tint', p.tint);
  set('--lift', Math.min(1, p.explode * 4));
  set('--temple', Math.min(1, Math.abs(p.yaw) / 10));
  set('--glass', p.glass);
  set('--lab', Math.max(0, p.lab * 2 - 1));
  E.clip.style.clipPath = p.clip ? `path('${f.glass}')` : 'none';
  set('--sys', Math.max(0, p.sys * 2 - 1));
  set('--cons', w < 900 ? 0 : p.cons);
  set('--cons-main', p.cons);
  set('--page', p.page);
  E.shade.style.opacity = p.shade.toFixed(3);

  const at: P3 = [HELD[0], HELD[1], p.explode * EX_DISPLAY];
  E.held.style.transform = `${planeMatrix(cam, at, (50 * cam.s * p.word) / PLATE_W)} translate(-50%, -50%)`;
  ON_FRAME.forEach((g, n) => {
    const a = TAG_AT[g.id];
    const [x, y] = project(a.at, cam, p.explode * a.lift);
    E.tags[n].style.transform = `translate3d(${x.toFixed(1)}px, ${(y + a.side * 8).toFixed(1)}px, 0)`;
  });
  // The off-frame functions feed the display: word timing → control → display. Dashed: nothing here is placed yet.
  const [t, c] = E.offs;
  if (t && c) {
    const [dx, dy] = project([HELD[0], HELD[1] + 6.5, 0], cam, p.explode * EX_DISPLAY);
    const ty = t.offsetTop + t.offsetHeight / 2;
    E.paths.chain.setAttribute('d', `M${t.offsetLeft + t.offsetWidth} ${ty}L${c.offsetLeft} ${ty}M${c.offsetLeft + c.offsetWidth / 2} ${c.offsetTop}L${dx.toFixed(1)} ${(dy + 22).toFixed(1)}`);
  }
}

/** The side elevation beside the idea drawing (wide figures only). Static per size. */
function elevation(w: number, h: number): string {
  return outline(camera(-90, 0, poseScale(POSES[1], w, h) * 0.6, w * 1.6, h, [0, -4, -70]));
}

function Word({ index, on }: { readonly index: number; readonly on: number }) {
  return (
    <>
      <span data-w={index} data-on={index === on ? '' : undefined}>{bookWords[index]}</span>{' '}
    </>
  );
}

export function BookStory() {
  const section = useRef<HTMLElement>(null);
  const fig = useRef<HTMLDivElement>(null);
  const els = useRef<Els | null>(null);
  const { enhanced, active, jumpTo } = useScrollSteps(section, STEPS);
  const [phase, setPhase] = useState<'idle' | 'scan' | 'held'>('idle');
  const [wi, setWi] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const [pts, setPts] = useState<readonly Pt[]>([]);
  const [centre, setCentre] = useState<Pt>({ x: 0, y: 0 });
  const [elev, setElev] = useState('');

  const head = useStagePlayback(active, STEPS.count, 1100, (pos) => {
    if (els.current) paint(els.current, pos);
  });

  /** Size changed: re-measure the words the fixations sit on, then repaint the pose. */
  const settle = useCallback(() => {
    const E = els.current;
    if (!E) return;
    E.w = E.fig.clientWidth;
    E.h = E.fig.clientHeight;
    const box = E.fig.getBoundingClientRect();
    setPts(
      SEQ.map((n) => {
        const r = E.fig.querySelector(`[data-w="${n}"]`)?.getBoundingClientRect();
        return r ? { x: r.left - box.left + r.width / 2, y: r.top - box.top - 2 } : { x: 0, y: 0 }; // just above the word, so no line is struck through
      }),
    );
    setCentre({ x: E.w / 2, y: E.h / 2 });
    setElev(elevation(E.w, E.h));
    paint(E, head.current.pos);
  }, [head]);

  useEffect(() => {
    const host = fig.current;
    const root = host?.closest<HTMLElement>(`.${s.sticky}`);
    const svg = host?.querySelector<SVGSVGElement>('[data-art]');
    const shade = root?.querySelector<HTMLElement>('[data-shade]');
    const held = host?.querySelector<HTMLElement>('[data-held]');
    const clip = host?.querySelector<HTMLElement>('[data-clip]');
    if (!enhanced || !host || !svg || !shade || !held || !clip) return undefined;
    const paths: Record<string, SVGPathElement> = {};
    host.querySelectorAll<SVGPathElement>('[data-p]').forEach((el) => {
      paths[el.dataset.p ?? ''] = el;
    });
    els.current = { fig: host, svg, shade, held, clip, paths, tags: Array.from(host.querySelectorAll<HTMLElement>('[data-tag]')), offs: Array.from(host.querySelectorAll<HTMLElement>('[data-off]')), w: 0, h: 0 };
    const ro = new ResizeObserver(settle); // also the first fit
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting));
    io.observe(host);
    document.fonts?.ready.then(settle).catch(() => undefined); // the reading face moves the words
    return () => {
      ro.disconnect();
      io.disconnect();
      els.current = null;
    };
  }, [enhanced, settle]);

  // The entry sequence plays once: the fixations hop, then land on the one point.
  useEffect(() => {
    if (!enhanced) return undefined;
    setPhase('scan');
    const t = window.setTimeout(() => setPhase('held'), SCAN_MS);
    return () => window.clearTimeout(t);
  }, [enhanced]);

  // The words of the page arrive at the point one at a time. One timeout per word, only while it can be seen.
  const [tabHidden, setTabHidden] = useState(false);
  useEffect(() => {
    const on = (): void => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  const streaming = enhanced && active === 0 && phase === 'held' && !paused && seen && !tabHidden;
  useEffect(() => {
    if (!streaming) return undefined;
    const t = window.setTimeout(() => setWi((wi + 1) % bookWords.length), wordDelay(bookWords[wi], WPM));
    return () => window.clearTimeout(t);
  }, [streaming, wi]);

  // The one sticky bar follows the ground: paper stages are light, the two dimmed stages are dark.
  const dark = enhanced && DARK.has(active);
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('[data-chrome="local-nav"]');
    if (!enhanced || !bar) return;
    if (dark) bar.dataset.tone = 'dark';
    else delete bar.dataset.tone;
  }, [dark, enhanced]);

  const word = active === 0 ? bookWords[wi] : heldWord;
  const parts = splitWord(word);
  const on = active === 0 ? (phase === 'held' ? wi : -1) : active === 5 ? heldWordIndex : -1;
  const scanStyle = (n: number, extra?: CSSProperties): CSSProperties => ({ ['--n' as string]: n, ...extra });

  return (
    <section ref={section} id="concept" className={s.pin} aria-labelledby="sb-title">
      <div className={s.sticky} data-tone={dark ? 'dark' : undefined}>
        {/* The one raster on the page. The blurred plate only: none of the photograph's own printed text is legible. */}
        <div className={s.plate} aria-hidden="true">
          <picture>
            <source media="(max-width: 734px)" type="image/avif" srcSet="/shades-concept/book-blurry-mobile.avif" />
            <source media="(max-width: 734px)" type="image/webp" srcSet="/shades-concept/book-blurry-mobile.webp" />
            <source type="image/avif" srcSet="/shades-concept/book-blurry-1920.avif" />
            {/* eslint-disable-next-line @next/next/no-img-element -- static export: images are hand-encoded, next/image is not used on these pages */}
            <img src="/shades-concept/book-blurry-1920.webp" alt="" decoding="async" />
          </picture>
          <span className={s.wash} />
          <span className={s.shade} data-shade="" />
        </div>

        <div className={s.captions}>
          {VIEWS.map((x, i) => (
            <div key={x.id} className={s.caption} data-active={i === active ? 'true' : undefined} aria-hidden={enhanced && i !== active ? true : undefined}>
              <Still index={i} alt={x.still} />
              {i === 0 ? (
                <>
                  <h1 id="sb-title" className={s.h1}>{hero.h1}</h1>
                  <p className={s.line}>{hero.promise}</p>
                  <p className={s.foot}>{hero.boundary}</p>
                </>
              ) : (
                <>
                  <h2 className={s.h2}>{stages[i - 1].title}</h2>
                  <p className={s.line}>{stages[i - 1].caption}</p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className={s.figBox}>
          <div ref={fig} className={s.fig} role="img" aria-label={VIEWS[active].still} data-stage={active} data-phase={active > 0 ? 'held' : phase}>
            {/* The page: live words typeset by the site, in two halves around the fixed point. */}
            {/* Under the page: the word lens as a bright window (optics stage). */}
            <svg className={s.art} aria-hidden="true" focusable="false">
              <path className={s.glass} data-p="glass" />
            </svg>
            <div className={s.pageClip} data-clip="" aria-hidden="true">
            <div className={s.page}>
              <p className={s.half}>
                {bookWords.slice(0, SPLIT).map((w, i) => (
                  <Word key={`${w}-${i}`} index={i} on={on} />
                ))}
              </p>
              <span className={s.gap} />
              <p className={s.half}>
                {bookWords.slice(SPLIT).map((w, i) => (
                  <Word key={`${w}-${i}`} index={i + SPLIT} on={on} />
                ))}
              </p>
            </div>
            </div>

            {/* Hero: the eye's path along the lines. Illustrative. */}
            <svg className={s.scan} aria-hidden="true" focusable="false">
              {pts.slice(1).map((b, n) => {
                const a = pts[n];
                return <path key={n} className={s.jump} pathLength={1} style={scanStyle(n + 1)} d={`M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${((a.x + b.x) / 2).toFixed(1)} ${(Math.min(a.y, b.y) - 16).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`} />;
              })}
              {pts.map((p, n) => (
                <circle key={`r${n}`} className={s.ring} cx={p.x} cy={p.y} r={DWELL[n]} style={scanStyle(n)} />
              ))}
              {pts.map((p, n) => (
                <circle key={`d${n}`} className={s.fix} cx={p.x} cy={p.y} r={DWELL[n] * 0.5} style={scanStyle(n, { ['--dx' as string]: `${(centre.x - p.x).toFixed(1)}px`, ['--dy' as string]: `${(centre.y - p.y).toFixed(1)}px` })} />
              ))}
            </svg>

            {/* The glasses: one geometry, re-projected for every pose. */}
            <svg className={s.art} data-art="" data-line="dashed" aria-hidden="true" focusable="false">
              <g className={s.elev}>
                <path d={elev} />
              </g>
              <g className={s.body}>
                <path className={s.cons} data-p="cons" />
                <path className={s.temple} data-p="templeL" />
                <path className={s.temple} data-p="templeR" />
                <path className={s.back} data-p="back" />
                <path className={s.tint} data-p="lenses" />
                <path className={s.front} data-p="front" />
                <path className={s.optics} data-p="optics" />
                <path className={s.axis} data-p="axis" />
              </g>
              <path className={s.chain} data-p="chain" />
            </svg>

            {OFF_FRAME.map((g) => (
              <span key={g.id} className={s.off} data-off={g.id} aria-hidden="true">{g.label}</span>
            ))}
            {ON_FRAME.map((g) => (
              <span key={g.id} className={s.tag} data-tag={g.id} data-side={TAG_AT[g.id].side} aria-hidden="true">{g.label}</span>
            ))}

            {/* The held word: HUD green on a flat dark plate (local dimming), the red fixation point under its pivot letter. */}
            <div className={s.held} data-held="" aria-hidden="true">
              <span className={s.word}>
                <span>{parts.pre}</span>
                <b>{parts.pivot}</b>
                <span>{parts.post}</span>
              </span>
              <span className={s.point} />
            </div>

            {NOTES.map((n, i) => (n ? <span key={i} className={s.figNote} data-active={i === active ? 'true' : undefined} aria-hidden="true">{n}</span> : null))}
          </div>
        </div>

        <div className={s.bar}>
          <div className={s.controls}>
            <nav className={s.tracker} aria-label={SHADES.name}>
              {stages.map((x, i) => (
                <button key={x.id} type="button" className={s.trackBtn} aria-current={i + 1 === active ? 'step' : undefined} onClick={() => jumpTo(i + 1)} disabled={!enhanced}>
                  <span className={s.trackDot} aria-hidden="true" />
                  <span className={s.trackName}>{x.label}</span>
                </button>
              ))}
            </nav>
            <button type="button" className={s.pause} onClick={() => setPaused(!paused)} aria-label={paused ? SHADES.reader.controls.resume : SHADES.reader.controls.pause} disabled={!enhanced}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
                <path d={paused ? 'M5 3.5v9l7.5-4.5z' : 'M5 3.5v9M11 3.5v9'} />
              </svg>
            </button>
          </div>
          {/* Concept labelling, proposal B: a dashed tag (dashed = planned) and one line, under the tracker in every stage. */}
          <p className={s.concept}>
            <span className={s.chip}>{LABEL.tag}</span>
            <span>{LABEL.disclosure}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
