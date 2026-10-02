import type { Metadata } from 'next';
import { fontSignal } from '../_system/fonts';
import { VERBS } from '../_system/dots/engine';
import { GLYPHS } from '../_system/icons/glyphs';
import { IconMatrix, StateMarks } from './_parts/IconMatrix';
import { MotionDemo } from './_parts/MotionDemo';
import { Renderers } from './_parts/Renderers';
import { ScrollDemo } from './_parts/ScrollDemo';
import { VerbBench } from './_parts/VerbBench';
import { Worlds } from './_parts/Worlds';
import s from './system.module.css';

export const metadata: Metadata = {
  title: 'R2 system specimen · DIGITAL design lab',
  description: 'Dot engine, glyph family, motion tokens and the two round-2 world token sets.',
  robots: { index: false, follow: false },
};

const SECTIONS = [
  ['verbs', 'Verbs'],
  ['renderers', 'Renderers'],
  ['icons', 'Glyphs'],
  ['motion', 'Motion'],
  ['worlds', 'Worlds'],
] as const;

export default function SystemSpecimen() {
  const build = VERBS.filter((v) => v.family === 'build').length;
  const agentic = VERBS.length - build;
  return (
    <div className={`world-signal ${fontSignal} ${s.page}`}>
      <a className={s.skip} href="#r2-system">
        Skip to content
      </a>
      <header className={`r2-graticule ${s.masthead}`}>
        <div className={s.wrap}>
          <h1 className={s.h1}>Round 2 system</h1>
          <p className={s.lead}>
            One dot engine, one glyph family, one set of motion tokens. Both worlds import it, and every page draws
            from it.
          </p>
          <dl className={s.facts}>
            <div>
              <dt>Verbs</dt>
              <dd>
                {build} build · {agentic} agentic
              </dd>
            </div>
            <div>
              <dt>Glyphs</dt>
              <dd>{GLYPHS.length} × 3 states × 3 sizes</dd>
            </div>
            <div>
              <dt>At rest</dt>
              <dd>0 rAF callbacks</dd>
            </div>
          </dl>
          <nav className={s.toc} aria-label="Specimen sections">
            {SECTIONS.map(([id, name]) => (
              <a key={id} href={`#${id}`}>
                {name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div id="r2-system" tabIndex={-1}>
        <section id="verbs" className={s.section} aria-labelledby="verbs-h">
          <div className={s.wrap}>
            <h2 id="verbs-h" className={s.h2}>
              Verbs
            </h2>
            <p className={s.sectionLead}>
              <code>frame(verb, t, opts)</code> is pure and seeded; t = 1 is every verb&rsquo;s rest pose. Scrub the
              slider or press play: one pass, then the stage sleeps.
            </p>
            <h3 className={s.h3}>Build</h3>
            <VerbBench family="build" />
            <h3 className={s.h3}>Agentic</h3>
            <VerbBench family="agentic" />
          </div>
        </section>

        <section id="renderers" className={s.section} aria-labelledby="renderers-h">
          <div className={s.wrap}>
            <h2 id="renderers-h" className={s.h2}>
              Two renderers, one frame
            </h2>
            <Renderers />
          </div>
        </section>

        <ScrollDemo />

        <section id="icons" className={s.section} aria-labelledby="icons-h">
          <div className={s.wrap}>
            <h2 id="icons-h" className={s.h2}>
              Glyphs
            </h2>
            <p className={s.sectionLead}>
              24-unit grid, 1px stroke, 2-unit dot pitch, at most one red anchor. Hover or focus a row to run its working
              state.
            </p>
            <h3 className={s.h3}>Build set</h3>
            <IconMatrix set="build" />
            <h3 className={s.h3}>Agentic set</h3>
            <IconMatrix set="agentic" />
            <h3 className={s.h3}>Channel state by line form</h3>
            <StateMarks />
          </div>
        </section>

        <section id="motion" className={s.section} aria-labelledby="motion-h">
          <div className={s.wrap}>
            <h2 id="motion-h" className={s.h2}>
              Motion tokens
            </h2>
            <MotionDemo />
            <h3 className={s.h3}>Reveal</h3>
            <div className={s.revealRow}>
              {['Plan', 'Prototype', 'Test', 'Integrate'].map((w) => (
                <p key={w} className={`r2-reveal ${s.revealTile}`}>
                  {w}
                </p>
              ))}
            </div>
            <p className={s.small}>
              30 px + fade on the CSS view() timeline. Unsupported browsers and reduced motion show the tiles in place.
            </p>
          </div>
        </section>

        <section id="worlds" className={`${s.section} ${s.sectionFlush}`} aria-labelledby="worlds-h">
          <div className={s.wrap}>
            <h2 id="worlds-h" className={s.h2}>
              Two worlds, one vocabulary
            </h2>
            <p className={s.sectionLead}>
              Same token names, swapped by one class. Pair each world with its font class.
            </p>
          </div>
          <Worlds />
        </section>
      </div>
    </div>
  );
}
