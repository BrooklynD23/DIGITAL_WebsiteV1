'use client';

/**
 * Anatomy: ONE pin, four stages. The pin arrives on the solid object (the hero's pose); a short hold, then the same
 * object separates into five group-coloured bodies. Scroll only picks the target stage (useScrollSteps); a timed
 * playhead (useStagePlayback) walks to it, and the shown stage follows the playhead, so a jump of three stages plays
 * the two between. Glasses animates every pose change itself (CSS transitions). No scrubbing, no wheel capture.
 *
 * Reduced motion / no JS: no pin; the exploded drawing, the full legend and the four beats as a list.
 */
import { useRef, useState, type CSSProperties } from 'react';
import { useScrollSteps } from '../../_system';
import { anatomy } from '../../_content/shades-reveal';
import { Glasses, type SystemGroupId } from '../../_shades-art/Glasses';
import { useStagePlayback } from '../_hero/useStagePlayback';
import s from './reveal.module.css';

const N = anatomy.beats.length;
const LEAD = 0.14;
const STEPS = { count: N, lead: LEAD, playShare: 0.72 } as const;
const MS = 1100;

/** Group hues: the sRGB values Glasses uses for its exploded bodies (its tokens are scoped to its own root). */
const HUE: Readonly<Record<SystemGroupId, string>> = {
  frame: '#9c9ca1',
  display: '#4fa877',
  optics: '#6cbcea',
  timing: '#f0c76a',
  control: '#c3a6f5',
};

/** Non-breaking hyphen: "see-through" never splits across lines. Same text, same glyph. */
const nb = (t: string): string => t.replace(/-/g, '\u2011');

const ART_TITLE = anatomy.groups.map((g) => g.label).join(', ');

function Legend({ lit }: { readonly lit: readonly SystemGroupId[] | null }) {
  return (
    <ul className={s.legend}>
      {anatomy.groups.map((g) => (
        <li key={g.id} data-lit={!lit || lit.includes(g.id) ? 'true' : undefined}>
          <i className={s.swatch} style={{ background: HUE[g.id] }} aria-hidden="true" />
          <span className={s.legendName}>{g.label}</span>
          <span className={s.legendRole}>{g.role}</span>
        </li>
      ))}
    </ul>
  );
}

export function AnatomyPin() {
  const pin = useRef<HTMLDivElement>(null);
  const [apart, setApart] = useState(false);
  const apartRef = useRef(false);
  const { enhanced, active, jumpTo } = useScrollSteps(pin, {
    ...STEPS,
    onFrame: (p) => {
      const next = p >= LEAD * 0.5;
      if (next !== apartRef.current) {
        apartRef.current = next;
        setApart(next);
      }
    },
  });

  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);
  useStagePlayback(active, N, MS, (pos) => {
    const r = Math.round(pos);
    if (r !== shownRef.current) {
      shownRef.current = r;
      setShown(r);
    }
  });

  const beat = anatomy.beats[shown];
  const single = beat.groups.length === 1 ? beat.groups[0] : null;

  if (!enhanced) {
    return (
      <section id="anatomy" className={s.anat} data-tone="dark" aria-labelledby="rv-anat-0">
        <div className={s.anatStatic}>
          <div className={s.anatArt}>
            <Glasses mode="exploded" view="three-quarter" ground="dark" tether title={ART_TITLE} />
          </div>
          <Legend lit={null} />
          <ol className={s.beatList}>
            {anatomy.beats.map((b, i) => (
              <li key={b.id}>
                <h2 id={`rv-anat-${i}`} className={s.beatTitle}>{nb(b.title)}</h2>
                <p className={s.beatLine}>{b.caption}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="anatomy" className={s.anat} data-tone="dark" aria-labelledby={`rv-anat-${shown}`}>
      <div ref={pin} className={s.anatPin} style={{ '--steps': N + LEAD * 4 } as CSSProperties}>
        <div className={s.anatStage}>
          <div className={s.anatArt}>
            <Glasses
              mode={apart ? 'exploded' : 'solid'}
              view="three-quarter"
              ground="dark"
              fit="room"
              tether
              highlight={apart ? single : null}
              title={ART_TITLE}
            />
          </div>
          <div className={s.anatCopy}>
            <div className={s.anatCaps}>
              {anatomy.beats.map((b, i) => (
                <div key={b.id} className={s.anatCap} data-active={i === shown ? 'true' : undefined} aria-hidden={i === shown ? undefined : true}>
                  <h2 id={`rv-anat-${i}`} className={s.beatTitle}>{nb(b.title)}</h2>
                  <p className={s.beatLine}>{b.caption}</p>
                </div>
              ))}
            </div>
            <Legend lit={apart ? beat.groups : []} />
          </div>
          <nav className={s.tracker} aria-label={ART_TITLE}>
            {anatomy.beats.map((b, i) => (
              <button key={b.id} type="button" className={s.trackBtn} aria-current={i === active ? 'step' : undefined} onClick={() => jumpTo(i)}>
                <i className={s.trackDot} style={{ '--hue': HUE[b.groups[0]] } as CSSProperties} aria-hidden="true" />
                <span className="sr-only">{b.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
