import type { Metadata } from 'next';
import { SitePage } from '../_chrome';
import s from '../_chrome/site-page.module.css';
import { UPDATES_COPY as C } from '../../../lib/data/updates';
import { getUpdates } from '../../../lib/data/updates-source';
import { UpdatesBrowser } from './UpdatesBrowser';
import u from './updates.module.css';

export const metadata: Metadata = { title: C.meta.title, description: C.meta.description };

// Apple Newsroom shape: title + one line, then the list. The sub-team pitch lives on each build page, not here.
export default async function UpdatesPage() {
  const sorted = [...(await getUpdates())].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <SitePage tone="light">
      <section className={`${s.section} ${u.head}`} aria-labelledby="updates-title">
        <div className={s.wrap}>
          <h1 id="updates-title" className={u.title}>{C.title}</h1>
          <p className={s.lead}>{C.lead}</p>
        </div>
      </section>

      <UpdatesBrowser items={sorted} />

      <section className={`${s.section} ${s.flush}`} aria-labelledby="updates-join">
        <div className={`${s.wrap} ${u.join}`}>
          <h2 id="updates-join" className={`${s.h2} r2-reveal`}>{C.join.title}</h2>
          <a className={s.button} href={C.join.href}>{C.join.cta}</a>
        </div>
      </section>
    </SitePage>
  );
}
