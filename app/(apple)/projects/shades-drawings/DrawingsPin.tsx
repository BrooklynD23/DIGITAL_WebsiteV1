'use client';

/**
 * MOCKUP. SHADES as six engineering drawing sheets. Desktop (≥ 900px, motion allowed): scroll picks a sheet
 * (useScrollSteps), a timed playhead (useStagePlayback) walks to it; the shown sheet's pencil construction lines
 * draw on, then the drafted lines, then the title block stamps in (CSS). No scrubbing, no wheel capture.
 * Narrow, reduced motion or no JS: no pin; the sheets stack, fully drawn.
 * Paper (dark / light) and pencil palette (A / B / C) toggles sit in the layout flow, never over a sheet.
 */
import { useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { useScrollSteps } from '../../_system';
import { SHEETS, optics, parts, routes, titleBlock as TB, toggles as T, type Sourced } from '../../_content/shades-drawings';
import { useStagePlayback } from '../_hero/useStagePlayback';
import { ArtBoards, ArtFrame, ArtOptics, ArtParts, ArtPuck, ArtRoutes, Defs, Variants } from './Drawings';
import k from './drawings.module.css';

const N = SHEETS.length;
const STEPS = { count: N, lead: 0.1, playShare: 0.72 } as const;
const MS = 1100;
const ZONES_X = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
const ZONES_Y = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

type Paper = 'dark' | 'light';

const wideQuery = '(min-width: 900px)';
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(wideQuery);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const useWide = () => useSyncExternalStore(subscribe, () => window.matchMedia(wideQuery).matches, () => false);
const noop = () => () => {};
/** True after hydration only: the toggles need JS, so no-JS markup leaves them out. */
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

/** Per-variant source lines for the notes column. */
const variantSources = (id: string): readonly Sourced[] => {
  const v = id === routes.id ? routes.variants : id === optics.id ? optics.variants : id === parts.id ? parts.variants : [];
  return v.map((x) => ({ text: `${x.route} · ${x.name.text}`, src: x.body.src }));
};

function art(id: string, paper: Paper): ReactNode {
  switch (id) {
    case 'frame':
      return <ArtFrame ground={paper} />;
    case 'puck':
      return <ArtPuck />;
    case 'routes':
      return (
        <>
          <ArtRoutes />
          <Variants items={routes.variants} cols={2} />
        </>
      );
    case 'optics':
      return (
        <>
          <ArtOptics />
          <Variants items={optics.variants} cols={4} />
        </>
      );
    case 'parts':
      return <ArtParts />;
    default:
      return <ArtBoards />;
  }
}

function TitleBlock({ i }: { readonly i: number }) {
  const st = SHEETS[i];
  const L = TB.labels;
  return (
    <dl className={k.tb}>
      <div className={k.tbProject}>
        <dd>{TB.project.text}</dd>
      </div>
      <div className={k.tbWide}>
        <dt>{L.title}</dt>
        <dd>{st.title.text.replace(/\.$/, '').toUpperCase()}</dd>
      </div>
      <div className={k.tbWide}>
        <dt>{L.source}</dt>
        <dd>{st.source}</dd>
      </div>
      <div>
        <dt>{L.scale}</dt>
        <dd>{TB.scale.text}</dd>
      </div>
      <div>
        <dt>{L.rev}</dt>
        <dd>{TB.rev.text}</dd>
      </div>
      <div>
        <dt>{L.sheet}</dt>
        <dd>{`${i + 1} / ${N}`}</dd>
      </div>
      <div className={k.tbStatus}>
        <dt>{L.status}</dt>
        <dd className={k.stamp}>{TB.status.text}</dd>
      </div>
    </dl>
  );
}

function Sheet({ i, on, paper }: { readonly i: number; readonly on: boolean; readonly paper: Paper }) {
  const st = SHEETS[i];
  const notes = [...st.notes, ...variantSources(st.id)];
  return (
    <article className={k.sheet} data-on={on ? 'true' : undefined} aria-hidden={on ? undefined : true} aria-labelledby={`dw-${st.id}`}>
      <div className={k.zx} aria-hidden="true">{ZONES_X.map((z) => <span key={z}>{z}</span>)}</div>
      <div className={k.zy} aria-hidden="true">{ZONES_Y.map((z) => <span key={z}>{z}</span>)}</div>
      <div className={`${k.zy} ${k.zyR}`} aria-hidden="true">{ZONES_Y.map((z) => <span key={z}>{z}</span>)}</div>
      <div className={`${k.zx} ${k.zxB}`} aria-hidden="true">{ZONES_X.map((z) => <span key={z}>{z}</span>)}</div>
      <div className={k.inner}>
        <div className={k.draw}>{art(st.id, paper)}</div>
        <div className={k.side}>
          <h2 id={`dw-${st.id}`} className={k.title}>{st.title.text}</h2>
          <p className={k.line}>{st.line.text}</p>
          <ol className={k.notes}>
            {notes.map((n) => (
              <li key={n.text}>
                <span>{n.text}</span>
                <span className={k.src}>{n.src}</span>
              </li>
            ))}
          </ol>
          <TitleBlock i={i} />
        </div>
      </div>
    </article>
  );
}

function Toggles({ paper, palette, setPaper, setPalette }: { readonly paper: Paper; readonly palette: string; readonly setPaper: (p: Paper) => void; readonly setPalette: (p: string) => void }) {
  return (
    <div className={k.toggles}>
      <div className={k.seg} role="group" aria-label={T.paper.label.text}>
        <span className={k.segLabel}>{T.paper.label.text}</span>
        {(['dark', 'light'] as const).map((p) => (
          <button key={p} type="button" className={k.segBtn} aria-pressed={paper === p} onClick={() => setPaper(p)}>
            {T.paper[p].text}
          </button>
        ))}
      </div>
      <div className={k.seg} role="group" aria-label={T.palette.label.text}>
        <span className={k.segLabel}>{T.palette.label.text}</span>
        {T.palette.options.map((o) => (
          <button key={o.id} type="button" className={`${k.segBtn} ${k.segSq}`} aria-pressed={palette === o.id} title={o.name.text} onClick={() => setPalette(o.id)}>
            <span aria-hidden="true">{o.id.toUpperCase()}</span>
            <span className="sr-only">{o.name.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function DrawingsPin() {
  const pin = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const mounted = useMounted();
  const { enhanced, active, jumpTo } = useScrollSteps(pin, STEPS);
  const pinned = enhanced && wide;
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);
  const [paper, setPaper] = useState<Paper>('dark');
  const [palette, setPalette] = useState('b');
  useStagePlayback(active, N, MS, (pos) => {
    const r = Math.round(pos);
    if (r !== shownRef.current) {
      shownRef.current = r;
      setShown(r);
    }
  });

  const toggles = mounted && <Toggles paper={paper} palette={palette} setPaper={setPaper} setPalette={setPalette} />;

  return (
    <section id="drawings" className={k.section} data-paper={paper} data-palette={palette} data-tone={paper} aria-label="Drawing sheets">
      <Defs />
      {pinned ? (
        <div ref={pin} className={k.pin} style={{ '--steps': N + 0.4 } as CSSProperties}>
          <div className={k.stage}>
            <div className={k.bar}>
              <nav className={k.tracker} aria-label="Drawing sheets">
                {SHEETS.map((st, i) => (
                  <button key={st.id} type="button" className={k.trackBtn} aria-current={i === active ? 'step' : undefined} onClick={() => jumpTo(i)}>
                    <span className={k.trackN}>{i + 1}</span>
                    <span className="sr-only">{st.title.text}</span>
                  </button>
                ))}
              </nav>
              {toggles}
            </div>
            <div className={k.sheets}>
              {SHEETS.map((st, i) => <Sheet key={st.id} i={i} on={i === shown} paper={paper} />)}
            </div>
          </div>
        </div>
      ) : (
        <div className={k.stack}>
          {mounted ? <div className={k.bar}>{toggles}</div> : null}
          {SHEETS.map((st, i) => <Sheet key={st.id} i={i} on paper={paper} />)}
        </div>
      )}
    </section>
  );
}
