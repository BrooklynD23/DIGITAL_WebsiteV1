import type { Metadata } from 'next';
import Link from 'next/link';
import { DotStage, StateMark } from '../_system';
import { JoinChapter, WorldFooter, WorldNav } from '../_chrome';
import { channels, channelsHeadline, confirmTag, join } from '../_content/home';
import { ScopeHero } from './_home/ScopeHero';
import s from './_home/home.module.css';

export const metadata: Metadata = {
  title: 'Home · Signal Capture · R2 lab',
  description: 'DIGITAL home, Signal Capture world: one capture of a build, scrubbed by scroll.',
};

export default function SignalHome() {
  return (
    <div className={`${s.page} r2-graticule`}>
      <WorldNav world="signal" current="home" />
      <main id="r2-main">
        <ScopeHero />

        <section id="channels" className={s.channels} aria-labelledby="channels-title">
          <div className={s.wrap}>
            <h2 id="channels-title" className={s.h2}>{channelsHeadline}</h2>
            <ul className={s.chRows}>
              {channels.map((c) => (
                <li key={c.id} className={s.chRow} data-stage-host>
                  <div className={s.chScope}>
                    <span className={s.chRowMark}>{c.ch}</span>
                    <DotStage verb={c.verb} size={300} seed={`ch-${c.id}`} playOnHover label={`${c.name}: ${c.verbNote}`} className={s.chOrb} />
                  </div>
                  <div className={s.chBody}>
                    <h3 className={s.chTitle}>
                      <Link className={s.chProbe} href={`/design-lab/r2/signal/${c.id}/`} prefetch={false}>
                        {c.name}
                        <svg viewBox="0 0 16 16" width="28" height="28" aria-hidden="true" focusable="false"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.25" /></svg>
                      </Link>
                    </h3>
                    <p className={s.chLine}>
                      {c.line}
                      {c.lineConfirm ? <span className={s.confirm}> {confirmTag}</span> : null}
                    </p>
                    <p className={s.chStatus}>
                      <StateMark state="pending" size={24} />
                      <span>{c.status} <span className={s.confirm}>{confirmTag}</span></span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <JoinChapter world="signal" secondary={{ label: join.secondary, href: '#channels' }} />
      </main>
      <WorldFooter world="signal" />
    </div>
  );
}
