'use client';

/** BRAIN demos, part B: context (window + engineering merged), harness (+ subagent coda), evals. */
import { forwardRef, useCallback, useImperativeHandle, useRef, useState, type ForwardedRef, type KeyboardEvent, type PointerEvent } from 'react';
import { CineClip, markerIndex, type CineClipHandle } from '../_system/cine';
import { EVALS, STRATEGIES, chapterById, coda, type StrategyId } from '../_content/brain';
import { DemoShell, Icon, Tag, useDiscrete, useEntryPlay, type World } from './DemoShell';
import { SceneStage, type SceneHandle } from './SceneStage';
import { pct } from './kit';
import {
  DECIDE_MS,
  DOC,
  DOC_AT,
  ENG_MS,
  FULL,
  HARNESS_MS,
  HARNESS_TOOLS,
  NOTES_AT,
  OUTCOMES,
  PINNED,
  SLOTS,
  SUB_MS,
  editOutcome,
  engFill,
  engineeringScene,
  evalDuration,
  evalsScene,
  harnessScene,
  subagentsScene,
  type Decision,
  type EngPhase,
} from './scenes-b';
import s from './demo.module.css';

const pctOf = (filled: number): number => Math.round((filled / SLOTS) * 100);

/* ------------------------------------------------------------------ ch4 context (signature) */

/** Scroll drive for the window fill (Signal: the page's one scrubbed beat). */
export interface ContextDrive {
  setFill(p: number): void;
}

const WINDOW_RIGHT = 0.48; // normalised x of the window's right edge (drop target)

/**
 * The merged Context chapter. Signal: the pin scrubs the fill to 95% (`drive.setFill`), then the document card
 * and the three strategies arrive. Apple: the brain-context clip is the scrubbed asset (ContextClip); this
 * demo follows it, already full.
 */
function ContextDemoInner({ world, scrubbed = false }: { readonly world: World; readonly scrubbed?: boolean }, ref: ForwardedRef<ContextDrive>) {
  const ch = chapterById('context');
  const stage = useRef<SceneHandle>(null);
  const screen = useRef<HTMLDivElement>(null);
  const drag = useRef({ id: -1, x: 0, y: 0, moved: false, dropped: false });
  const fill = useRef(1);
  const [phase, setPhase] = useState<EngPhase>('full');
  const [fillPct, setFillPct] = useState(pctOf(FULL));
  const trackFill = useDiscrete<number>(setFillPct);
  useImperativeHandle(
    ref,
    () => ({
      setFill(p) {
        fill.current = Math.min(1, Math.max(0, p));
        trackFill(pctOf(PINNED + (FULL - PINNED) * fill.current));
        stage.current?.setT(1);
      },
    }),
    [trackFill],
  );
  const draw = useCallback((t: number, sz: number) => engineeringScene(t, sz, phase === 'waiting' ? 'full' : phase, fill.current), [phase]);
  const free = SLOTS - FULL;
  const ready = !scrubbed || fillPct >= pctOf(FULL);
  const add = () => {
    if (phase !== 'full') return;
    // adding before the scroll has finished filling jumps the window to full first
    if (!ready) {
      fill.current = 1;
      setFillPct(pctOf(FULL));
    }
    setPhase('waiting');
  };
  const choose = (id: StrategyId) => {
    if (phase !== 'waiting') return;
    setPhase(id);
    stage.current?.play(ENG_MS);
  };
  const reset = () => {
    setPhase('full');
    stage.current?.finish();
  };
  const onDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (phase !== 'full') return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, dropped: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 6) d.moved = true;
    e.currentTarget.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  };
  const onUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    d.id = -1;
    e.currentTarget.style.transform = '';
    if (!d.moved) return; // a click: onClick adds
    d.dropped = true;
    const box = screen.current?.getBoundingClientRect();
    if (!box) return;
    const nx = (((e.clientX - box.left) / box.width) * 2 - 1) / 0.92;
    if (nx < WINDOW_RIGHT) add();
  };
  const onClick = () => {
    if (drag.current.dropped) {
      drag.current.dropped = false;
      return;
    }
    add();
  };
  const settled = phase === 'full' || phase === 'waiting';
  const shown = settled ? fillPct : pctOf(engFill(phase));
  const strategy = STRATEGIES.find((x) => x.id === phase);
  const text =
    phase === 'full'
      ? ready
        ? `${shown}% full. Drag the document in.`
        : `Filling: ${shown}% full.`
      : phase === 'waiting'
        ? `Needs ${DOC} slots, ${free} free. Choose.`
        : `${strategy?.result ?? ''} ${shown}% full.`;
  const state = phase === 'full' ? `${shown}% FULL` : phase === 'waiting' ? `NEEDS ${DOC}` : phase === 'evict' ? 'EVICTED' : phase === 'compact' ? 'COMPACTED' : 'POINTER IN';
  return (
    <DemoShell
      world={world}
      ch={ch}
      corner={`${shown}% FULL`}
      readout={{ tag: 'WINDOW', state, text }}
      stage={
        <div ref={screen} className={s.dropZone}>
          <SceneStage ref={stage} draw={draw} maxSize={520} label={`Context window, illustrative: ${text}`} />
        </div>
      }
      overlay={
        <>
          {settled ? (
            <button
              type="button"
              className={s.docCard}
              data-state={phase}
              data-late=""
              style={{ left: phase === 'waiting' ? pct(WINDOW_RIGHT - 0.02) : pct(DOC_AT[0]), top: pct(DOC_AT[1]) }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onClick={onClick}
              aria-disabled={phase === 'waiting'}
              aria-label={phase === 'waiting' ? `Document waiting: needs ${DOC} slots` : `Add document to the window (${DOC} slots)`}
            >
              <svg viewBox="0 0 36 24" width="54" height="36" aria-hidden="true">
                {Array.from({ length: DOC }, (_, n) => (
                  <circle key={n} cx={4 + (n % 6) * 5.6} cy={4 + Math.floor(n / 6) * 5.4} r="1.6" />
                ))}
              </svg>
              <span>document</span>
            </button>
          ) : null}
          <Tag x={NOTES_AT[0]} y={NOTES_AT[1] + 0.22} align="center">
            notes
          </Tag>
          <Tag x={-0.88} y={-0.8}>
            pinned
          </Tag>
        </>
      }
      controlsLabel="Choose what gives"
      controls={
        <>
          <div className={s.segmented} role="group" aria-label="Strategy">
            {STRATEGIES.map((x) => (
              <button key={x.id} type="button" className={s.seg} aria-pressed={phase === x.id} aria-disabled={phase !== 'waiting'} onClick={() => choose(x.id)}>
                {x.label}
              </button>
            ))}
          </div>
          {!settled ? (
            <button type="button" className={s.ghost} onClick={reset}>
              <Icon name="replay" />
              Refill
            </button>
          ) : null}
        </>
      }
    />
  );
}

