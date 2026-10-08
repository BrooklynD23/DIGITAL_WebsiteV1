import type { Metadata } from 'next';
import { JoinChapter, SitePage } from '../_chrome';
import s from '../_chrome/site-page.module.css';
import { GET_INVOLVED } from '../_content/get-involved';
import { LinkRows } from '../_site/LinkRows';
import x from '../_site/extras.module.css';

export const metadata: Metadata = { title: GET_INVOLVED.meta.title, description: GET_INVOLVED.meta.description };

/** Get involved: one section per audience. Students get the three builds first; every other row opens /contact?type=…. */
export default function GetInvolvedPage() {
  const { hero, builds, ask, paths } = GET_INVOLVED;
  return (
    <SitePage>
      <section className={s.hero} data-tone="dark" aria-labelledby="involved-title">
        <h1 id="involved-title" className={s.heroTitle}>{hero.title}</h1>
        <p className={s.heroLead}>{hero.lead}</p>
      </section>

      {paths.map((p, i) => (
        <section key={p.id} id={p.id} className={`${s.section} ${x.anchor}`} data-tone={i % 2 ? 'raised' : undefined} aria-labelledby={`path-${p.id}`}>
          <div className={s.wrap}>
            <h2 id={`path-${p.id}`} className={s.h2}>{p.title}</h2>
            <p className={s.lead}>{p.lead}</p>
            {p.id === 'students' ? (
              <>
                <h3 className={`${s.h3} ${x.sub}`}>{builds.title}</h3>
                <LinkRows rows={builds.rows} />
                <h3 className={`${s.h3} ${x.sub}`}>{ask}</h3>
              </>
            ) : null}
            <LinkRows rows={p.rows} />
          </div>
        </section>
      ))}

      {/* The company paths are listed above, so the join chapter leaves its "Back a build" row out. */}
      <JoinChapter world="apple" backers={false} />
    </SitePage>
  );
}
