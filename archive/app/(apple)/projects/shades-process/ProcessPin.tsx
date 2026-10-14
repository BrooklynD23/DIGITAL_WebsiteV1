'use client';

/**
 * MOCKUP. The design process as five sketch sheets, one per stage. Scroll picks the stage (useScrollSteps); a timed
 * playhead (useStagePlayback) walks to it; the shown sheet fades in and its leader lines draw on (CSS). No scrubbing,
 * no wheel capture. The glasses go from loose sketch to clean line: each sheet has less displacement than the last.
 * Reduced motion / no JS: no pin; the five sheets stack, fully drawn.
 */
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useScrollSteps } from '../../_system';
import { architecture as A, boards as B, phases as P, requirements as R, scope as S } from '../../_content/shades-process';
import { Glasses } from '../../_shades-art/Glasses';
import { useStagePlayback } from '../_hero/useStagePlayback';
import k from './process.module.css';

const STAGES = [R, S, A, B, P] as const;
const N = STAGES.length;
const STEPS = { count: N, lead: 0.1, playShare: 0.72 } as const;
const MS = 1100;
/** Displacement per sheet (px): loose sketch → clean line. */
const ROUGH = [7, 5, 3.5, 2, 0.6] as const;

/** feTurbulence + feDisplacementMap, two seeds per level: the ink pass and the offset ghost pass. */
function Filters() {
  return (
    <svg className={k.defs} aria-hidden="true" focusable="false">
      <defs>
        {ROUGH.map((scale, i) =>
          (['a', 'b'] as const).map((pass, j) => (
            <filter key={`${i}${pass}`} id={`skr-${i}${pass}`} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={3 + i * 2 + j} />
              <feDisplacementMap in="SourceGraphic" scale={scale * (j ? 1.4 : 1)} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          )),
        )}
      </defs>
    </svg>
  );
}