export const ContextDemo = forwardRef(ContextDemoInner);
ContextDemo.displayName = 'ContextDemo';

/** Apple: the brain-context clip scrubbed through its pin; the readout follows the clip's own markers. */
const CLIP_STATES = ['Empty', 'Filling', '95% full', 'Oldest evicted', 'Compacting', 'Summary kept'] as const;

export interface ClipDrive {
  setProgress(p: number): void;
}

function ContextClipInner(_props: { readonly label?: string }, ref: ForwardedRef<ClipDrive>) {
  const clip = useRef<CineClipHandle>(null);
  const [i, setI] = useState(CLIP_STATES.length - 1);
  const track = useDiscrete<number>(setI);
  useImperativeHandle(
    ref,
    () => ({
      setProgress(p) {
        clip.current?.setProgress(p);
        track(Math.max(0, markerIndex('brain-context', p)));
      },
    }),
    [track],
  );
  return (
    <figure className={s.demo} data-world="apple" data-chapter="context-clip">
      <div className={s.screen}>
        <div className={s.clipBox}>
          <CineClip
            ref={clip}
            name="brain-context"
            world="apple"
            mode="scrub"
            label="Illustrative: a fixed-slot window fills, evicts its oldest slots, then compacts history into a summary."
          />
        </div>
        <p className={s.illus}>Illustrative: slots</p>
        <p className={s.readout} aria-live="polite">
          {CLIP_STATES[i]}
        </p>
      </div>
    </figure>
  );
}

export const ContextClip = forwardRef(ContextClipInner);
ContextClip.displayName = 'ContextClip';

/* ------------------------------------------------------------------ ch5 harness (signature) */

