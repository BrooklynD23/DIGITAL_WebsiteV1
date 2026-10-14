'use client';

/**
 * SHADES concept (mockup A, "the object leads") · one pinned section, ONE artwork, seven played stages.
 * Scroll only picks the target stage (useScrollSteps); useStagePlayback tweens a playhead to it and every playhead
 * update re-projects the same glasses geometry between the two neighbouring poses (scene.ts). Nothing is scrubbed
 * and nothing rests half-way. The hero's dots and the View stage's word stream are timed plays (CSS / setTimeout),
 * each played once per entry: 0 rAF at rest, no loop.
 * Reduced motion / no JS: seven stills in normal flow with the same copy (full parity, no pin).
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { SHADES } from '../../_content/shades';
import { bookWords, conceptLabels, heldWord, heldWordIndex, hero, stages, systemGroups, viewNote } from '../../_content/shades-concept';
import { useScrollSteps } from '../../_system';
import { useStagePlayback } from '../_hero/useStagePlayback';
import { Artwork } from './_art/Artwork';
import { PATH_KEYS, STAGE_COUNT, STILL_VIEW, TAG_KEYS, sceneAt, type PathKey, type Scene, type TagKey } from './_art/scene';
import s from './concept.module.css';

const STEPS = { count: STAGE_COUNT, playShare: 0.72 } as const;
const LAST = STAGE_COUNT - 1;
const LABEL = conceptLabels.find((l) => l.usedBy === 'a') ?? conceptLabels[0];
const STILLS: readonly string[] = [hero.still, ...stages.map((x) => x.still)];
const GROUP_LABEL = Object.fromEntries(systemGroups.map((g) => [g.id, g.label])) as Record<TagKey, string>;
const VIEW_STAGE = 5;
/** The word stream in the View stage: one sentence of the book, ending on the held word. Under three changes a second. */
const STREAM_FROM = 5;
const STREAM_MS = 340;
/** Review control (DECISIONS #3): the two word colours, printed as their values. */
const WORD_COLOURS = ['#7FE6A3', '#FFFFFF'] as const;

/** Hero figure: fixation-like dots scattered along six lines of a page. Integer hash, so server and client agree. */
const rnd = (n: number): number => ((Math.imul(n + 1, 2654435761) >>> 0) % 10000) / 10000;
const DOTS = Array.from({ length: 54 }, (_, i) => {
  const row = Math.floor(i / 9);
  const col = i % 9;
  return { i, u: (col + 0.15 + rnd(i) * 0.7) / 9 - 0.5, v: ((row + 0.5) / 6 - 0.5) * 0.9 + (rnd(i + 99) - 0.5) * 0.02, r: 3 + Math.round(rnd(i + 7) * 3) };
}).filter((d) => Math.abs(d.u) > 0.1 || Math.abs(d.v) > 0.24);

const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
const pct = (v: number, of: number): string => `${((v / of) * 100).toFixed(2)}%`;

function Book() {
  return (
    <picture>
      <source media="(max-width: 734px)" type="image/avif" srcSet="/shades-concept/book-clear-mobile.avif" />
      <source media="(max-width: 734px)" type="image/webp" srcSet="/shades-concept/book-clear-mobile.webp" />
      <source type="image/avif" srcSet="/shades-concept/book-clear-1920.avif" />
      {/* eslint-disable-next-line @next/next/no-img-element -- static export: hand-encoded AVIF / WebP, no optimiser */}
      <img src="/shades-concept/book-clear-1920.webp" alt="" width={1920} height={1081} loading="lazy" decoding="async" />
    </picture>
  );
}

function Dots({ style }: { readonly style?: CSSProperties }) {
  return (
    <div className={s.dots} data-dots="" style={style} aria-hidden="true">
      {DOTS.map((d) => (
        <span key={d.i} className={s.dot} style={{ ['--u' as string]: d.u.toFixed(4), ['--v' as string]: d.v.toFixed(4), ['--i' as string]: d.i, ['--r' as string]: `${d.r}px` }} />
      ))}
    </div>
  );
}

function Tags({ scene }: { readonly scene?: Scene }) {
  return (
    <>
      {TAG_KEYS.map((k) => {
        const t = scene?.tags[k];
        return (
          <span key={k} className={s.tag} data-tag={k} data-g={k} style={t ? { left: pct(t.x, STILL_VIEW.w), top: pct(t.y, STILL_VIEW.h), opacity: t.o } : undefined} aria-hidden="true">
            <span className={s.swatch} />
            {GROUP_LABEL[k]}
          </span>
        );
      })}
    </>
  );
}

