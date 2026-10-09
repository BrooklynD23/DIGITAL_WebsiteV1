'use client';

/**
 * Apple world · phone hero: one pinned section, ONE artwork, four poses (Plan → Prototype → Test → Integrate).
 * Scroll only picks the target stage (useScrollSteps); useStagePlayback tweens a playhead to it and every playhead
 * update lerps between the two neighbouring POSES and writes transform / opacity / strokeDashoffset to the DOM.
 * First viewport: thesis + lead above the Plan sheet; the first scroll plays thesis out → sheet up → heading in
 * (timed and staggered in hero.module.css, never scrubbed, so it cannot rest half-way; reversed on the way back).
 * Each stage has its own heading in the lower band; headings swap out-then-in (never two at once).
 *
 * Reduced motion / no JS: the thesis, then four stills with their headings (full parity, no pin).
 * `?heroDebug=1` shows a playhead / target readout.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { animate, stagger } from 'animejs';
import { useScrollSteps } from '../../_system';
import { hero, stages, thesis } from '../../_content/home';
import h from '../_home/home.module.css';
import { PART_IDS, STAGE_ORDER, type CameraPose, type PartId } from './contract';
import { PhoneArtwork, partTransform, rigTransform } from './PhoneArtwork';
import { NARROW_CAMERA, POSES } from './poses';
import { useStagePlayback } from './useStagePlayback';
import s from './hero.module.css';

const STEPS = { count: stages.length, lead: 0.12, playShare: 0.72 } as const;
const HERO_OUT = 0.015; // the first real scroll leaves the thesis
const LAST = STAGE_ORDER.length - 1;

interface PartEls {
  readonly id: PartId;
  readonly el: SVGElement;
  readonly plan: readonly SVGElement[];
  readonly build: readonly SVGElement[];
  readonly draw: readonly SVGElement[];
}
interface Els {
  readonly rig: SVGElement | null;
  readonly parts: readonly PartEls[];
}

const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
const unit = (x: number): number => Math.min(1, Math.max(0, x));
const cam = (a: CameraPose, b: CameraPose, t: number, tf: number): string =>
  rigTransform({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), s: mix(a.s, b.s, t), flat: mix(a.flat ?? 0, b.flat ?? 0, tf) });
const all = (root: Element, sel: string): SVGElement[] => Array.from(root.querySelectorAll<SVGElement>(sel));

function collect(root: Element): Els {
  const parts = PART_IDS.flatMap((id): PartEls[] => {
    const el = root.querySelector<SVGElement>(`[data-part="${id}"]`);
    return el ? [{ id, el, plan: all(el, '[data-layer="plan"]'), build: all(el, '[data-layer="build"]'), draw: all(el, 'path[data-draw]') }] : [];
  });
  return { rig: root.querySelector<SVGElement>('[data-rig]'), parts };
}

/** Playhead (float stage index) → DOM. Linear in pos: the playhead tween supplies the easing. */
function applyPose(els: Els, pos: number): void {
  const i = Math.min(LAST, Math.max(0, Math.floor(pos)));
  const t = Math.min(1, Math.max(0, pos - i));
  const ia = STAGE_ORDER[i];
  const ib = STAGE_ORDER[Math.min(LAST, i + 1)];
  const A = POSES[ia];
  const B = POSES[ib];
  // Plan → Prototype is two beats: the sheet tilts into isometric first, then the parts lift off it.
  const tf = i === 0 ? unit(t / 0.6) : t;
  const tp = i === 0 ? unit((t - 0.3) / 0.7) : t;
  if (els.rig) {
    // both cameras every frame; CSS picks one by breakpoint (no layout or media reads here)
    els.rig.style.setProperty('--rig-d', cam(A.camera, B.camera, t, tf));
    els.rig.style.setProperty('--rig-n', cam(NARROW_CAMERA[ia], NARROW_CAMERA[ib], t, tf));
  }
  for (const p of els.parts) {
    const a = A.parts[p.id];
    const b = B.parts[p.id];
    const t = p.id === 'sheet' ? tf : tp;
    const pose = { x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), o: mix(a.o, b.o, t), plan: mix(a.plan, b.plan, t), build: mix(a.build, b.build, t) };
    p.el.style.transform = partTransform(pose);
    p.el.style.opacity = String(pose.o);
    for (const l of p.plan) l.style.opacity = String(pose.plan);
    for (const l of p.build) l.style.opacity = String(pose.build);
    for (const d of p.draw) d.style.strokeDashoffset = String(1 - mix(a.draw ?? 0, b.draw ?? 0, t));
  }
}

