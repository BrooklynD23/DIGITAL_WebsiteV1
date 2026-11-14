import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SitePage } from '../../_chrome';
import s from '../../_chrome/site-page.module.css';
import { SOON_TEAMS, UPDATES_COPY as C, initials, moreOf, readMinutes } from '../../../../lib/data/updates';
import type { Update } from '../../../../lib/data/updates';
import { getUpdates } from '../../../../lib/data/updates-source';
import u from '../updates.module.css';
import { TagChips } from '../TagChips';
import { UpdateRow } from '../UpdateRow';

export const dynamicParams = false;

const siteEntries = async (): Promise<Extract<Update, { source: 'site' }>[]> =>
  (await getUpdates()).filter((x): x is Extract<Update, { source: 'site' }> => x.source === 'site');

export async function generateStaticParams() {
  return (await siteEntries()).map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const e = (await siteEntries()).find((x) => x.slug === params.slug);
  return e ? { title: C.postTitle(e.title), description: e.summary } : {};
}

const fmt = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default async function UpdatePostPage({ params }: { params: { slug: string } }) {
  const e = (await siteEntries()).find((x) => x.slug === params.slug);
  if (!e) notFound();
  const more = moreOf(await getUpdates(), e);
  const people = [
    ...e.authors.map((n) => [n, e.mentors.includes(n) ? `${C.author} · ${C.mentor}` : C.author] as const),
    ...e.mentors.filter((n) => !e.authors.includes(n)).map((n) => [n, C.mentor] as const),
  ];
  const soon = SOON_TEAMS.includes(e.subTeam);
  return (
    <SitePage tone="light">
      <article className={s.section} aria-labelledby="post-title">
        <div className={s.wrap}>
          <nav className={u.crumbs} aria-label={C.breadcrumb}>
            <Link href="/updates/">{C.back}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{C.typeLabels[e.type]}</span>
          </nav>
          <h1 id="post-title" className={u.postTitle}>{e.title}</h1>
          <p className={s.lead}>{e.page.dek}</p>
          <div className={u.postByline}>
            <TagChips item={e} />
            <span className={u.meta}>
              {`${fmt(e.publishedAt)} · ${e.detail ? `${e.detail} · ` : ''}${C.typeLabels[e.type]} · ${readMinutes(e)} ${C.minRead}`}{soon && ` · ${C.comingSoon}`}
            </span>
            <ul className={u.people}>
              {people.map(([n, role]) => (
                <li key={n} className={u.person}>
                  <span className={u.av} aria-hidden="true">{initials(n)}</span>
                  <span><b>{n}</b><small>{role}</small></span>
                </li>
              ))}
            </ul>
          </div>
          <div className={s.prose}>
            {e.page.sections.map((sec) => (
              <section key={sec.heading}>
                <h2>{sec.heading}</h2>
                {sec.body.split('\n\n').filter(Boolean).map((p) => <p key={p}>{p}</p>)}
                {sec.flow && (
                  <ul className={u.flow} aria-label={C.valueStreamLabel}>
                    {sec.flow.map((v) => <li key={v}>{v}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>
          {e.externalUrl && (
            <a className={`${s.textLink} ${u.postLink}`} href={e.externalUrl} target="_blank" rel="noopener noreferrer">
              {C.readOnLinkedIn}<span aria-hidden="true"> ↗</span><span className={s.srOnly}>{C.opensLinkedIn}</span>
            </a>
          )}
          {more.length > 0 && (
            <section className={u.more} aria-labelledby="more-updates">
              <h2 id="more-updates" className={s.h2}>{C.moreUpdates}</h2>
              <ul className={u.rows}>{more.map((i) => <UpdateRow key={i.slug} item={i} />)}</ul>
              <Link className={`${s.textLink} ${u.moreLink}`} href="/updates/">{C.allUpdates}</Link>
            </section>
          )}
        </div>
      </article>
    </SitePage>
  );
}
