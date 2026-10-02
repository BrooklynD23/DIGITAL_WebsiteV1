'use client';

/** Apple world: one build per chapter. Its signature micro-motion plays once on entry; hover or focus replays it. */
import Link from 'next/link';
import { useRef } from 'react';
import { Chevron, DotStage, usePlayOnEntry, type DotStageHandle } from '../../_system';
import { confirmTag, type Channel } from '../../_content/home';
import s from './home.module.css';

export function BuildChapter({ channel: c, flip }: { readonly channel: Channel; readonly flip: boolean }) {
  const host = useRef<HTMLElement>(null);
  const stage = useRef<DotStageHandle>(null);
  usePlayOnEntry(host, stage, { threshold: 0.6 });
  return (
    <article ref={host} className={s.build} data-flip={flip ? 'true' : undefined} data-stage-host aria-labelledby={`build-${c.id}`}>
      <DotStage ref={stage} verb={c.verb} size={420} seed={`apple-ch-${c.id}`} playOnHover label={`${c.name}: ${c.verbNote}`} className={s.buildOrb} />
      <div className={s.buildCopy}>
        <h3 id={`build-${c.id}`} className={s.buildName}>
          <Link className={s.buildLink} href={`/design-lab/r2/apple/${c.id}/`} prefetch={false}>
            {c.name}
            <Chevron dir="right" size={28} />
          </Link>
        </h3>
        <p className={s.buildLine}>
          {c.line}
          {c.lineConfirm ? <span className={s.buildConfirm}> {confirmTag}</span> : null}
        </p>
        <p className={s.buildStatus}>{c.status} {confirmTag}</p>
      </div>
    </article>
  );
}
