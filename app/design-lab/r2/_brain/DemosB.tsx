'use client';

/** BRAIN demos, part B: context window (scrubbed), context engineering, harness, subagents, evals. */
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import { CINE, CineClip } from '../_system/cine';
import { useScrollProgress } from '../_system';
import { EVALS, MODES, STRATEGIES, chapterById, type ModeId, type StrategyId } from '../_content/brain';
import { DemoShell, Icon, Segmented, Tag, useDiscrete, useEntryPlay, type World } from './DemoShell';
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
  METER,
  NOTES_AT,
  OUTCOMES,
  SLOTS,
  SUB_MS,
  TURNS,
  contextScene,
  editOutcome,
  engFill,
  engineeringScene,
  evalDuration,
  evalsScene,
  filledAt,
  harnessScene,
  slotTurn,
  subFill,
  subagentsScene,
  type Decision,
  type EngPhase,
  type SubMode,
} from './scenes-b';
import s from './demo.module.css';

const pctOf = (filled: number): number => Math.round((filled / SLOTS) * 100);

/* ------------------------------------------------------------------ ch4 context window (the scrubbed beat) */

/**
 * Scroll through the pinned host scrubs six turns into the window. Apple world: the brain-context clip
 * is the scrubbed asset when it is rendered; until then this stage is its fallback and scrubs instead.
 */