export function HarnessDemo({ world }: { readonly world: World }) {
  const ch = chapterById('harness');
  const stage = useRef<SceneHandle>(null);
  const host = useRef<HTMLDivElement>(null);
  const [decision, setDecision] = useState<Decision>('pending');
  const [beat, setBeat] = useState<'entry' | 'decide'>('entry');
  const [held, setHeld] = useState(true);
  const entry = useCallback(() => {
    setHeld(false);
    stage.current?.play(HARNESS_MS);
  }, []);
  useEntryPlay(host, entry);
  const decide = (d: 'approved' | 'denied') => {
    if (decision !== 'pending' || !held) return;
    setDecision(d);
    setBeat('decide');
    stage.current?.play(DECIDE_MS);
  };
  const again = () => {
    setDecision('pending');
    setBeat('entry');
    entry();
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      decide('approved');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      decide('denied');
    }
  };
  const draw = useCallback((t: number, sz: number) => harnessScene(t, sz, decision, beat, true), [decision, beat]);
  const pending = editOutcome(decision) === 'hold';
  const state = !held && beat === 'entry' ? 'ROUTING' : pending ? 'PENDING' : decision === 'approved' ? 'APPROVED' : 'DENIED';
  const text =
    state === 'ROUTING'
      ? 'Read and Grep pass. Edit approaches.'
      : state === 'PENDING'
        ? 'Edit waits. Enter approves, Esc denies.'
        : state === 'APPROVED'
          ? 'Approved: Edit runs.'
          : 'Denied: the refusal returns as the result.';
  return (
    <div ref={host}>
      <DemoShell
        world={world}
        ch={ch}
        corner="MODE DEFAULT"
        readout={{ tag: 'EDIT', state, text }}
        stage={<SceneStage ref={stage} draw={draw} maxSize={480} label={`Harness gate: ${text}`} onDone={() => setHeld(true)} />}
        overlay={
          <>
            {HARNESS_TOOLS.map((tl) => (
              <Tag key={tl.name} x={tl.at[0]} y={tl.at[1] + 0.13} align="center">
                {tl.name}
              </Tag>
            ))}
            <Tag x={0.2} y={-0.22} align="center">
              gate
            </Tag>
            <Tag x={-0.9} y={-0.58}>
              turns · budget
            </Tag>
          </>
        }
        controlsLabel="Permission callback"
        controls={
          <div
            className={s.gate}
            tabIndex={0}
            role="group"
            aria-label="Pending Edit call. Enter approves, Escape denies."
            data-pending={pending && held ? 'true' : undefined}
            onKeyDown={onKey}
          >
            <button type="button" className={s.approve} disabled={!(pending && held)} onClick={() => decide('approved')}>
              <Icon name="check" />
              Approve <kbd>Enter</kbd>
            </button>
            <button type="button" className={s.deny} disabled={!(pending && held)} onClick={() => decide('denied')}>
              <Icon name="cross" />
              Deny <kbd>Esc</kbd>
            </button>
            {!pending && held ? (
              <button type="button" className={s.ghost} onClick={again}>
                <Icon name="replay" />
                Again
              </button>
            ) : null}
          </div>
        }
      />
    </div>
  );
}

/** Harness coda (the old subagents chapter, cut to one beat): plays once on entry, no control. */
export function SubagentsCoda({ world }: { readonly world: World }) {
  const stage = useRef<SceneHandle>(null);
  const host = useRef<HTMLDivElement>(null);
  useEntryPlay(host, () => stage.current?.play(SUB_MS));
  const draw = useCallback((t: number, sz: number) => subagentsScene(t, sz, 'sub'), []);
  return (
    <div ref={host} className={s.coda} data-world={world}>
      <div className={s.codaStage}>
        <SceneStage ref={stage} draw={draw} maxSize={420} label="Illustrative: the parent buds three helpers with clean windows; each returns one summary dot." />
        <Tag x={-0.84} y={0.86} align="center">
          parent window
        </Tag>
      </div>
      <p className={s.illus}>{world === 'signal' ? `${coda.illus.toUpperCase()} · METER` : 'Illustrative: meter'}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ ch6 evals */

const fmt = (v: number): string => `${(v * 100).toFixed(v > 0.999 || v < 0.01 ? 2 : 1)}%`;

export function EvalsDemo({ world }: { readonly world: World }) {
  const ch = chapterById('evals');
  const stage = useRef<SceneHandle>(null);
  const host = useRef<HTMLDivElement>(null);
  const [k, setK] = useState<number>(EVALS.kInitial);
  useEntryPlay(host, () => stage.current?.play(evalDuration(EVALS.kInitial)));
  const change = (v: number) => {
    setK(v);
    stage.current?.play(evalDuration(v));
  };
  const draw = useCallback((t: number, sz: number) => evalsScene(t, sz, k), [k]);
  const at = 1 - (1 - EVALS.p) ** k;
  const all = EVALS.p ** k;
  const passed = OUTCOMES.slice(0, k).filter((o) => o === 1).length;
  const text = `This run: ${passed} of ${k} passed.`;
  const kid = `k-${world}`;
  return (
    <div ref={host}>
      <DemoShell
        world={world}
        ch={ch}
        corner={`K=${String(k).padStart(2, '0')} · ${passed}/${k} PASS`}
        readout={{ tag: `K=${String(k).padStart(2, '0')}`, state: `${passed}/${k} PASS`, text }}
        stage={<SceneStage ref={stage} draw={draw} maxSize={480} label={`Evals, k = ${k}: pass@k ${fmt(at)}, pass^k ${fmt(all)}. ${text}`} />}
        overlay={
          <Tag x={0} y={0.86} align="center">
            solid = pass · dashed = fail
          </Tag>
        }
        controlsLabel="Trials"
        controls={
          <div className={s.slider}>
            <label className={s.valueLabel} htmlFor={kid}>
              trials k
            </label>
            <input id={kid} type="range" min={EVALS.kMin} max={EVALS.kMax} step={1} value={k} onChange={(e) => change(Number(e.target.value))} />
            <output className={s.value} htmlFor={kid}>
              {k}
            </output>
          </div>
        }
        after={
          <dl className={s.compare}>
            <div data-on="true">
              <dt>pass@k</dt>
              <dd>{fmt(at)}</dd>
            </div>
            <div data-on="true">
              <dt>pass^k</dt>
              <dd>{fmt(all)}</dd>
            </div>
          </dl>
        }
      />
    </div>
  );
}
