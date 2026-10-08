import type { Metadata } from 'next';
import { JoinChapter, SitePage } from '../_chrome';
import s from '../_chrome/site-page.module.css';
import { COMMUNITY } from '../_content/community';
import { LinkRows } from '../_site/LinkRows';

export const metadata: Metadata = { title: COMMUNITY.meta.title, description: COMMUNITY.meta.description };

/** Community: the channels that exist, as link rows. Build night is the join chapter. */
export default function CommunityPage() {
  const { hero, channels } = COMMUNITY;
  return (
    <SitePage>
      <section className={s.hero} data-tone="dark" aria-labelledby="community-title">
        <h1 id="community-title" className={s.heroTitle}>{hero.title}</h1>
        <p className={s.heroLead}>{hero.lead}</p>
      </section>

      <section className={s.section} aria-labelledby="channels-title">
        <div className={s.wrap}>
          <h2 id="channels-title" className={s.h2}>{channels.title}</h2>
          <LinkRows rows={channels.rows} />
        </div>
      </section>

      <JoinChapter world="apple" />
    </SitePage>
  );
}
