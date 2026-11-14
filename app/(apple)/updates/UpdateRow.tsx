import Link from 'next/link';
import s from '../_chrome/site-page.module.css';
import { UPDATES_COPY as C, initials } from '../../../lib/data/updates';
import type { TagSlug, Update } from '../../../lib/data/updates';
import { TagChips } from './TagChips';
import u from './updates.module.css';

export const fmt = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const fmtShort = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function Title({ item, className }: { item: Update; className?: string }) {
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
export function Byline({ item }: { item: Update }) {
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

/** One hairline row: date · tag chips (+ detail) · title + type + summary + byline. `short` drops the year (the log groups by year). */
export function UpdateRow({ item, short, onTag }: { item: Update; short?: boolean; onTag?: (t: TagSlug) => void }) {
  return (
    <li className={u.row}>
      <time className={u.meta} dateTime={item.publishedAt}>{(short ? fmtShort : fmt)(item.publishedAt)}</time>
      <span className={u.rowTeam}>
        <TagChips item={item} onTag={onTag} />
        {item.detail && <span className={u.meta}>{item.detail}</span>}
      </span>
      <div className={u.rowBody}>
        <span className={u.rowTitle}>
          <Title item={item} className={u.rowLink} />
          <span className={u.meta}>{C.typeLabels[item.type]}</span>
        </span>
        <p className={u.rowSummary}>{item.summary}</p>
        <Byline item={item} />
      </div>
    </li>
  );
}
