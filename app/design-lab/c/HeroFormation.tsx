'use client';

/**
 * Concept C — the formation hero.
 *
 * Progressive enhancement, in layers:
 * 1. Server HTML: headline, radio list, captions and an SVG dot poster of the
 *    selected build. Radio → poster/caption swaps work with CSS :has() alone.
 * 2. Hydrated: subsystem legend, RSVP stream in the glasses' HUD, sign-the-line.
 * 3. WebGL (lazy, next/dynamic ssr:false): the same points as live particles.
 *    Skipped for no-WebGL, prefers-reduced-motion, Save-Data, low-power touch
 *    devices, `?fx=off`, or when the visitor picks "Still".
 */
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { ArrowDown, ArrowUpRight, RotateCcw } from 'lucide-react';
import styles from './c.module.css';
import { POSTER_VIEWBOX, SIGN_BASELINE_Y, dotPath, glassesCloud, phoneCloud, signCloud } from './geometry';
import type { LiveInput } from './FormationCanvas';
import { formations, hero, links, meeting, rsvp, subsystems, type FormationKey } from './content';
import { nameToPoints } from './textPoints';

const FormationCanvas = dynamic(() => import('./FormationCanvas'), { ssr: false, loading: () => null });

const KEYS: readonly FormationKey[] = ['phone', 'reading', 'unsigned'];
const ICON = { size: 18, strokeWidth: 1.5, absoluteStrokeWidth: true } as const;
const SIGN_FONT = '"Clash Display", "General Sans", sans-serif';

type Mode = 'pending' | 'live' | 'still';

function hasWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Should the field start live? (WebGL availability is checked separately.) */
function autoLive(): boolean {
  const q = new URLSearchParams(window.location.search).get('fx');
  if (q === 'off') return false;
  if (q === 'on') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const lowPower = (nav.deviceMemory ?? 8) <= 4 || (nav.hardwareConcurrency ?? 8) <= 4;
  return !(coarse && lowPower);
}

