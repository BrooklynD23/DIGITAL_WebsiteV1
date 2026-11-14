'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import s from '../_chrome/site-page.module.css';
import { UPDATE_TAGS, UPDATE_TEAMS, UPDATE_TYPES, UPDATES_COPY as C, tagsOf } from '../../../lib/data/updates';
import type { TagSlug, Update, UpdateType } from '../../../lib/data/updates';
import { TagChips } from './TagChips';
import { Byline, UpdateRow, fmt } from './UpdateRow';
import u from './updates.module.css';

const PAGE = 10;
/** Cards above the log: one lead card + this many in the grid (prototype 2026-11-12). */
const GRID = 3;
/** Below this count search would outnumber the content. */
const SEARCH_MIN = 6;
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
  // Phones fold Type + search into one <details>; wide screens keep it open (summary hidden by CSS).
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 734px)');
    const sync = () => setOpen(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

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
  // Each post once: the log holds only what the cards (lead + GRID) did not show.
  const log = hits.slice(1 + GRID);
  const shown = all || filtered ? log : log.slice(0, PAGE);
  const years = Array.from(new Set(shown.map((i) => i.publishedAt.slice(0, 4))));
  const typeCounts = UPDATE_TYPES.map((x) => [x, items.filter((i) => i.type === x).length] as const).filter(([, n]) => n > 0);
  const active = (type ? 1 : 0) + (needle ? 1 : 0);
  const none = tag && !type && !needle ? C.noTagPosts : C.noMatch;

  return (
    <section className={s.section} aria-label={C.allUpdates}>
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
          <details className={u.fold} open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
            <summary className={u.foldSummary}>{C.foldLabel}{active > 0 && <span className={u.n}> {active}</span>}</summary>
            <div className={u.foldBody}>
              <div className={u.group} role="group" aria-label={C.typeGroup}>
                {typeCounts.map(([x, n]) => (
                  <Pill key={x} label={C.typeLabels[x]} n={n} on={type === x} onClick={() => setType(type === x ? null : x)} />
                ))}
              </div>
              {items.length >= SEARCH_MIN && (
                <div className={u.search}>
                  <label className={s.srOnly} htmlFor="updates-q">{C.searchLabel}</label>
                  <input id="updates-q" className={s.control} type="search" placeholder={C.searchLabel} autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
              )}
            </div>
          </details>
        </nav>

        {items.length > 0 && <p role="status" className={`${u.meta} ${u.status}`}>{hits.length === 0 ? none : C.count(hits.length)}</p>}

        {leadItem && (
          <div className={u.cards} aria-label={C.featuredLabel} role="group">
            <Card item={leadItem} lead onTag={pickTag} />
            {rest.slice(0, GRID).map((i) => <Card key={i.slug} item={i} onTag={pickTag} />)}
          </div>
        )}

        {items.length === 0 ? (
          <>
            <h2 className={`${s.h2} r2-reveal`}>{C.empty.title}</h2>
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
            {log.length > 0 && <h2 id="updates-list" className={`${s.h2} r2-reveal`}>{C.earlier}</h2>}
            {years.map((y) => (
              <div key={y}>
                <h3 className={u.year}>{y}</h3>
                <ul className={u.rows}>
                  {shown.filter((i) => i.publishedAt.startsWith(y)).map((i) => <UpdateRow key={i.slug} item={i} short onTag={pickTag} />)}
                </ul>
              </div>
            ))}
            {!filtered && !all && log.length > PAGE && (
              <button type="button" className={s.buttonQuiet} onClick={() => setAll(true)}>{C.seeMore}</button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
