'use client';

/** BRAIN demos, part A: hero orb, agent loop, tool use, MCP. Shared by both worlds. */
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { CINE, CineClip } from '../_system/cine';
import { MCP_SPEC, LOOP, SERVERS, TOOLS, chapterById, hero, type ToolId } from '../_content/brain';
import { DemoShell, Icon, Segmented, Tag, useDiscrete, useEntryPlay, type World } from './DemoShell';
import { SceneStage, type SceneHandle } from './SceneStage';
import {
  HERO_MS,
  HERO_RUNS,
  MACHINE,
  MCP_ALL_MS,
  MCP_MS,
  SERVER_POS,
  TOOLS_MS,
  TOOL_POS,
  heroScene,
  heroAt,
  loopDuration,
  loopInfo,
  loopScene,
  mcpPhase,
  mcpScene,
  toolsScene,
  type McpChange,
} from './scenes-a';
import s from './demo.module.css';

const pad2 = (n: number): string => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ hero */

function TraceRow({ step, onRun, runLabel }: { readonly step: number; readonly onRun?: () => void; readonly runLabel?: string }) {
  return (
    <div className={s.traceRow}>
      <ol className={s.trace} aria-label="Agent loop steps">
        {hero.trace.map((v, i) => (
          <li key={`${v}-${i}`} data-on={i === step ? 'true' : undefined} data-past={step >= 0 && i < step ? 'true' : undefined}>
            {v}
          </li>
        ))}
      </ol>
      {onRun ? (
        <button type="button" className={s.ghost} onClick={onRun}>
          <Icon name="replay" />
          {runLabel ?? hero.replay}
        </button>
      ) : null}
    </div>
  );
}

/** Signal hero (and the Apple fallback): the canvas orb runs the loop 3 times, one tool per run, then halts. */
export function HeroOrb({ world, size = 560 }: { readonly world: World; readonly size?: number }) {
  const stage = useRef<SceneHandle>(null);
  const host = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(`${HERO_RUNS - 1}|4`);
  const track = useDiscrete<string>(setKey);
  const run = useCallback(() => stage.current?.play(HERO_MS), []);
  useEntryPlay(host, run, 0.3);
  const draw = useCallback((t: number, sz: number) => heroScene(t, sz), []);
  const [runStr, stepStr] = key.split('|');
  const step = Number(stepStr);
  const runNo = Number(runStr) + 1;
  const label =
    step === 4
      ? `Illustrative orb: ${HERO_RUNS} agent-loop runs finished, ring locked.`
      : `Illustrative orb: run ${runNo} of ${HERO_RUNS}, ${hero.trace[step].replace('_', ' ')}.`;
  return (
    <div className={s.hero} data-world={world} ref={host}>
      <div className={world === 'signal' ? `${s.heroScreen} r2-graticule` : s.heroScreen} data-pitch={world === 'signal' ? 'scope' : undefined}>
        {world === 'signal' ? (
          <>
            <span className={s.cornerTL} aria-hidden="true">{`CH3 · BRAIN · RUN ${pad2(runNo)}/${pad2(HERO_RUNS)}`}</span>
            <span className={s.cornerTR} aria-hidden="true">{`TRIG · AUTO ×${HERO_RUNS}`}</span>
          </>
        ) : null}
        <SceneStage
          ref={stage}
          draw={draw}
          maxSize={size}
          label={label}
          onTick={(t) => {
            const a = heroAt(t);
            track(`${a.run}|${a.step}`);
          }}
        />
        <p className={s.heroKey}>{hero.key}</p>
      </div>
      <TraceRow step={step} onRun={run} />
    </div>
  );
}

/** Apple hero: the brain-orb loop clip (pauses after 3 loops, pause control), trace row synced from its markers. */
export function HeroClip({ fallback }: { readonly fallback: ReactNode }) {
  const [step, setStep] = useState(-1);
  const track = useDiscrete<number>(setStep);
  const onTime = useCallback(
    (sec: number) => {
      const u = (sec / CINE['brain-orb'].duration) % 1;
      // the last marker reached decides the step; a fresh call or result shows for ~0.12 of the loop
      const ms = CINE['brain-orb'].markers;
      let best = -1;
      let since = 1;
      ms.forEach((m, i) => {
        const d = (u - m.at + 1) % 1;
        if (d < since) {
          since = d;
          best = i;
        }
      });
      const id = best >= 0 ? ms[best].id : '';
      track(id.startsWith('call') && since < 0.14 ? 1 : id.startsWith('result') && since < 0.1 ? 2 : 0);
    },
    [track],
  );
  return (
    <div className={s.heroClip}>
      <CineClip name="brain-orb" world="apple" eager maxLoops={3} onTime={onTime} fallback={fallback} className={s.heroVideo} />
      <p className={s.heroKey}>{hero.key}</p>
      <TraceRow step={step} />
    </div>
  );
}

