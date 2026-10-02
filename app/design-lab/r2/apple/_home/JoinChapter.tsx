'use client';

/** Apple world: the light join chapter that ends the page. The open seat plays once on entry. */
import { useRef } from 'react';
import { DotStage, type DotStageHandle } from '../../_system';
import { DISCORD_URL, join } from '../../_content/home';
import { usePlayOnEntry } from '../../_home/useStageScrub';
import s from './home.module.css';

export function JoinChapter() {
  const host = useRef<HTMLElement>(null);
  const seat = useRef<DotStageHandle>(null);
  usePlayOnEntry(host, seat, 0.5);
  return (
    <section ref={host} id={join.id} className={s.join} aria-labelledby="join-title">
      <div className={s.joinInner}>
        <DotStage ref={seat} verb="seat" size={220} seed="apple-join" anchor label="An open seat in a ring of seats" className={s.joinOrb} />
        <h2 id="join-title" className={s.joinTitle}>{join.headline}</h2>
        <p className={s.joinWhen}>{join.when} · {join.where}</p>
        <p className={s.joinLead}>{join.noExperience}</p>
        <div className={s.joinActions}>
          <a className={s.ctaPill} href={DISCORD_URL} rel="noopener noreferrer" target="_blank">{join.cta}</a>
          <a className={s.more} href="#builds">
            {join.secondary}
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
