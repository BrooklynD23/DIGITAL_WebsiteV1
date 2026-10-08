import type { Metadata } from 'next';
import { JoinChapter, SitePage } from '../_chrome';
import s from '../_chrome/site-page.module.css';
import { TEAM } from '../_content/team';

export const metadata: Metadata = { title: TEAM.meta.title, description: TEAM.meta.description };

/** Team: the seats, as a card-free grid. Roles only until the roster in lib/data/team.ts carries real names. */
export default function TeamPage() {
  const { hero, groups, apply } = TEAM;
  return (
    <SitePage>
      <section className={s.hero} data-tone="dark" aria-labelledby="team-title">
        <h1 id="team-title" className={s.heroTitle}>{hero.title}</h1>
        <p className={s.heroLead}>{hero.lead}</p>
      </section>

      {groups.map((g, i) => (
        <section key={g.id} className={i > 0 ? `${s.section} ${s.flush}` : s.section} aria-labelledby={`team-${g.id}`}>
          <div className={s.wrap}>
            <h2 id={`team-${g.id}`} className={s.h2}>{g.title}</h2>
            <ul className={s.grid}>
              {g.seats.map((m) => (
                <li key={m.id} className={s.item}>
                  <p className={s.itemTitle}>{m.title}</p>
                  {m.meta ? <p className={s.itemMeta}>{m.meta}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <JoinChapter world="apple" secondary={apply} />
    </SitePage>
  );
}