export default function HeroFormation() {
  const [formation, setFormation] = useState<FormationKey>('phone');
  const [mode, setMode] = useState<Mode>('pending');
  const [canvasReady, setCanvasReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [dense, setDense] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [pinned, setPinned] = useState(-1);
  const [name, setName] = useState('');
  const [signPoints, setSignPoints] = useState<Float32Array | null>(null);
  const [wordIndex, setWordIndex] = useState(rsvp.words.length - 1);
  const [streamRun, setStreamRun] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const live = useRef<LiveInput>({ px: 0, py: 0, hover: false, explode: 0 });
  const kick = useRef<(() => void) | null>(null);

  const posters = useMemo(() => {
    const phone = phoneCloud();
    const layerPaths = Array.from({ length: 7 }, (_, l) => dotPath(phone.positions, (i) => phone.layers[i] === l, 2));
    return {
      layerPaths,
      glasses: dotPath(glassesCloud().positions, undefined, 3),
      unsigned: dotPath(signCloud(null), undefined, 3),
    };
  }, []);
  const hud = glassesCloud().hud;

  // capability + preference detection (client only)
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    setDense(window.matchMedia('(min-width: 900px)').matches);
    const gl = hasWebGL();
    setWebgl(gl);
    setMode(gl && autoLive() ? 'live' : 'still');
    const onChange = () => {
      setReduced(mq.matches);
      if (mq.matches) setMode('still');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // pause the field when the hero is offscreen
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // scroll spreads the subsystem layers apart as the hero leaves
  useEffect(() => {
    if (mode !== 'live') return;
    const onScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * 0.8)));
      live.current.explode = p * 0.22;
      kick.current?.();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mode]);

  // RSVP stream inside the HUD window, once per selection. In live mode it
  // waits for the glasses to finish forming so the words land in a real lens.
  useEffect(() => {
    if (formation !== 'reading' || reduced || !mounted) return;
    const ms = 60000 / rsvp.wpm;
    let i = 0;
    let interval = 0;
    setWordIndex(-1);
    const start = window.setTimeout(() => {
      setWordIndex(0);
      interval = window.setInterval(() => {
        i += 1;
        if (i >= rsvp.words.length) {
          window.clearInterval(interval);
          return;
        }
        setWordIndex(i);
      }, ms);
    }, mode === 'live' ? 1500 : 200);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [formation, reduced, mounted, streamRun, mode]);

  // sign the line (debounced; waits for the display face)
  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(async () => {
      try {
        await document.fonts?.load(`600 200px ${SIGN_FONT}`);
      } catch {
        /* fall back to whatever face is ready */
      }
      if (!cancelled) setSignPoints(nameToPoints(name, SIGN_FONT));
    }, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [name]);

  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    live.current.px = ((e.clientX - r.left) / r.width - 0.5) * 2.4;
    live.current.py = (0.5 - (e.clientY - r.top) / r.height) * 2.0;
    live.current.hover = true;
    kick.current?.();
  }, []);
  const onPointerLeave = useCallback(() => {
    live.current.hover = false;
    kick.current?.();
  }, []);
  const onReady = useCallback(() => setCanvasReady(true), []);

  const fIndex = KEYS.indexOf(formation) as 0 | 1 | 2;
  const shownLayer = pinned >= 0 ? pinned : highlight;
  const isLive = mode === 'live';
  const active = formations[fIndex];

  return (
    <section ref={sectionRef} className={styles.hero} aria-labelledby="c-hero-title" data-formation={formation}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 id="c-hero-title" className={styles.heroTitle}>
          {hero.title}
        </h1>
        <p className={styles.heroSub}>{hero.sub}</p>
      </div>

      <fieldset className={styles.pick}>
        <legend className={styles.pickLegend}>{hero.pickLegend}</legend>
        {formations.map((f, i) => (
          <label key={f.key} className={styles.pickOpt} data-key={f.key}>
            <input
              type="radio"
              name="c-formation"
              value={f.key}
              className={styles.srOnlyInput}
              defaultChecked={i === 0}
              onChange={() => setFormation(f.key)}
            />
            <span className={styles.pickIdx} aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={styles.pickBody}>
              <span className={styles.pickId}>{f.id}</span>
              <span className={styles.pickTitle}>{f.title}</span>
              <span className={styles.pickLine}>{f.line}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className={styles.heroCta}>
        <a className={styles.btnPrimary} href="#work">
          {hero.cta}
          <ArrowDown {...ICON} aria-hidden />
        </a>
        <p className={styles.meta}>
          <span className={styles.metaDot} aria-hidden />
          Build night · {meeting.short}
        </p>
      </div>

      <div className={styles.heroArt}>
        <div
          ref={stageRef}
          className={styles.stage}
          onPointerMove={isLive ? onPointerMove : undefined}
          onPointerLeave={isLive ? onPointerLeave : undefined}
          data-live={isLive && canvasReady ? 'true' : 'false'}
        >
          <svg
            className={styles.poster}
            viewBox={POSTER_VIEWBOX}
            role="img"
            aria-label={`Dot drawing of ${active.id} ${active.title}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g className={styles.posterPhone} data-poster="phone">
              {posters.layerPaths.map((d, l) => (
                <path
                  key={l}
                  d={d}
                  className={shownLayer === l ? styles.layerOn : shownLayer >= 0 ? styles.layerDim : undefined}
                />
              ))}
            </g>
            <g className={styles.posterReading} data-poster="reading">
              <path d={posters.glasses} />
            </g>
            <g className={styles.posterUnsigned} data-poster="unsigned">
              <path d={posters.unsigned} />
              {name.trim() ? (
                <text x="0" y={-SIGN_BASELINE_Y - 0.06} textAnchor="middle" className={styles.posterName}>
                  {name.trim()}
                </text>
              ) : null}
            </g>
          </svg>

          {isLive ? (
            <FormationCanvas
              formation={fIndex}
              highlight={formation === 'phone' ? shownLayer : -1}
              signPoints={signPoints}
              live={live}
              kick={kick}
              active={inView}
              dense={dense}
              onReady={onReady}
            />
          ) : null}

          <span
            className={styles.hudWord}
            style={{ left: `${hud.left}%`, top: `${hud.top}%` }}
            aria-hidden
          >
            {wordIndex >= 0 ? rsvp.words[wordIndex] : ''}
          </span>
          <span className={styles.signLabel} aria-hidden>
            Built by
          </span>
          {formations.map((f) => (
            <span key={f.key} className={styles.stageTag} data-tag={f.key} aria-hidden>
              {f.id} · {f.key === 'phone' ? `${subsystems.length} layers` : f.key === 'reading' ? 'HUD + FPGA' : 'blank line'}
            </span>
          ))}
        </div>

        <div className={styles.caption}>
          {formations.map((f) => (
            <div key={f.key} className={styles.captionPanel} data-caption={f.key}>
              <dl className={styles.captionFields}>
                <div>
                  <dt>ID</dt>
                  <dd>{f.id}</dd>
                </div>
                {f.fields.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>

              {f.key === 'phone' && mounted ? (
                <div className={styles.legend}>
                  <ul className={styles.legendList} aria-label="Subsystem layers">
                    {subsystems.map((s, i) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          className={styles.legendBtn}
                          aria-pressed={pinned === i}
                          onMouseEnter={() => setHighlight(i)}
                          onMouseLeave={() => setHighlight(-1)}
                          onFocus={() => setHighlight(i)}
                          onBlur={() => setHighlight(-1)}
                          onClick={() => setPinned((p) => (p === i ? -1 : i))}
                        >
                          <span className={styles.legendIdx}>{s.index}</span>
                          {s.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className={styles.legendReadout} aria-live="polite">
                    {shownLayer >= 0
                      ? `${subsystems[shownLayer].title}: ${subsystems[shownLayer].description}`
                      : 'Each layer is one subsystem with one owner. Select a layer.'}
                  </p>
                </div>
              ) : null}

              {f.key === 'reading' && mounted ? (
                <div className={styles.captionRow}>
                  <p className={styles.captionNote}>
                    In the lens: <span className={styles.srOnly}>{rsvp.words.join(' ')}</span>
                    <span aria-hidden>“{rsvp.words.join(' ')}”</span>
                  </p>
                  <button type="button" className={styles.btnGhost} onClick={() => setStreamRun((n) => n + 1)}>
                    <RotateCcw {...ICON} aria-hidden />
                    Replay
                  </button>
                </div>
              ) : null}

              {f.key === 'unsigned' ? (
                <div className={styles.signForm}>
                  {mounted ? (
                    <>
                      <label htmlFor="c-sign" className={styles.signFieldLabel}>
                        Sign the line
                      </label>
                      <input
                        id="c-sign"
                        className={styles.signInput}
                        type="text"
                        autoComplete="off"
                        spellCheck={false}
                        maxLength={22}
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <p className={styles.signHint}>Stays in this tab. Nothing is sent.</p>
                    </>
                  ) : null}
                  <a className={styles.textLink} href={links.projectTeam}>
                    Pitch the next build
                    <ArrowUpRight {...ICON} aria-hidden />
                  </a>
                </div>
              ) : null}
            </div>
          ))}

          {mounted ? (
            <div className={styles.renderToggle}>
              <span className={styles.renderLabel} id="c-render-label">
                Render
              </span>
              <div role="group" aria-labelledby="c-render-label" className={styles.segmented}>
                <button
                  type="button"
                  aria-pressed={isLive}
                  disabled={reduced || !webgl}
                  onClick={() => {
                    setCanvasReady(false);
                    setMode('live');
                  }}
                >
                  Live
                </button>
                <button type="button" aria-pressed={!isLive} onClick={() => setMode('still')}>
                  Still
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