/** What sits under the figure in a stage: the boundary, the five functions, the view note, the roadmap. */
function Panel({ i }: { readonly i: number }): ReactNode {
  if (i === 0) return <p className={s.foot}>{hero.boundary}</p>;
  if (i === 3) {
    return (
      <dl className={s.legend}>
        {systemGroups.map((g) => (
          <div key={g.id} data-g={g.id}>
            <dt><span className={s.swatch} aria-hidden="true" />{g.label}</dt>
            <dd>{g.role}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (i === VIEW_STAGE) return <p className={s.foot}>{viewNote}</p>;
  if (i === LAST) {
    return (
      <div className={s.road}>
        <ol className={s.phases}>
          {SHADES.roadmap.phases.map((ph) => (
            <li key={ph.n}><span className={s.phaseN}>{ph.n}</span>{ph.name}</li>
          ))}
        </ol>
        <p className={s.foot}>{SHADES.roadmap.note}</p>
      </div>
    );
  }
  return null;
}

function Copy({ i }: { readonly i: number }) {
  if (i === 0) {
    return (
      <>
        <h1 className={s.h1} id="shades-title">{hero.h1}</h1>
        <p className={s.line}>{hero.promise}</p>
      </>
    );
  }
  const st = stages[i - 1];
  return (
    <>
      <h2 className={s.h2}>{st.title}</h2>
      <p className={s.line}>{st.caption}</p>
    </>
  );
}

function Still({ i }: { readonly i: number }) {
  const sc = sceneAt(i, STILL_VIEW);
  const { w, h } = STILL_VIEW;
  return (
    <div className={s.stillFig} role="img" aria-label={STILLS[i]}>
      {i === VIEW_STAGE ? (
        <div className={s.photo} style={{ left: pct(sc.lens.x, w), top: pct(sc.lens.y, h), width: pct(sc.lens.w, w), height: pct(sc.lens.h, h) }}><Book /></div>
      ) : null}
      <Artwork scene={sc} still />
      {i === 0 ? <Dots style={{ left: pct(sc.dot.x, w), top: pct(sc.dot.y, h) }} /> : null}
      <Tags scene={sc} />
    </div>
  );
}

interface Els {
  readonly fig: HTMLElement;
  readonly svg: SVGSVGElement;
  readonly paths: Readonly<Record<PathKey, SVGPathElement>>;
  readonly word: SVGTextElement;
  readonly dot: SVGCircleElement;
  readonly tags: Readonly<Record<TagKey, HTMLElement>>;
  readonly dots: HTMLElement;
  insets: readonly number[];
}

/** Playhead (float stage index) → DOM. Linear in pos: the playhead tween supplies the easing. */
function paint(els: Els, photo: HTMLElement | null, pos: number): void {
  const w = els.fig.clientWidth;
  const h = els.fig.clientHeight;
  if (!w || !h) return;
  const i = Math.min(LAST, Math.max(0, Math.floor(pos)));
  const inset = mix(els.insets[i] ?? 0, els.insets[Math.min(LAST, i + 1)] ?? 0, Math.min(1, Math.max(0, pos - i)));
  const sc = sceneAt(pos, { w, h, inset });
  PATH_KEYS.forEach((k) => {
    const el = els.paths[k];
    const o = sc.o[k];
    el.style.opacity = o.toFixed(3);
    if (o > 0.001) el.setAttribute('d', sc.d[k]);
  });
  els.svg.style.setProperty('--tint', sc.tint.toFixed(3));
  els.word.setAttribute('x', sc.word.x.toFixed(1));
  els.word.setAttribute('y', sc.word.y.toFixed(1));
  els.word.setAttribute('font-size', sc.word.size.toFixed(1));
  els.dot.setAttribute('cx', sc.dot.x.toFixed(1));
  els.dot.setAttribute('cy', sc.dot.y.toFixed(1));
  els.dot.setAttribute('r', sc.dot.r.toFixed(1));
  TAG_KEYS.forEach((k) => {
    const t = sc.tags[k];
    els.tags[k].style.cssText = `left:${t.x.toFixed(1)}px;top:${t.y.toFixed(1)}px;opacity:${t.o.toFixed(3)}`;
  });
  els.dots.style.cssText = `left:${sc.dot.x.toFixed(1)}px;top:${sc.dot.y.toFixed(1)}px;opacity:${sc.ghost.toFixed(3)};--bh:${(h - inset).toFixed(0)}px`;
  if (photo) photo.style.cssText = `left:${sc.lens.x.toFixed(1)}px;top:${sc.lens.y.toFixed(1)}px;width:${sc.lens.w.toFixed(1)}px;height:${sc.lens.h.toFixed(1)}px;opacity:${sc.photo.toFixed(3)}`;
}

export function ConceptStages() {
  const section = useRef<HTMLElement>(null);
  const fig = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const els = useRef<Els | null>(null);
  const [white, setWhite] = useState(false);
  const { enhanced, active, jumpTo } = useScrollSteps(section, STEPS);

  const head = useStagePlayback(active, STEPS.count, 1100, (pos) => {
    if (els.current) paint(els.current, photo.current, pos);
  });
  const settle = useCallback(() => {
    const e = els.current;
    if (!e) return;
    e.insets = Array.from({ length: STAGE_COUNT }, (_, i) => {
      const p = e.fig.querySelector<HTMLElement>(`[data-panel="${i}"]`);
      return p ? p.offsetHeight + 12 : 0;
    });
    paint(e, photo.current, head.current.pos);
  }, [head]);

  useEffect(() => {
    const host = fig.current;
    const svg = host?.querySelector<SVGSVGElement>('svg[data-art]');
    if (!enhanced || !host || !svg) return undefined;
    const q = <T extends Element>(sel: string): T => host.querySelector<T>(sel) as T;
    svg.removeAttribute('viewBox'); // from here on the artwork is painted in box pixels
    els.current = {
      fig: host,
      svg,
      paths: Object.fromEntries(PATH_KEYS.map((k) => [k, q<SVGPathElement>(`[data-k="${k}"]`)])) as Record<PathKey, SVGPathElement>,
      word: q<SVGTextElement>('[data-word]'),
      dot: q<SVGCircleElement>('[data-fix]'),
      tags: Object.fromEntries(TAG_KEYS.map((k) => [k, q<HTMLElement>(`[data-tag="${k}"]`)])) as Record<TagKey, HTMLElement>,
      dots: q<HTMLElement>('[data-dots]'),
      insets: [],
    };
    const ro = new ResizeObserver(settle); // also the first fit
    ro.observe(host);
    return () => {
      ro.disconnect();
      els.current = null;
    };
  }, [enhanced, settle]);

  // The photograph mounts when the story nears the View stage; fit it as soon as it exists.
  const photoOn = enhanced && active >= VIEW_STAGE - 2;
  useEffect(() => {
    if (photoOn) settle();
  }, [photoOn, settle]);

  // Hero: the dots converge once each time the hero is entered (CSS, timed).
  useEffect(() => {
    const host = fig.current;
    if (!enhanced || !host || active !== 0) return undefined;
    host.removeAttribute('data-play');
    void host.offsetWidth;
    host.setAttribute('data-play', '');
    return () => host.removeAttribute('data-play');
  }, [enhanced, active]);

  // View: the words of one sentence arrive one at a time at the fixed point, then the held word stays.
  useEffect(() => {
    const word = fig.current?.querySelector<SVGTextElement>('[data-word]');
    if (!enhanced || !word || active !== VIEW_STAGE) return undefined;
    let n = STREAM_FROM;
    let timer = window.setTimeout(function next() {
      word.textContent = bookWords[n];
      if (n < heldWordIndex) {
        n += 1;
        timer = window.setTimeout(next, STREAM_MS);
      }
    }, 1200);
    return () => {
      window.clearTimeout(timer);
      word.textContent = heldWord;
    };
  }, [enhanced, active]);

  return (
    <section ref={section} id="concept" data-tone="dark" className={s.pin} data-word={white ? 'white' : 'green'} aria-labelledby="shades-title">
      <div className={s.sticky}>
        <div className={s.captions}>
          {STILLS.map((_, i) => (
            <div key={i} className={s.caption} data-active={i === active ? 'true' : undefined} aria-hidden={i === active ? undefined : true}>
              <Copy i={i} />
            </div>
          ))}
        </div>

        <div ref={fig} className={s.fig}>
          {photoOn ? <div ref={photo} className={s.photo} data-photo="" aria-hidden="true"><Book /></div> : null}
          <div className={s.art} role="img" aria-label={STILLS[active]}>
            <Artwork scene={sceneAt(0, STILL_VIEW)} />
          </div>
          <Dots />
          <Tags />
          {STILLS.map((_, i) => {
            const panel = Panel({ i });
            return panel ? (
              <div key={i} className={s.panel} data-panel={i} data-active={i === active ? 'true' : undefined} aria-hidden={i === active ? undefined : true}>
                {panel}
              </div>
            ) : null;
          })}
        </div>

        {!enhanced && (
          <ol className={s.stills} aria-label={SHADES.name}>
            {STILLS.map((_, i) => (
              <li key={i} className={s.still}>
                {/* The hero copy (the page's one h1) is the first caption above, shown in both layouts. */}
                {i > 0 ? <Copy i={i} /> : null}
                <Still i={i} />
                <Panel i={i} />
              </li>
            ))}
          </ol>
        )}

        <div className={s.bar}>
          <nav className={s.tracker} aria-label={SHADES.name}>
            {stages.map((x, n) => (
              <button key={x.id} type="button" className={s.step} aria-current={n + 1 === active ? 'step' : undefined} onClick={() => jumpTo(n + 1)} disabled={!enhanced}>
                <span className={s.stepDot} aria-hidden="true" />
                <span className={s.stepName}>{x.label}</span>
              </button>
            ))}
          </nav>
          <div className={s.colours} role="group" aria-label={`${WORD_COLOURS[0]} / ${WORD_COLOURS[1]}`}>
            {WORD_COLOURS.map((c, n) => (
              <button key={c} type="button" className={s.colour} aria-pressed={white === (n === 1)} aria-label={c} onClick={() => setWhite(n === 1)} disabled={!enhanced}>
                <span className={s.colourChip} style={{ background: c }} aria-hidden="true" />
                <span className={s.colourHex} aria-hidden="true">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <p className={s.concept}>
          <strong>{LABEL.tag}</strong>
          {LABEL.disclosure}
        </p>
      </div>
    </section>
  );
}
