'use client';

/** Signal join chapter: an open seat (seat verb, red anchor = the open slot) plays once on entry. */
import { useRef } from 'react';
import { DotStage, type DotStageHandle } from '../../_system';
import { DISCORD_URL, join } from '../../_content/home';
import { usePlayOnEntry } from '../../_home/useStageScrub';
import s from './home.module.css';

export function JoinScope() {
  const host = useRef<HTMLElement>(null);
  const seat = useRef<DotStageHandle>(null);
  usePlayOnEntry(host, seat, 0.5);
  return (
    <section ref={host} id={join.id} className={s.join} aria-labelledby="join-title">
      <div className={`${s.wrap} ${s.joinGrid}`}>
        <DotStage ref={seat} verb="seat" size={360} seed="join-seat" anchor label="An open seat in a ring of seats" className={s.joinOrb} />
        <div className={s.joinCopy}>
          <h2 id="join-title" className={s.h1}>{join.headline}</h2>
          <dl className={s.joinTable}>
            <div><dt>When</dt><dd>{join.when}</dd></div>
            <div><dt>Where</dt><dd>{join.where}</dd></div>
            <div><dt>Bring</dt><dd>{join.noExperience}</dd></div>
          </dl>
          <div className={s.joinActions}>
            <a className={s.ctaFilled} href={DISCORD_URL} rel="noopener noreferrer" target="_blank">{join.cta}</a>
            <a className={s.textLink} href="#channels">{join.secondary}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