/* ------------------------------------------------------------------ ch1 loop */

export function LoopDemo({ world }: { readonly world: World }) {
  const ch = chapterById('loop');
  const stage = useRef<SceneHandle>(null);
  const host = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState<number>(LOOP.initial);
  const [key, setKey] = useState(() => {
    const i = loopInfo(1, LOOP.initial);
    return `${i.turn}|${i.phase}`;
  });
  const track = useDiscrete<string>(setKey);
  const [turnStr, phase] = key.split('|');
  const turn = Number(turnStr);
  const go = useCallback((m: number) => stage.current?.play(loopDuration(m)), []);
  useEntryPlay(host, () => go(max));
  const change = (d: number) => {
    const m = Math.min(LOOP.max, Math.max(LOOP.min, max + d));
    if (m === max) return;
    setMax(m);
    // play() paints from the next frame, after React has handed the stage the new plan
    go(m);
  };
  const draw = useCallback((t: number, sz: number) => loopScene(t, sz, max), [max]);
  const words = phase.replace('_', ' ');
  const text =
    phase === 'done'
      ? `Done: ${turn} tool turns, then the answer.`
      : phase === 'error_max_turns'
        ? `Stopped: error_max_turns.`
        : `Tool turn ${turn} of ${max}: ${words}.`;
  return (
    <div ref={host}>
      <DemoShell
        world={world}
        ch={ch}
        corner={`TOOL TURN ${pad2(turn)}/${pad2(max)}`}
        readout={{ tag: `TURN ${pad2(turn)}`, state: phase === 'error_max_turns' ? 'MAX TURNS' : phase.toUpperCase().replace('_', ' '), text }}
        stage={<SceneStage ref={stage} draw={draw} maxSize={480} label={`Agent loop, max ${max} tool turns: ${text}`} onTick={(t) => { const i = loopInfo(t, max); track(`${i.turn}|${i.phase}`); }} />}
        overlay={
          <>
            <Tag x={-0.12} y={-0.29} align="center">model</Tag>
            <Tag x={0.84} y={-0.24} align="center">tool</Tag>
            <Tag x={-0.12} y={0.97} align="center">tool turns</Tag>
          </>
        }
        controlsLabel="Turn limit"
        controls={
          <div className={s.stepper}>
            <button type="button" className={s.iconBtn} onClick={() => change(-1)} disabled={max <= LOOP.min} aria-label="Fewer turns">
              <Icon name="minus" />
            </button>
            <output className={s.value} aria-live="off">
              <span className={s.valueLabel}>max tool turns</span> {max}
            </output>
            <button type="button" className={s.iconBtn} onClick={() => change(1)} disabled={max >= LOOP.max} aria-label="More turns">
              <Icon name="plus" />
            </button>
          </div>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ ch2 tools */

const TOOL_PHASE = (t: number): string => (t < 0.4 ? 'REQUEST' : t < 0.52 ? 'RUNNING' : t < 1 ? 'RESULT' : 'ABSORBED');

export function ToolsDemo({ world }: { readonly world: World }) {
  const ch = chapterById('tools');
  const stage = useRef<SceneHandle>(null);
  const host = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<ToolId>('read');
  const [phase, setPhase] = useState('ABSORBED');
  const track = useDiscrete<string>(setPhase);
  useEntryPlay(host, () => stage.current?.play(TOOLS_MS));
  const pick = (id: ToolId) => {
    setTool(id);
    stage.current?.play(TOOLS_MS);
  };
  const draw = useCallback((t: number, sz: number) => toolsScene(t, sz, tool), [tool]);
  const meta = TOOLS.find((x) => x.id === tool) ?? TOOLS[0];
  const text =
    phase === 'REQUEST'
      ? `Requested: ${meta.label}. Not run yet.`
      : phase === 'RUNNING'
        ? `The harness runs ${meta.label}.`
        : `Result: ${meta.shape}.`;
  return (
    <div ref={host}>
      <DemoShell
        world={world}
        ch={ch}
        corner={meta.label.toUpperCase()}
        readout={{ tag: 'TOOL CALL', state: phase, text }}
        stage={<SceneStage ref={stage} draw={draw} maxSize={480} label={`Tool use: ${text}`} onTick={(t) => track(TOOL_PHASE(t))} />}
        overlay={
          <>
            <Tag x={-0.5} y={0.3} align="center">model</Tag>
            <Tag x={-0.5} y={-0.47} align="center">harness</Tag>
            {TOOLS.map((x) => (
              <Tag key={x.id} x={TOOL_POS(x.id)[0] + 0.1} y={TOOL_POS(x.id)[1]}>
                {x.label}
              </Tag>
            ))}
          </>
        }
        controls={<Segmented label="Pick a tool" options={TOOLS} value={tool} onChange={pick} />}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ ch3 MCP */

export function McpDemo({ world }: { readonly world: World }) {
  const ch = chapterById('mcp');
  const stage = useRef<SceneHandle>(null);
  const host = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<readonly boolean[]>([true, true, true]);
  const [changed, setChanged] = useState<McpChange>(null);
  const [phase, setPhase] = useState<string>('ready');
  const track = useDiscrete<string>(setPhase);
  useEntryPlay(host, () => {
    setChanged('all');
    stage.current?.play(MCP_ALL_MS);
  });
  const toggle = (i: number) => {
    setOn((prev) => prev.map((v, j) => (j === i ? !v : v)));
    setChanged(i);
    stage.current?.play(MCP_MS);
  };
  const draw = useCallback((t: number, sz: number) => mcpScene(t, sz, on, changed), [on, changed]);
  const clients = on.filter(Boolean).length;
  const tools = SERVERS.reduce((n, srv, i) => n + (on[i] ? srv.prims.tools : 0), 0);
  const last = typeof changed === 'number' ? SERVERS[changed] : null;
  const lastOn = typeof changed === 'number' ? on[changed] : true;
  const stateWord =
    phase === 'ready'
      ? last && !lastOn
        ? `${last.label.toUpperCase()} DISCONNECTED`
        : 'READY'
      : phase === 'connect'
        ? lastOn ? 'CONNECT' : 'TOOLS REMOVED'
        : phase === 'discover'
          ? 'SERVER/DISCOVER'
          : 'TOOLS/LIST';
  const text =
    last && phase === 'ready'
      ? lastOn
        ? `${last.label} connected over ${last.wire}.`
        : `${last.label} disconnected.`
      : `${clients} clients, ${tools} tools listed.`;
  return (
    <div ref={host}>
      <DemoShell
        world={world}
        ch={ch}
        corner={`${clients} CLIENTS · ${tools} TOOLS`}
        readout={{ tag: 'MCP', state: stateWord, text }}
        stage={<SceneStage ref={stage} draw={draw} maxSize={480} label={`MCP host: ${text}`} onTick={(t) => track(mcpPhase(t))} />}
        overlay={
          <>
            <Tag x={-0.42} y={-0.42} align="center">host</Tag>
            <Tag x={MACHINE.x0 + 0.04} y={MACHINE.y1 - 0.06}>this machine</Tag>
            {SERVERS.map((srv, i) => {
              const [x, y] = SERVER_POS[i];
              const remote = srv.transport === 'remote';
              // name + transport on two lines beside each glyph; the remote pair sits outside "this machine"
              const ny = remote ? y - 0.26 : i === 0 ? y - 0.24 : y + 0.14;
              return (
                <span key={srv.id}>
                  <Tag x={x} y={ny} align="center">
                    {srv.label}
                  </Tag>
                  <Tag x={x} y={ny + 0.09} align="center">
                    {srv.wire}
                  </Tag>
                </span>
              );
            })}
          </>
        }
        controlsLabel="Connect servers"
        controls={
          <div className={s.switches}>
            {SERVERS.map((srv, i) => (
              <button key={srv.id} type="button" role="switch" aria-checked={on[i]} className={s.switch} onClick={() => toggle(i)}>
                <span className={s.knob} aria-hidden="true" />
                {srv.label}
              </button>
            ))}
          </div>
        }
        after={
          <p className={s.legend}>
            <span>
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><rect x="3" y="3" width="6" height="6" /></svg>
              tools
            </span>
            <span>
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><circle cx="3" cy="3" r="1.2" /><circle cx="6" cy="3" r="1.2" /><circle cx="9" cy="3" r="1.2" /><circle cx="3" cy="7" r="1" /><circle cx="6" cy="7" r="1" /><circle cx="9" cy="7" r="1" /></svg>
              resources
            </span>
            <span>
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M6 2l4.5 8h-9z" fill="none" /></svg>
              prompts
            </span>
            <span className={s.spec}>{`spec ${MCP_SPEC}`}</span>
          </p>
        }
      />
    </div>
  );
}
