'use client';

/**
 * MOCKUP. SHADES as the design process: six sheets, ideate → render. Desktop (≥ 900px, motion allowed): scroll
 * picks a sheet (useScrollSteps), a timed playhead (useStagePlayback) walks to it, and the shown sheet draws on
 * (the drawings mockup's CSS). No scrubbing, no wheel capture. Narrow, reduced motion or no JS: the sheets stack,
 * fully drawn. Paper Dark / Light sits in the flow above the sheet and also re-grounds the team section.
 */
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useScrollSteps } from '../../_system';
import { STAGES, type Stage } from '../../_content/shades-journey';
import { titleBlock as TB, toggles as TG } from '../../_content/shades-drawings';
import { useStagePlayback } from '../_hero/useStagePlayback';
import { ArtFrame, Defs } from '../shades-drawings/Drawings';
import k from '../shades-drawings/drawings.module.css';
import { ArtExplode, ArtExplore, ArtIdeate, ArtRefine, ArtRender } from './Art';
import { Teams } from './Teams';
import { useMounted, useWide, type Paper } from './hooks';
import j from './journey.module.css';

const N = STAGES.length;
const STEPS = { count: N, lead: 0.1, playShare: 0.72 } as const;
const MS = 1100;
const ZX = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
const ZY = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

function art(id: Stage['id'], paper: Paper): ReactNode {
  switch (id) {
    case 'ideate':
      return <ArtIdeate />;
    case 'explore':
      return <ArtExplore />;
    case 'refine':
      return <ArtRefine paper={paper} />;
    case 'explode':
      return <ArtExplode />;
    case 'specify':
      return <ArtFrame ground={paper} />;
    default:
      return <ArtRender paper={paper} />;
  }
}

function TitleBlock({ st }: { readonly st: Stage }) {
  const L = TB.labels;
  return (
    <dl className={k.tb}>
      <div className={k.tbProject}><dd>{TB.project.text}</dd></div>
      <div className={k.tbWide}><dt>{L.title}</dt><dd>{st.title.text.replace(/\.$/, '').toUpperCase()}</dd></div>
      <div><dt>{L.scale}</dt><dd>{TB.scale.text}</dd></div>
      <div><dt>{L.rev}</dt><dd>{TB.rev.text}</dd></div>
      <div><dt>{L.sheet}</dt><dd>{`5 / ${N}`}</dd></div>
      <div className={k.tbStatus}><dt>{L.status}</dt><dd className={k.stamp}>{TB.status.text}</dd></div>
    </dl>
  );
}

function Sheet({ i, on, paper }: { readonly i: number; readonly on: boolean; readonly paper: Paper }) {
  const st = STAGES[i];
  const isRender = st.id === 'render';
  return (
    <article className={`${k.sheet} ${j.sheet}`} data-stage={st.id} data-on={on ? 'true' : undefined} aria-hidden={on ? undefined : true} aria-labelledby={`jn-${st.id}`}>
      <div className={k.zx} aria-hidden="true">{ZX.map((z) => <span key={z}>{z}</span>)}</div>
      <div className={k.zy} aria-hidden="true">{ZY.map((z) => <span key={z}>{z}</span>)}</div>
      <div className={`${k.zy} ${k.zyR}`} aria-hidden="true">{ZY.map((z) => <span key={z}>{z}</span>)}</div>
      <div className={`${k.zx} ${k.zxB}`} aria-hidden="true">{ZX.map((z) => <span key={z}>{z}</span>)}</div>
      <div className={k.inner}>
        <div className={`${k.draw} ${j.draw} ${isRender ? j.drawRender : ''}`}>{art(st.id, paper)}</div>
        <div className={k.side}>
          <h3 id={`jn-${st.id}`} className={k.title}>{st.title.text}</h3>
          <p className={k.line}>{st.line.text}</p>
          <ol className={k.notes}>
            {st.notes.map((n) => (
              <li key={n.text}>
                <span>{n.text}</span>
                <span className={k.src}>{n.src}</span>
              </li>
            ))}
          </ol>
          {st.id === 'specify' ? <TitleBlock st={st} /> : <p className={j.stageName}>{`${st.name.text} · ${i + 1} / ${N}`}</p>}
        </div>
      </div>
    </article>
  );
}

function PaperToggle({ paper, setPaper }: { readonly paper: Paper; readonly setPaper: (p: Paper) => void }) {
  return (
    <div className={k.seg} role="group" aria-label={TG.paper.label.text}>
      <span className={k.segLabel}>{TG.paper.label.text}</span>
      {(['dark', 'light'] as const).map((p) => (
        <button key={p} type="button" className={k.segBtn} aria-pressed={paper === p} onClick={() => setPaper(p)}>
          {TG.paper[p].text}
        </button>
      ))}
    </div>
  );
}

export function JourneyPin() {
  const pin = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const mounted = useMounted();
  const { enhanced, active, jumpTo } = useScrollSteps(pin, STEPS);
  const pinned = enhanced && wide;
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);
  const [paper, setPaper] = useState<Paper>('dark');
  useStagePlayback(active, N, MS, (pos) => {
    const r = Math.round(pos);
    if (r !== shownRef.current) {
      shownRef.current = r;
      setShown(r);
    }
  });

  const toggle = mounted ? <PaperToggle paper={paper} setPaper={setPaper} /> : null;

  return (
    <div className={`${k.section} ${j.root}`} data-paper={paper} data-palette="b" data-tone={paper}>
      <Defs />
      <section id="journey" aria-label="The design process, six sheets">
        {pinned ? (
          <div ref={pin} className={k.pin} style={{ '--steps': N + 0.4 } as CSSProperties}>
            <div className={k.stage}>
              <div className={k.bar}>
                <nav className={k.tracker} aria-label="Stages">
                  {STAGES.map((st, i) => (
                    <button key={st.id} type="button" className={`${k.trackBtn} ${j.trackBtn}`} aria-current={i === active ? 'step' : undefined} onClick={() => jumpTo(i)}>
                      <span className={k.trackN}>{st.name.text}</span>
                    </button>
                  ))}
                </nav>
                {toggle}
              </div>
              <div className={k.sheets}>
                {STAGES.map((st, i) => <Sheet key={st.id} i={i} on={i === shown} paper={paper} />)}
              </div>
            </div>
          </div>
        ) : (
          <div className={k.stack}>
            {toggle ? <div className={k.bar}>{toggle}</div> : null}
            {STAGES.map((st, i) => <Sheet key={st.id} i={i} on paper={paper} />)}
          </div>
        )}
      </section>
      <Teams paper={paper} />
    </div>
  );
}
