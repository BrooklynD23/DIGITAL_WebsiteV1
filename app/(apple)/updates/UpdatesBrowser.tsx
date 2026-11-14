'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import s from '../_chrome/site-page.module.css';
import { UPDATE_TAGS, UPDATE_TEAMS, UPDATE_TYPES, UPDATES_COPY as C, initials, tagsOf } from '../../../lib/data/updates';
import type { TagSlug, Update, UpdateType } from '../../../lib/data/updates';
import { TagChips } from './TagChips';
import u from './updates.module.css';

const PAGE = 10;
/** Cards above the log: one lead card + this many in the grid (prototype 2026-11-12). */
const GRID = 3;
/** Below this count search would outnumber the content. */
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
    <span className={u.byline}>
      <span className={s.srOnly}>{C.by} </span>
      <span className={u.stack} aria-hidden="true">
        {item.authors.slice(0, 4).map((n) => <span key={n} className={u.av}>{initials(n)}</span>)}
      </span>
      <span className={u.names}>
        <span className={u.authors}>{item.authors.join(', ')}</span>
        {item.mentors.length > 0 && ` · ${C.mentor} ${item.mentors.join(', ')}`}
        {item.lead && ` · ${C.leadRole} ${item.lead}`}
      </span>
    </span>
  );
}

const meta = (i: Update) => `${i.detail ? `${i.detail} · ` : ''}${C.typeLabels[i.type]} · ${fmt(i.publishedAt)}`;

/** Lead-card art: the cover image, else the post's value stream as quiet mono labels (VESSEL), else none (text-only lead). */
const flowOf = (item: Update) => (item.source === 'site' ? item.page.sections.find((x) => x.flow)?.flow : undefined);
const hasArt = (item: Update) => !!item.coverImage || !!flowOf(item);

function Art({ item }: { item: Update }) {
  if (item.coverImage) {
    // eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer
    return <img className={u.art} src={item.coverImage.src} alt={item.coverImage.alt} loading="lazy" />;
  }
  const flow = flowOf(item);
  return flow ? (
    <div className={u.art} aria-hidden="true">
      <ol className={u.artFlow}>{flow.map((f) => <li key={f}>{f}</li>)}</ol>
    </div>
  ) : null;
}

/** One card = one link: the title link is stretched over the card (::after); the tag chips sit above it as their own links. `lead` adds the 2-column art. */
function Card({ item, lead, onTag }: { item: Update; lead?: boolean; onTag: (t: TagSlug) => void }) {
  const cls = lead ? `${u.card} ${u.lead}${hasArt(item) ? '' : ` ${u.leadText}`}` : u.card;
  return (
    <article className={cls}>
      {lead && <Art item={item} />}
      <div className={u.cardCopy}>
        <div className={u.chipline}>
          <TagChips item={item} onTag={onTag} />
          <span className={u.meta}>{meta(item)}</span>
        </div>
        <h2 className={lead ? u.leadTitle : u.cardTitle}>
          {item.source === 'linkedin'
            ? <a className={u.cardLink} href={item.externalUrl} target="_blank" rel="noopener noreferrer">{item.title}<span className={s.srOnly}>{C.opensLinkedIn}</span></a>
            : <Link className={u.cardLink} href={`/updates/${item.slug}/`}>{item.title}</Link>}
        </h2>
        <span className={u.cardSummary}>{item.summary}</span>
        <Byline item={item} />
        <span className={u.src}>
          {item.source === 'linkedin' ? <>{C.linkedIn}<span aria-hidden="true"> ↗</span></> : C.onSite}
        </span>
      </div>
    </article>
  );
}

function Pill({ label, n, on, onClick }: { label: string; n?: number; on: boolean; onClick: () => void }) {
  return (
    <button type="button" className={u.pill} aria-pressed={on} disabled={n === 0} onClick={onClick}>
      {label}
      {n !== undefined && <span className={u.n}>{n}</span>}
    </button>
  );
}

