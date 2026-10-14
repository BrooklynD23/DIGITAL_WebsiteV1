import type { Metadata } from 'next';
import { Glasses, type GlassesMode, type GlassesView } from '../../_shades-art/Glasses';
import s from './preview.module.css';

/** Internal review sheet for the shared SHADES glasses artwork. Not linked, not indexed. */
export const metadata: Metadata = {
  title: 'SHADES glasses artwork · preview',
  robots: { index: false },
};

const MODES: readonly GlassesMode[] = ['solid', 'line', 'exploded'];
const VIEWS: readonly GlassesView[] = ['front', 'three-quarter', 'side'];
const WORD = { word: 'word' } as const;
const SOLO = 'SHADES glasses, three-quarter view, the word shown in the right lens';
const WIRED = 'SHADES glasses wired by a cable from the right temple to the external controller box';
const BIG: readonly { id: string; mode: GlassesMode; ground: 'dark' | 'light'; tether: boolean; title: string }[] = [
  { id: 'crop-v2-solid-dark', mode: 'solid', ground: 'dark', tether: false, title: SOLO },
  { id: 'crop-v2-solid-light', mode: 'solid', ground: 'light', tether: false, title: SOLO },
  { id: 'crop-v2-exploded', mode: 'exploded', ground: 'dark', tether: false, title: 'SHADES glasses taken apart: frame, optics, display; word timing and control drawn off the frame' },
  { id: 'crop-v2-tether-dark', mode: 'solid', ground: 'dark', tether: true, title: WIRED },
  { id: 'crop-v2-tether-light', mode: 'solid', ground: 'light', tether: true, title: WIRED },
  { id: 'crop-v2-tether-exploded', mode: 'exploded', ground: 'dark', tether: true, title: 'SHADES taken apart: frame, optics and display on the glasses; word timing and control lifted out of the controller box' },
];
const GRIDS = [
  { ground: 'dark', tether: false },
  { ground: 'light', tether: false },
  { ground: 'dark', tether: true },
  { ground: 'light', tether: true },
] as const;

export default function ShadesArtPreview() {
  return (
    <main className={s.page}>
      <h1 className={s.h1}>SHADES glasses artwork</h1>
      {BIG.map((b) => (
        <section key={b.id} id={b.id} className={`${s.big} ${b.ground === 'dark' ? s.dark : s.light}`}>
          <Glasses mode={b.mode} view="three-quarter" ground={b.ground} tether={b.tether} display={WORD} title={b.title} />
        </section>
      ))}
      {GRIDS.map(({ ground, tether }) => (
        <section key={`${ground}-${tether}`} id={`grid-${tether ? 'tether-' : ''}${ground}`} className={`${s.grid} ${ground === 'dark' ? s.dark : s.light}`}>
          <h2 className={s.h2}>
            {ground} · tether {tether ? 'on' : 'off'}
          </h2>
          {MODES.map((mode) =>
            VIEWS.map((view) => (
              <figure key={`${mode}-${view}`} className={s.cell}>
                <Glasses
                  mode={mode}
                  view={view}
                  ground={ground}
                  tether={tether}
                  display={WORD}
                  fixation={mode !== 'solid'}
                  title={`SHADES glasses, ${mode}, ${view}${tether ? ', wired to the controller box' : ''}`}
                />
                <figcaption className={s.cap}>
                  {mode} · {view}
                </figcaption>
              </figure>
            )),
          )}
        </section>
      ))}
    </main>
  );
}