export function ContextDemo({ world, host }: { readonly world: World; readonly host: RefObject<HTMLElement> }) {
  const ch = chapterById('context');
  const stage = useRef<SceneHandle>(null);
  const [key, setKey] = useState(`${pctOf(FULL)}|${TURNS.length}`);
  const [clipP, setClipP] = useState(1);
  const track = useDiscrete<string>(setKey);
  const clip = world === 'apple' && CINE['brain-context'].ready;
  const onProgress = useCallback(
    (p: number) => {
      stage.current?.setT(p);
      const filled = Math.floor(filledAt(p));
      track(`${pctOf(filled)}|${slotTurn(Math.max(0, filled - 1))}`);
      if (clip) setClipP(p);
    },
    [clip, track],
  );
  useScrollProgress(host, { range: 'contain', onProgress, cssVar: false });
  const draw = useCallback((t: number, sz: number) => contextScene(t, sz), []);
  const [full, turn] = key.split('|').map(Number);
  const text = turn === 0 ? `Pinned rows only: ${full}% full.` : `Turn ${turn} of ${TURNS.length}: ${full}% full.`;
  const sceneStage = <SceneStage ref={stage} draw={draw} maxSize={520} label={`Context window, illustrative: ${text}`} />;
  return (
    <DemoShell
      world={world}
      ch={ch}
      corner={`TURN ${String(turn).padStart(2, '0')}/0${TURNS.length}`}
      readout={{ tag: 'WINDOW', state: `${full}% FULL`, text }}
      stage={
        clip ? <CineClip name="brain-context" mode="scrub" progress={clipP} fallback={sceneStage} label={`Context window, illustrative: ${text}`} /> : sceneStage
      }
      overlay={
        <>
          <Tag x={-0.83} y={-0.75}>pinned: system prompt + tools</Tag>
          <Tag x={0.83} y={0.79} align="end">illustrative</Tag>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------ ch5 context engineering (signature) */

const WINDOW_RIGHT = 0.48; // normalised x of the window's right edge (drop target)

export function EngineeringDemo({ world }: { readonly world: World }) {
  const ch = chapterById('engineering');
  const stage = useRef<SceneHandle>(null);
  const screen = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLButtonElement>(null);
  const drag = useRef({ id: -1, x: 0, y: 0, moved: false, dropped: false });
  const [phase, setPhase] = useState<EngPhase>('full');
  const draw = useCallback((t: number, sz: number) => engineeringScene(t, sz, phase === 'waiting' ? 'full' : phase), [phase]);
  const free = SLOTS - FULL;
  const add = () => {
    if (phase !== 'full') return;
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
  // drag the card onto the window (pointer); click / Enter / Space do the same
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
    const el = e.currentTarget;
    el.style.transform = '';
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
  const filled = engFill(phase);
  const strategy = STRATEGIES.find((x) => x.id === phase);
  const text =
    phase === 'full'
      ? `${pctOf(FULL)}% full. Drag the document in.`
      : phase === 'waiting'
        ? `Needs ${DOC} slots, ${free} free. Choose.`
        : `${strategy?.result ?? ''} ${pctOf(filled)}% full.`;
  const state =
    phase === 'full' ? 'DOC OUTSIDE' : phase === 'waiting' ? `NEEDS ${DOC} · ${free} FREE` : phase === 'evict' ? 'EVICTED TURN 1' : phase === 'compact' ? 'COMPACTED' : 'POINTER LOADED';
  return (
    <DemoShell
      world={world}
      ch={ch}
      corner={`${pctOf(filled)}% FULL`}
      readout={{ tag: `WINDOW ${pctOf(filled)}%`, state, text }}
      stage={
        <div ref={screen} className={s.dropZone} data-waiting={phase === 'waiting' ? 'true' : undefined}>
          <SceneStage ref={stage} draw={draw} maxSize={520} label={`Context engineering, illustrative: ${text}`} />
        </div>
      }
      overlay={
        <>
          {phase === 'full' || phase === 'waiting' ? (
            <button
              ref={card}
              type="button"
              className={s.docCard}
              data-state={phase}
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
          <Tag x={NOTES_AT[0]} y={NOTES_AT[1] + 0.22} align="center">notes</Tag>
          <Tag x={-0.88} y={-0.8}>pinned</Tag>
        </>
      }
      controlsLabel="Choose a strategy"
      controls={
        <>
          <div className={s.segmented} role="group" aria-label="Strategy">
            {STRATEGIES.map((x) => (
              <button
                key={x.id}
                type="button"
                className={s.seg}
                aria-pressed={phase === x.id}
                aria-disabled={phase !== 'waiting'}
                onClick={() => choose(x.id)}
              >
                {x.label}
              </button>
            ))}
          </div>
          {phase !== 'full' && phase !== 'waiting' ? (
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

/* ------------------------------------------------------------------ ch6 harness (signature) */

export function HarnessDemo({ world }: { readonly world: World }) {
  const ch = chapterById('harness');
  const stage = useRef<SceneHandle>(null);
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ModeId>('default');
  const [decision, setDecision] = useState<Decision>('pending');
  const [beat, setBeat] = useState<'entry' | 'decide'>('entry');
  const [held, setHeld] = useState(true);
  const entry = useCallback(() => {
    setHeld(false);
    stage.current?.play(HARNESS_MS);
  }, []);
  useEntryPlay(host, entry);
  const pickMode = (m: ModeId) => {
    setMode(m);
    setDecision('pending');
    setBeat('entry');
    entry();
  };
  const decide = (d: 'approved' | 'denied') => {
    if (mode !== 'default' || decision !== 'pending' || !held) return;
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
  const draw = useCallback(
    (t: number, sz: number) => harnessScene(t, sz, mode, decision, beat, world === 'apple'),
    [mode, decision, beat, world],
  );
  const out = editOutcome(mode, decision);
  const pending = out === 'hold';
  const state = !held && beat === 'entry' ? 'ROUTING' : pending ? 'PENDING' : mode === 'acceptEdits' ? 'AUTO-APPROVED' : mode === 'plan' ? 'BLOCKED' : decision === 'approved' ? 'APPROVED' : 'DENIED';
  const text =
    state === 'ROUTING'
      ? 'Read and Grep pass. Edit approaches.'
      : state === 'PENDING'
        ? 'Edit waits. Enter approves, Esc denies.'
        : state === 'APPROVED'
          ? 'Approved: Edit runs.'
          : state === 'DENIED'
            ? 'Denied: the refusal returns as the result.'
            : state === 'AUTO-APPROVED'
              ? 'acceptEdits: Edit runs unasked.'
              : 'plan: Edit blocked and returned.';
  return (
    <div ref={host}>
      <DemoShell
        world={world}
        ch={ch}
        corner={`MODE ${mode.toUpperCase()}`}
        readout={{ tag: 'TOOL CALL', state, text }}
        stage={
          <SceneStage
            ref={stage}
            draw={draw}
            maxSize={480}
            label={`Harness gate: ${text}`}
            onDone={() => setHeld(true)}
          />
        }
        overlay={
          <>
            {HARNESS_TOOLS.map((tl) => (
              <Tag key={tl.name} x={tl.at[0]} y={tl.at[1] + 0.13} align="center">
                {tl.name}
              </Tag>
            ))}
            <Tag x={0.2} y={-0.22} align="center">gate</Tag>
            <Tag x={-0.9} y={-0.58}>turns · budget</Tag>
          </>
        }
        controlsLabel="Permission"
        controls={
          <>
            <Segmented label="Permission mode" options={MODES} value={mode} onChange={pickMode} />
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
          </>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ ch7 subagents */

const SUB_MODES: ReadonlyArray<{ readonly id: SubMode; readonly label: string }> = [
  { id: 'one', label: 'One window' },
  { id: 'sub', label: 'Subagents' },
];

export function SubagentsDemo({ world }: { readonly world: World }) {
  const ch = chapterById('subagents');
  const stage = useRef<SceneHandle>(null);
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<SubMode>('sub');
  useEntryPlay(host, () => stage.current?.play(SUB_MS));
  const pick = (m: SubMode) => {
    setMode(m);
    stage.current?.play(SUB_MS);
  };
  const draw = useCallback((t: number, sz: number) => subagentsScene(t, sz, mode), [mode]);
  const one = Math.round((subFill('one') / METER.n) * 100);
  const sub = Math.round((subFill('sub') / METER.n) * 100);
  const now = mode === 'one' ? one : sub;
  const text = `Parent window: ${now}% full.`;
  return (
    <div ref={host}>
      <DemoShell
        world={world}
        ch={ch}
        corner={`PARENT ${now}%`}
        readout={{ tag: mode === 'one' ? 'ONE WINDOW' : 'SUBAGENTS ×3', state: `PARENT ${now}% FULL`, text }}
        stage={<SceneStage ref={stage} draw={draw} maxSize={480} label={`Subagents, illustrative: ${text}`} />}
        overlay={
          <>
            <Tag x={-0.84} y={0.86} align="center">parent window</Tag>
            <Tag x={-0.18} y={0.36} align="center">parent</Tag>
          </>
        }
        controls={<Segmented label="Compare" options={SUB_MODES} value={mode} onChange={pick} />}
        after={
          <dl className={s.compare}>
            <div data-on={mode === 'one' ? 'true' : undefined}>
              <dt>One window</dt>
              <dd>{one}%</dd>
            </div>
            <div data-on={mode === 'sub' ? 'true' : undefined}>
              <dt>Subagents</dt>
              <dd>{sub}%</dd>
            </div>
          </dl>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ ch8 evals */

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
  return (
    <div ref={host}>
      <DemoShell
        world={world}
        ch={ch}
        corner={`K=${String(k).padStart(2, '0')} · ${passed}/${k} PASS`}
        readout={{ tag: `EVAL K=${String(k).padStart(2, '0')}`, state: `PASS@K ${fmt(at)} · PASS^K ${fmt(all)}`, text }}
        stage={<SceneStage ref={stage} draw={draw} maxSize={480} label={`Evals, k = ${k}: pass@k ${fmt(at)}, pass^k ${fmt(all)}. ${text}`} />}
        overlay={<Tag x={0} y={0.86} align="center">solid = passed · dashed = failed</Tag>}
        controlsLabel="Trials"
        controls={
          <label className={s.slider}>
            <span className={s.valueLabel}>trials k</span>
            <input type="range" min={EVALS.kMin} max={EVALS.kMax} step={1} value={k} onChange={(e) => change(Number(e.target.value))} />
            <output className={s.value}>{k}</output>
          </label>
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
