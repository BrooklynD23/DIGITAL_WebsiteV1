import type { Metadata } from 'next';
import { JoinChapter, SitePage } from '../_chrome';
import s from '../_chrome/site-page.module.css';
import { ABOUT } from '../_content/about';
import { LinkRows } from '../_site/LinkRows';
import x from '../_site/extras.module.css';
import { DotGlyph } from '../_system/dots/DotGlyph';

export const metadata: Metadata = { title: ABOUT.meta.title, description: ABOUT.meta.description };

/** About: what DIGITAL is and how a build runs on black, then the builds, the name and the next pages on light. */
export default function AboutPage() {
  const { hero, beliefs, how, builds, name, more } = ABOUT;
  return (
    <SitePage>
      <section className={s.hero} data-tone="dark" aria-labelledby="about-title">
        <h1 id="about-title" className={s.heroTitle}>{hero.title}</h1>
        <p className={s.heroLead}>{hero.lead}</p>
      </section>

      <section className={s.section} data-tone="dark" aria-labelledby="beliefs-title">
        <div className={s.wrap}>
          <h2 id="beliefs-title" className={s.h2}>{beliefs.title}</h2>
          <ul className={x.statements}>
            {beliefs.items.map((b) => (
              <li key={b} className={s.h3}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* /pillars/ redirects to /about#how-we-work: keep this id. */}
      <section id="how-we-work" className={`${s.section} ${x.anchor}`} data-tone="dark" aria-labelledby="how-title">
        <div className={s.wrap}>
          <h2 id="how-title" className={s.h2}>{how.title}</h2>
          <p className={s.lead}>{how.lead}</p>
          <ol className={x.stages}>
            {how.stages.map((st) => (
              <li key={st.id}>
                <DotGlyph verb={st.verb} size={120} seed={`about-${st.id}`} className={x.stageArt} />
                <h3 className={s.h3}>{st.name}</h3>
                <p className={x.stageLine}>{st.line}</p>
                <p className={x.stageRule}>{st.rule}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={s.section} aria-labelledby="builds-title">
        <div className={s.wrap}>
          <h2 id="builds-title" className={s.h2}>{builds.title}</h2>
          <LinkRows rows={builds.rows} />
        </div>
      </section>

      <section className={s.section} data-tone="raised" aria-labelledby="name-title">
        <div className={s.wrap}>
          <h2 id="name-title" className={s.h2}>{name.title}</h2>
          <dl className={s.facts}>
            {name.rows.map((r) => (
              <div key={r.key}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={s.section} aria-labelledby="more-title">
        <div className={s.wrap}>
          <h2 id="more-title" className={s.h2}>{more.title}</h2>
          <LinkRows rows={more.rows} />
        </div>
      </section>

      <JoinChapter world="apple" />
    </SitePage>
  );
}
