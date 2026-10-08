'use client';

/**
 * SIDEKICK · the board story: one pinned section, ONE artwork (the real FPGA main board), nine poses.
 * Scroll only picks the target stage (useScrollSteps); useStagePlayback tweens a playhead to it and every playhead
 * update lerps between the two neighbouring poses, writing transform / opacity on whole boxes. The stack separates,
 * then each part group in turn leaves the board in its own colour while the rest dims, then everything returns.
 * The camera (rig scale) is fitted to the room each pose needs, so nothing leaves the pinned stage.
 * Reduced motion / no JS: nine stills with the same copy and parts lists (full parity, no pin).
 */
import { useCallback, useEffect, useRef } from 'react';
import { LINKS } from '../../_chrome';
import { boardStages, mainboard, sidekick, type BoardStage } from '../../_content/sidekick';
import { useScrollSteps } from '../../_system';
import { Mainboard, liftY } from '../../_sidekick/Mainboard';
import { ANCHOR, ELEMENTS, POSES, STAGE_IDS, VIEW_BOX, extent, stateOf } from '../../_sidekick/mainboardPoses';
import s from '../../_sidekick/mainboard.module.css';
import { useStagePlayback } from '../_hero/useStagePlayback';

const STEPS = { count: boardStages.length, playShare: 0.72 } as const;
const LAST = STEPS.count - 1;
const [VX, VY, VW, VH] = VIEW_BOX;
const TAG_W = 96; // px kept free beside the stack for the layer tags
const STATES = STAGE_IDS.map((id) => ELEMENTS.map((el) => stateOf(el, POSES[id])));
const ROOM = STAGE_IDS.map((id) => ({ ...extent(POSES[id]), tags: POSES[id].labels }));
const TAGGED = ELEMENTS.map((el, i) => ({ el, i })).filter((x) => x.el.tag !== undefined);
const GROUP_STAGE = new Set<string>(['compute', 'memory', 'power', 'usb', 'rf', 'io']);
const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

interface Els {
  readonly art: HTMLElement;
  readonly rig: HTMLElement;
  readonly boxes: readonly HTMLElement[];
  readonly tints: readonly (SVGElement | null)[];
  readonly tags: readonly HTMLElement[];
}

/** Playhead (float stage index) → DOM. Linear in pos: the playhead tween supplies the easing. */
function applyPose(els: Els, pos: number): void {
  const i = Math.min(LAST, Math.max(0, Math.floor(pos)));
  const j = Math.min(LAST, i + 1);
  const t = Math.min(1, Math.max(0, pos - i));
  const ys = STATES[i].map((a, k) => {
    const b = STATES[j][k];
    const y = mix(a.y, b.y, t);
    els.boxes[k].style.transform = liftY(y);
    els.boxes[k].style.opacity = mix(a.o, b.o, t).toFixed(3);
    const tint = els.tints[k];
    if (tint) tint.style.opacity = mix(a.tint, b.tint, t).toFixed(3);
    return y;
  });
  const up = mix(ROOM[i].up, ROOM[j].up, t);
  const down = mix(ROOM[i].down, ROOM[j].down, t);
  const tags = mix(ROOM[i].tags, ROOM[j].tags, t);
  const { offsetWidth: aw, offsetHeight: ah } = els.art;
  const { offsetWidth: rw, offsetHeight: rh } = els.rig;
  if (!rw || !rh) return;
  const scale = Math.min(1, ah / ((rh * (VH + up + down)) / VH), (aw - TAG_W * tags) / rw);
  const px = (rw / VW) * scale; // screen px per board mm
  const tx = (-TAG_W * tags) / 2;
  const ty = ((up - down) / 2) * px;
  els.rig.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
  TAGGED.forEach(({ i: k }, n) => {
    const x = aw / 2 + tx + (ANCHOR[0] - VX - VW / 2) * px + 10;
    const y = ah / 2 + ty + (ANCHOR[1] - VY - VH / 2 - ys[k]) * px;
    els.tags[n].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    els.tags[n].style.opacity = Math.max(0, tags * 2 - 1).toFixed(3);
  });
}