const isTag = (v: string | null): v is TagSlug => UPDATE_TAGS.some((t) => t.slug === v);

/**
 * The whole log: filter pills with honest counts (0 = disabled, still visible), cards for the newest four hits
 * (Head Designer cards exception, 2026-11-12), date-first rows of every hit, and an empty state that shows the row shape. `items` arrives sorted newest first; may be empty.
 */
export function UpdatesBrowser({ items }: { items: readonly Update[] }) {
  const [tag, setTagState] = useState<TagSlug | null>(null);
  const [type, setType] = useState<UpdateType | null>(null);
  const [q, setQ] = useState('');
  const [all, setAll] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tag');
    if (isTag(t)) setTagState(t);
  }, []);

  /** Shareable filter: ?tag=<slug> (replaceState, no history entries). */
  const setTag = (t: TagSlug | null) => {
    setTagState(t);
    const url = new URL(window.location.href);
    if (t) url.searchParams.set('tag', t); else url.searchParams.delete('tag');
    window.history.replaceState(window.history.state, '', url);
  };
  /** A chip on a card or row: filter by it alone and bring the list into view. */
  const pickTag = (t: TagSlug) => {
    setTag(t);
    setType(null);
    setQ('');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('updates-filters')?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  };

  const hasTag = (i: Update, t: TagSlug) => tagsOf(i).some((x) => x.slug === t);
  const needle = q.trim().toLowerCase();
  const filtered = !!(tag || type || needle);
  const hits = items.filter(
    (i) =>
      (!tag || hasTag(i, tag)) &&
      (!type || i.type === type) &&
      (!needle || [i.title, i.summary, i.subTeam, C.typeLabels[i.type], ...i.authors, ...i.mentors, ...tagsOf(i).map((t) => t.label)].some((f) => f.toLowerCase().includes(needle))),
  );
  const [leadItem, ...rest] = hits;
  const shown = all || filtered ? hits : hits.slice(0, PAGE);
  const none = tag && !type && !needle ? C.noTagPosts : C.noMatch;

  return (
    <section className={s.section} aria-labelledby="updates-list">
      <div className={s.wrap}>
        <nav id="updates-filters" className={u.filters} aria-label={C.filterLabel}>
          <div className={u.group} role="group" aria-label={C.tagGroup}>
            <Pill label={C.all} on={!tag && !type} onClick={() => { setTag(null); setType(null); }} />
            {UPDATE_TAGS.map((t) => {
              const n = items.filter((i) => hasTag(i, t.slug)).length;
              // Head Designer 2026-11-14: tags with no posts are hidden, not disabled.
              return n === 0 ? null : (
                <button key={t.slug} type="button" className={`${u.tag} ${u.tagLg}`} data-tag={t.slug} aria-label={C.tagCount(t.label, n)} aria-pressed={tag === t.slug} onClick={() => setTag(tag === t.slug ? null : t.slug)}>
                  <span className={u.tagChip}>{t.label}<span className={u.n}>{n}</span></span>
                </button>
              );
            })}
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

        {leadItem && (
          <div className={u.cards} aria-label={C.featuredLabel} role="group">
            <Card item={leadItem} lead onTag={pickTag} />
            {rest.slice(0, GRID).map((i) => <Card key={i.slug} item={i} onTag={pickTag} />)}
          </div>
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
              <p role="status" className={u.meta}>{hits.length === 0 ? none : C.count(hits.length)}</p>
            </div>
            {shown.length > 0 && <ul className={u.rows}>
              {shown.map((i) => (
                <li key={i.slug} className={u.row}>
                  <time className={u.meta} dateTime={i.publishedAt}>{fmt(i.publishedAt)}</time>
                  <span className={u.rowTeam}>
                    <TagChips item={i} onTag={pickTag} />
                    {i.detail && <span className={u.meta}>{i.detail}</span>}
                  </span>
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
            </ul>}
            {!filtered && !all && hits.length > PAGE && (
              <button type="button" className={s.buttonQuiet} onClick={() => setAll(true)}>{C.seeMore}</button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