export function HeroStages() {
  const section = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const els = useRef<Els | null>(null);
  const readout = useRef<HTMLOutputElement>(null);
  const phase = useRef<'hero' | 'stages'>('hero');
  const [debug, setDebug] = useState(false);

  const onFrame = useCallback((p: number) => {
    const next = p > HERO_OUT ? 'stages' : 'hero';
    if (next !== phase.current && section.current) {
      phase.current = next;
      section.current.dataset.phase = next;
    }
  }, []);
  const { enhanced, active, jumpTo } = useScrollSteps(section, { ...STEPS, onFrame });

  const head = useStagePlayback(active, STEPS.count, 1200, (pos) => {
    if (els.current) applyPose(els.current, pos);
    if (readout.current) readout.current.textContent = `playhead ${pos.toFixed(3)} → target ${active}`;
  });
  useEffect(() => {
    if (readout.current) readout.current.textContent = `playhead ${head.current.pos.toFixed(3)} → target ${active}`;
  }, [debug, active, head]);

  // First viewport: the artwork starts exactly below the thesis block, whatever it wraps to.
  useEffect(() => {
    const t = text.current;
    const host = section.current;
    if (!enhanced || !t || !host) return undefined;
    const ro = new ResizeObserver(() => host.style.setProperty('--text-b', `${t.offsetTop + t.offsetHeight}px`));
    ro.observe(t);
    return () => ro.disconnect();
  }, [enhanced]);

  // Plan draft-in, once, when the enhanced hero mounts at rest on Plan (SSR already painted the Plan pose).
  useEffect(() => {
    if (!enhanced || !art.current) return undefined;
    const found = collect(art.current);
    els.current = found;
    setDebug(new URLSearchParams(window.location.search).get('heroDebug') === '1');
    if (head.current.pos !== 0) return undefined;
    const settle = (): void => applyPose(found, head.current.pos); // a scroll during the draft-in wins
    const intro = animate(found.parts.map((p) => p.el), { opacity: { from: 0 }, duration: 300, delay: stagger(25), ease: 'out(3)', onComplete: settle });
    return () => {
      intro.cancel();
      settle();
    };
  }, [enhanced, head]);

  return (
    <section ref={section} id="stages" data-tone="dark" className={s.pin} style={{ '--steps': STEPS.count } as CSSProperties} data-phase="hero" aria-labelledby="hero-title">
      <div className={s.pinSticky}>
        <div ref={text} className={s.heroText}>
          <h1 id="hero-title" className={s.heroTitle}>{thesis}</h1>
          <p className={s.heroLead}>{hero.lead}</p>
        </div>

        <div ref={art} className={s.art}>
          <PhoneArtwork className={s.svg} />
        </div>
        <div className={s.captions}>
          {stages.map((x, i) => (
            <div key={x.id} className={s.caption} data-active={i === active ? 'true' : undefined} aria-hidden={i === active ? undefined : true}>
              <h2 className={s.heading}>{x.heading}</h2>
              <p className={s.rule}>{x.rule}</p>
            </div>
          ))}
        </div>
        <nav className={h.tracker} aria-label="Build stages">
          {stages.map((x, i) => (
            <button key={x.id} type="button" className={h.trackerBtn} aria-current={i === active ? 'step' : undefined} onClick={() => jumpTo(i)} disabled={!enhanced}>
              <span className={h.trackerDot} aria-hidden="true" />
              <span>{x.name}</span>
            </button>
          ))}
        </nav>

        {!enhanced && (
          <ol className={s.stills} aria-label="The four build stages">
            {stages.map((x) => (
              <li key={x.id} className={s.still}>
                <PhoneArtwork stage={x.id} className={s.svg} />
                <h2 className={s.heading}>{x.heading}</h2>
                <p className={s.rule}>{x.rule}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
      {debug && <output ref={readout} className={s.debug} />}
    </section>
  );
}
