'use client';
import type { MouseEvent } from 'react';
import { UPDATES_COPY as C, tagsOf } from '../../../lib/data/updates';
import type { TagSlug, Update } from '../../../lib/data/updates';
import u from './updates.module.css';

/**
 * A post's tag chips (team first), each a link to /updates/?tag=<slug>.
 * On the index, `onTag` filters in place instead of navigating; on a post page the link navigates.
 */
export function TagChips({ item, onTag }: { item: Update; onTag?: (t: TagSlug) => void }) {
  const click = (t: TagSlug) => (e: MouseEvent) => {
    if (!onTag || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onTag(t);
  };
  return (
    <span className={u.tags}>
      {tagsOf(item).map((t) => (
        <a key={t.slug} className={u.tag} data-tag={t.slug} href={`/updates/?tag=${t.slug}`} aria-label={C.showTag(t.label)} onClick={click(t.slug)}>
          <span className={u.tagChip}>{t.label}</span>
        </a>
      ))}
    </span>
  );
}
