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

export default function ShadesArtPreview() {
  return (
    <main className={s.page}>
      <h1 className={s.h1}>SHADES glasses artwork</h1>
      <section id="big-dark" className={`${s.big} ${s.dark}`}>
        <Glasses mode="solid" view="three-quarter" ground="dark" display={WORD} title="SHADES glasses, three-quarter view, the word shown in the right lens" />
      </section>
      <section id="big-light" className={`${s.big} ${s.light}`}>
        <Glasses mode="solid" view="three-quarter" ground="light" display={WORD} title="SHADES glasses, three-quarter view, the word shown in the right lens" />
      </section>
      <section id="big-exploded" className={`${s.big} ${s.dark}`}>
        <Glasses mode="exploded" view="three-quarter" ground="dark" display={WORD} title="SHADES glasses taken apart: frame, optics, display; word timing and control drawn off the frame" />
      </section>
      {(['dark', 'light'] as const).map((ground) => (
        <section key={ground} id={`grid-${ground}`} className={`${s.grid} ${ground === 'dark' ? s.dark : s.light}`}>
          {MODES.map((mode) =>
            VIEWS.map((view) => (
              <figure key={`${mode}-${view}`} className={s.cell}>
                <Glasses mode={mode} view={view} ground={ground} display={WORD} fixation={mode !== 'solid'} title={`SHADES glasses, ${mode}, ${view}`} />
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
