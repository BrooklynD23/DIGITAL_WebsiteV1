'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import s from '../_chrome/site-page.module.css';
import { SOON_TEAMS, UPDATE_TEAMS, UPDATE_TYPES, UPDATES_COPY as C, initials } from '../../../lib/data/updates';
import type { Update, UpdateSubTeam, UpdateType } from '../../../lib/data/updates';
import u from './updates.module.css';

const PAGE = 10;
/** Below these counts the controls would outnumber the content (Apple Newsroom keeps one list until there is volume). */
const FEATURE_MIN = 4;
const SEARCH_MIN = 6;
const fmt = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

function Title({ item, className }: { item: Update; className?: string }) {
  if (item.source === 'linkedin') {
    return (
      <a className={className} href={item.externalUrl} target="_blank" rel="noopener noreferrer">
        {item.title}<span aria-hidden="true"> ↗</span><span className={s.srOnly}>{C.opensLinkedIn}</span>
      </a>
    );
  }
  return <Link className={className} href={`/updates/${item.slug}/`}>{item.title}</Link>;
}

/** Initials stack (decorative) + names (authors in ink, mentors/lead in ink-2). */
function Byline({ item }: { item: Update }) {
  return (
    <p className={u.byline}>
      <span className={s.srOnly}>{C.by} </span>
      <span className={u.stack} aria-hidden="true">
        {item.authors.slice(0, 4).map((n) => <span key={n} className={u.av}>{initials(n)}</span>)}
      </span>
      <span className={u.names}>
        <span className={u.authors}>{item.authors.join(', ')}</span>
        {item.mentors.length > 0 && ` · ${C.mentor} ${item.mentors.join(', ')}`}
        {item.lead && ` · ${C.leadRole} ${item.lead}`}
      </span>
    </p>
  );
}

function Pill({ label, n, on, soon, onClick }: { label: string; n?: number; on: boolean; soon?: boolean; onClick: () => void }) {
  return (
    <button type="button" className={u.pill} aria-pressed={on} disabled={n === 0} onClick={onClick}>
      {label}
      {soon && <span className={u.soon}>{C.soon}</span>}
      {n !== undefined && <span className={u.n}>{n}</span>}
    </button>
  );
}

/**
 * The whole log: filter pills with honest counts (0 = disabled, still visible), an optional featured row,
 * date-first rows, and an empty state that shows the row shape. `items` arrives sorted newest first; may be empty.
 */
export function UpdatesBrowser({ items }: { items: readonly Update[] }) {
  const [team, setTeam] = useState<UpdateSubTeam | null>(null);
  const [type, setType] = useState<UpdateType | null>(null);
  const [q, setQ] = useState('');
  const [all, setAll] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('team');
    const match = UPDATE_TEAMS.find((x) => x === t);
    if (match) setTeam(match);
  }, []);

  const needle = q.trim().toLowerCase();
  const filtered = !!(team || type || needle);
  const hits = items.filter(
    (i) =>
      (!team || i.subTeam === team) &&
      (!type || i.type === type) &&
      (!needle || [i.title, i.summary, i.subTeam, C.typeLabels[i.type], ...i.authors, ...i.mentors].some((f) => f.toLowerCase().includes(needle))),
  );
  const featured = !filtered && items.length >= FEATURE_MIN ? items[0] : null;
  const list = featured ? hits.slice(1) : hits;
  const shown = all || filtered ? list : list.slice(0, PAGE);

  return (
    <section className={s.section} aria-labelledby="updates-list">
      <div className={s.wrap}>
        <nav className={u.filters} aria-label={C.filterLabel}>
          <div className={u.group} role="group" aria-label={C.teamGroup}>
            <Pill label={C.all} on={!team && !type} onClick={() => { setTeam(null); setType(null); }} />
            {UPDATE_TEAMS.map((t) => (
              <Pill key={t} label={t} soon={SOON_TEAMS.includes(t)} n={items.filter((i) => i.subTeam === t).length} on={team === t} onClick={() => setTeam(team === t ? null : t)} />
            ))}
          </div>
          <div className={u.group} role="group" aria-label={C.typeGroup}>
            {UPDATE_TYPES.map((t) => (
              <Pill key={t} label={C.typeLabels[t]} n={items.filter((i) => i.type === t).length} on={type === t} onClick={() => setType(type === t ? null : t)} />
            ))}
          </div>
          {items.length >= SEARCH_MIN && (
            <div className={u.search}>
              <label className={s.srOnly} htmlFor="updates-q">{C.searchLabel}</label>
              <input id="updates-q" className={s.control} type="search" placeholder={C.searchLabel} autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          )}
        </nav>

        {featured && (
          <article className={u.feature} aria-label={C.featuredLabel}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
            {featured.coverImage && <img className={u.art} src={featured.coverImage.src} alt={featured.coverImage.alt} loading="lazy" />}
            <div className={u.featureCopy}>
              <span className={u.meta}>{`${fmt(featured.publishedAt)} · ${featured.subTeam}${featured.detail ? ` (${featured.detail})` : ""} · ${C.typeLabels[featured.type]}`}</span>
              <h2 className={s.h3}><Title item={featured} className={u.featureLink} /></h2>
              <p className={u.summary}>{featured.summary}</p>
              <Byline item={featured} />
            </div>
          </article>
        )}

        {items.length === 0 ? (
          <>
            <h2 id="updates-list" className={`${s.h2} r2-reveal`}>{C.empty.title}</h2>
            <p className={s.lead}>{C.empty.body}</p>
            <ul className={u.rows}>
              {UPDATE_TEAMS.map((t) => (
                <li key={t} className={`${u.row} ${u.ghost}`}>
                  <span className={u.meta} aria-hidden="true">—</span>
                  <span className={u.meta}>{t}</span>
                  <span>{C.empty.row}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className={u.listHead}>
              <h2 id="updates-list" className={`${s.h2} r2-reveal`}>{C.listTitle}</h2>
              <p role="status" className={u.meta}>{hits.length === 0 ? C.noMatch : C.count(hits.length)}</p>
            </div>
            <ul className={u.rows}>
              {shown.map((i) => (
                <li key={i.slug} className={u.row}>
                  <time className={u.meta} dateTime={i.publishedAt}>{fmt(i.publishedAt)}</time>
                  <span className={u.meta}>{i.subTeam}{i.detail && ` (${i.detail})`}</span>
                  <div className={u.rowBody}>
                    <span className={u.rowTitle}>
                      <Title item={i} className={u.rowLink} />
                      <span className={u.meta}>{C.typeLabels[i.type]}</span>
                    </span>
                    <p className={u.rowSummary}>{i.summary}</p>
                    <Byline item={i} />
                  </div>
                </li>
              ))}
            </ul>
            {!filtered && !all && list.length > PAGE && (
              <button type="button" className={s.buttonQuiet} onClick={() => setAll(true)}>{C.seeMore}</button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
