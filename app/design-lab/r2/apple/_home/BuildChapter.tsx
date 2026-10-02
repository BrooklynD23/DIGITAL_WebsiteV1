'use client';

/** Apple world: one build per chapter. Its signature micro-motion plays once on entry; hover or focus replays it. */
import Link from 'next/link';
import { useRef } from 'react';
import { DotStage, type DotStageHandle } from '../../_system';
import { confirmTag, type Channel } from '../../_content/home';
import { usePlayOnEntry } from '../../_home/useStageScrub';
import s from './home.module.css';

export function BuildChapter({ channel: c, flip }: { readonly channel: Channel; readonly flip: boolean }) {
  const host = useRef<HTMLElement>(null);
  const stage = useRef<DotStageHandle>(null);
  usePlayOnEntry(host, stage, 0.6);
  return (
    <article ref={host} className={s.build} data-flip={flip ? 'true' : undefined} data-stage-host aria-labelledby={`build-${c.id}`}>
      <DotStage ref={stage} verb={c.verb} size={420} seed={`apple-ch-${c.id}`} playOnHover label={`${c.name}: ${c.verbNote}`} className={s.buildOrb} />
      <div className={s.buildCopy}>
        <h3 id={`build-${c.id}`} className={s.buildName}>
          <Link className={s.buildLink} href={`/design-lab/r2/apple/${c.id}/`}>
            {c.name}
            <svg viewBox="0 0 16 16" width="28" height="28" aria-hidden="true" focusable="false"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </h3>
        <p className={s.buildLine}>{c.line}</p>
        <p className={s.buildStatus}>{c.status} {confirmTag}</p>
      </div>
    </article>
  );
}