/** Doubled offset strokes: the same drawing twice, two roughen seeds, the second lighter and shifted. */
function Rough({ level, children, className }: { readonly level: number; readonly children: ReactNode; readonly className?: string }) {
  return (
    <div className={`${k.rough} ${className ?? ''}`}>
      <div style={{ filter: `url(#skr-${level}a)` }}>{children}</div>
      <div className={k.ghost} style={{ filter: `url(#skr-${level}b)` }} aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

/** Hand-lettered callout: text at (tx, ty), a curved leader to the anchor (x, y), a small dot on the anchor. */
function Callout({ x, y, tx, ty, text, mark, end = 'start' }: { readonly x: number; readonly y: number; readonly tx: number; readonly ty: number; readonly text: string; readonly mark?: boolean; readonly end?: 'start' | 'end' }) {
  // Leader leaves the middle of the lettering, from above or below it, toward the anchor. ponytail: width estimated.
  const half = text.length * 3.8;
  const lx = end === 'start' ? tx + half : tx - half;
  const ly = y < ty ? ty - 20 : ty + 6;
  return (
    <g className={mark ? k.mark : undefined}>
      <path className={k.lead} pathLength={1} d={`M${lx} ${ly} Q${lx} ${(ly + y) / 2} ${x} ${y}`} />
      <circle className={k.dot} cx={x} cy={y} r={2.4} />
      <text className={k.hand} x={tx} y={ty} textAnchor={end}>
        {text}
      </text>
    </g>
  );
}

const glassesTitle = 'SHADES glasses, sketched, wired by one cable to the pocket controller';

function ArtRequirements() {
  const c = R.callouts;
  return (
    <div className={k.art}>
      <Rough level={0} className={k.glasses}>
        <Glasses mode="line" view="three-quarter" ground="light" tether title={glassesTitle} />
      </Rough>
      <svg className={k.over} viewBox="0 0 400 300" role="img" aria-label={[c.dial, c.play, c.rewind, c.cable].map((x) => x.text).join('; ')}>
        <Callout x={290} y={140} tx={392} ty={104} text={c.play.text} end="end" />
        <Callout x={262} y={146} tx={300} ty={214} text={c.dial.text} end="end" />
        <Callout x={304} y={148} tx={392} ty={252} text={c.rewind.text} end="end" />
        <Callout x={198} y={140} tx={140} ty={186} text={c.cable.text} mark end="end" />
      </svg>
    </div>
  );
}

/** Out-of-scope doodles, one per scope.out item, each struck through. */
const DOODLES: readonly ReactNode[] = [
  <path key="w" d="M-14 6 Q0 -10 14 6 M-9 10 Q0 0 9 10 M-4 14 Q0 10 4 14" />,
  <g key="c"><rect x={-15} y={-8} width={30} height={20} rx={3} /><circle cx={0} cy={2} r={6} /><rect x={-6} y={-12} width={10} height={4} /></g>,
  <g key="a"><path d="M-14 12 A16 16 0 0 1 14 12" /><path d="M0 12 L8 -2" /><circle cx={0} cy={12} r={2} /></g>,
  <g key="e"><path d="M-16 4 Q0 -10 16 4 Q0 18 -16 4 Z" /><circle cx={0} cy={4} r={5} /></g>,
  <g key="s"><circle cx={-9} cy={4} r={7} /><circle cx={9} cy={4} r={7} /><path d="M-2 4 L2 4" /></g>,
];

function ArtScope() {
  return (
    <div className={k.art}>
      <svg className={k.over} viewBox="0 0 400 300" role="img" aria-label={`${S.outLabel.text}: ${S.out.map((o) => o.text).join(', ')}`}>
        <text className={k.handHead} x={20} y={34}>{S.outLabel.text}</text>
        <g style={{ filter: 'url(#skr-1a)' }}>
          {S.out.map((o, i) => {
            const cx = 70 + (i % 3) * 130;
            const cy = 92 + Math.floor(i / 3) * 110;
            return (
              <g key={o.text} transform={`translate(${cx} ${cy})`}>
                <g className={k.doodle}>{DOODLES[i]}</g>
              </g>
            );
          })}
        </g>
        {S.out.map((o, i) => {
          const cx = 70 + (i % 3) * 130;
          const cy = 92 + Math.floor(i / 3) * 110;
          return (
            <g key={o.text} transform={`translate(${cx} ${cy})`}>
              <text className={k.handSm} x={0} y={44} textAnchor="middle">{o.text}</text>
              <path className={`${k.strike} ${i === 0 ? k.mark : ''}`} pathLength={1} d="M-44 32 Q0 22 46 14" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Callout diagram: host → controller (microcontroller → FPGA) → one cable → display → optics → eye. */
function ArtArchitecture() {
  const n = A.nodes;
  const box = (x: number, y: number, w: number, label: string, mark?: boolean) => (
    <g className={mark ? k.mark : undefined}>
      <rect className={k.box} x={x} y={y} width={w} height={34} rx={4} />
      <text className={k.handSm} x={x + w / 2} y={y + 23} textAnchor="middle">{label}</text>
    </g>
  );
  return (
    <div className={k.art}>
      <svg className={k.over} viewBox="0 0 400 300" role="img" aria-label={[n.host, n.mcu, n.fpga, n.cable, n.display, n.optics, n.eye].map((x) => x.text).join(' → ')}>
        <g style={{ filter: 'url(#skr-2a)' }}>
          <rect className={k.boxGroup} x={128} y={38} width={262} height={86} rx={8} />
          <path className={k.arrow} d="M104 81 L148 81 M140 76 L148 81 L140 86" />
          <path className={k.arrow} d="M254 81 L276 81 M268 76 L276 81 L268 86" />
          <path className={k.arrow} d="M330 124 Q330 170 300 190 M298 182 L300 190 L292 192" />
          <path className={k.arrow} d="M200 211 L176 211 M184 206 L176 211 L184 216" />
          <path className={k.arrow} d="M108 211 L88 211 M96 206 L88 211 L96 216" />
          <path className={k.eye} d="M10 211 Q34 192 58 211 Q34 230 10 211 Z" />
          <circle className={k.eye} cx={34} cy={211} r={6} />
        </g>
        <text className={k.handSm} x={140} y={32}>{n.controller.text}</text>
        {box(12, 64, 92, n.host.text)}
        {box(148, 64, 106, n.mcu.text)}
        {box(276, 64, 104, n.fpga.text, true)}
        <text className={k.handSm} x={300} y={186} textAnchor="end">{n.cable.text}</text>
        {box(200, 194, 90, n.display.text)}
        {box(112, 194, 64, n.optics.text)}
        <text className={k.handSm} x={34} y={250} textAnchor="middle">{n.eye.text}</text>
        <text className={k.note} x={58} y={118} textAnchor="middle">{A.notes.host.text}</text>
        <text className={k.note} x={190} y={142} textAnchor="middle">{A.notes.mcu.text}</text>
        <text className={k.note} x={318} y={57} textAnchor="middle">{A.notes.fpga.text}</text>
        <text className={k.note} x={144} y={282} textAnchor="middle">{A.notes.optics.text}</text>
      </svg>
    </div>
  );
}

function ArtBoards() {
  return (
    <div className={k.art}>
      <Rough level={3} className={k.glasses}>
        <Glasses mode="exploded" view="three-quarter" ground="light" tether title="SHADES taken apart: the glasses and the controller modules, sketched" />
      </Rough>
    </div>
  );
}

function ArtPhases() {
  return (
    <div className={k.art}>
      <Rough level={4} className={`${k.glasses} ${k.glassesTop}`}>
        <Glasses mode="line" view="front" ground="light" title="SHADES glasses, front, clean line" />
      </Rough>
      <svg className={k.over} viewBox="0 0 400 300" aria-hidden="true">
        <path className={k.lead} pathLength={1} d="M24 252 L376 252" />
        {P.items.map((p, i) => {
          const x = 24 + i * (352 / 6);
          return (
            <g key={p.n} className={i === 6 ? k.mark : undefined}>
              <circle className={k.dot} cx={x} cy={252} r={i === 6 ? 6 : 4} />
              <text className={k.handSm} x={x} y={282} textAnchor="middle">{p.n}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Notes({ i }: { readonly i: number }) {
  if (i === 0) return null;
  if (i === 1)
    return (
      <>
        <p className={k.listHead}>{S.inLabel.text}</p>
        <ul className={k.list}>
          {S.in.map((t) => <li key={t.text}>{t.text}</li>)}
        </ul>
        <p className={`${k.gate} ${k.mark}`}>{S.gate.text}</p>
      </>
    );
  if (i === 3)
    return (
      <ul className={k.list}>
        {B.items.map((b) => (
          <li key={b.name.text}>
            {b.name.text} <span className={`${k.tag} ${b.tag.text === 'Stretch' ? k.mark : ''}`}>{b.tag.text}</span>
          </li>
        ))}
      </ul>
    );
  if (i === 4)
    return (
      <>
        <ol className={k.list}>
          {P.items.map((p) => <li key={p.n}>{p.name.text}</li>)}
        </ol>
        <p className={k.small}>{P.note.text}</p>
      </>
    );
  return null;
}

const ARTS = [ArtRequirements, ArtScope, ArtArchitecture, ArtBoards, ArtPhases] as const;

function Sheet({ i, on }: { readonly i: number; readonly on: boolean }) {
  const st = STAGES[i];
  const Art = ARTS[i];
  return (
    <article className={k.sheet} data-on={on ? 'true' : undefined} aria-hidden={on ? undefined : true} aria-labelledby={`sp-${st.id}`}>
      <Art />
      <div className={k.copy}>
        <p className={k.step}>{`${i + 1} / ${N}`}</p>
        <h2 id={`sp-${st.id}`} className={k.title}>{st.title.text}</h2>
        <p className={k.line}>{st.line.text}</p>
        <Notes i={i} />
      </div>
    </article>
  );
}

export function ProcessPin() {
  const pin = useRef<HTMLDivElement>(null);
  const { enhanced, active, jumpTo } = useScrollSteps(pin, STEPS);
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);
  useStagePlayback(active, N, MS, (pos) => {
    const r = Math.round(pos);
    if (r !== shownRef.current) {
      shownRef.current = r;
      setShown(r);
    }
  });

  if (!enhanced) {
    return (
      <section id="process" className={k.section} data-tone="dark" aria-label="Design process">
        <Filters />
        <div className={k.stack}>
          {STAGES.map((st, i) => <Sheet key={st.id} i={i} on />)}
        </div>
      </section>
    );
  }

  return (
    <section id="process" className={k.section} data-tone="dark" aria-label="Design process">
      <Filters />
      <div ref={pin} className={k.pin} style={{ '--steps': N + 0.4 } as CSSProperties}>
        <div className={k.stage}>
          <div className={k.sheets}>
            {STAGES.map((st, i) => <Sheet key={st.id} i={i} on={i === shown} />)}
          </div>
          <nav className={k.tracker} aria-label="Design process stages">
            {STAGES.map((st, i) => (
              <button key={st.id} type="button" className={k.trackBtn} aria-current={i === active ? 'step' : undefined} onClick={() => jumpTo(i)}>
                <span className={k.trackN}>{i + 1}</span>
                <span className={i === active ? k.trackName : 'sr-only'}>{st.title.text}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