function StageCopy({ stage, first, titled = false }: { readonly stage: BoardStage; readonly first: boolean; readonly titled?: boolean }) {
  const H = first ? 'h1' : 'h2';
  const g = GROUP_STAGE.has(stage.id) ? stage.id : undefined;
  return (
    <>
      <p className={s.eyebrow}>
        {g ? <span className={s.swatch} data-g={g} aria-hidden="true" /> : null}
        {first ? `${sidekick.name} · ${mainboard.name}` : stage.label}
      </p>
      <H className={s.heading} id={first && titled ? 'sk-title' : undefined}>{stage.heading}</H>
      <p className={s.line}>{stage.line}</p>
      <ul className={s.rows}>
        {stage.rows.map((r) => (
          <li key={r.ref}>
            <span className={s.ref}>{r.ref}</span>
            <span>
              <span className={s.value}>
                {r.group ? <span className={s.swatch} data-g={r.group} aria-hidden="true" /> : null}
                {r.value}
              </span>
              <span className={s.note}>{r.note}</span>
            </span>
          </li>
        ))}
      </ul>
      {stage.id === 'whole' ? (
        <a className={s.link} href={LINKS.github} target="_blank" rel="noopener noreferrer">
          {mainboard.github}
        </a>
      ) : null}
    </>
  );
}

export function BoardStory() {
  const section = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const els = useRef<Els | null>(null);
  const { enhanced, active, jumpTo } = useScrollSteps(section, STEPS);

  const head = useStagePlayback(active, STEPS.count, 1100, (pos) => {
    if (els.current) applyPose(els.current, pos);
  });
  const settle = useCallback(() => {
    if (els.current) applyPose(els.current, head.current.pos);
  }, [head]);

  useEffect(() => {
    const host = art.current;
    const rig = host?.querySelector<HTMLElement>('[data-mb-rig]');
    if (!enhanced || !host || !rig) return undefined;
    const boxes = Array.from(rig.querySelectorAll<HTMLElement>('[data-mb]'));
    els.current = { art: host, rig, boxes, tints: boxes.map((b) => b.querySelector<SVGElement>('[data-mb-tint]')), tags: Array.from(host.querySelectorAll<HTMLElement>('[data-mb-tag]')) };
    const ro = new ResizeObserver(settle); // also the first fit
    ro.observe(host);
    return () => {
      ro.disconnect();
      els.current = null;
    };
  }, [enhanced, settle]);

  return (
    <section ref={section} id="board" data-tone="dark" className={s.story} aria-labelledby="sk-title">
      <div className={s.sticky}>
        <div ref={art} className={s.art} aria-hidden="true">
          <Mainboard />
          {TAGGED.map(({ el }) => (
            <span key={el.key} className={s.tag} data-mb-tag="" data-core={el.key === 'core' ? '' : undefined}>
              {el.tag || mainboard.coreLabel}
            </span>
          ))}
        </div>
        <div className={s.captions}>
          {boardStages.map((x, i) => (
            <div key={x.id} className={s.caption} data-active={i === active ? 'true' : undefined} aria-hidden={i === active ? undefined : true}>
              <StageCopy stage={x} first={i === 0} titled />
            </div>
          ))}
        </div>
        {!enhanced && (
          <ol className={s.stills} aria-label={mainboard.stagesLabel}>
            {boardStages.map((x, i) => (
              <li key={x.id} className={s.still}>
                <Mainboard stage={x.id} still className={s.stillArt} />
                <StageCopy stage={x} first={i === 0} />
              </li>
            ))}
          </ol>
        )}
        <nav className={s.tracker} aria-label={mainboard.trackerLabel}>
          {boardStages.map((x, i) => (
            <button key={x.id} type="button" className={s.step} data-g={GROUP_STAGE.has(x.id) ? x.id : undefined} aria-current={i === active ? 'step' : undefined} aria-label={x.label} onClick={() => jumpTo(i)} disabled={!enhanced}>
              <span className={s.dot} aria-hidden="true" />
              <span className={s.stepLabel} aria-hidden="true">{x.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
