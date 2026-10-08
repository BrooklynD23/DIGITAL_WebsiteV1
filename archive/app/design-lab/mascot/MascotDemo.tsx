'use client';

/**
 * MASCOT lab: a neutral homepage section with a visible on/off toggle so the Head Designer can
 * compare the page with and without the mascot. Content renders server-side; the mascot is a
 * client-only, lazily imported decoration that never takes layout space.
 */

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { builds, hero, join } from './content';
import styles from './mascot.module.css';

const ModuleMascot = dynamic(() => import('./ModuleMascot'), { ssr: false, loading: () => null });

// Fine pointer + room for the perch. Touch, coarse pointers and narrow windows never load it.
const CAPABLE_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 768px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

function statusText(capable: boolean | null, reduced: boolean | null, on: boolean, choice: boolean | null): string {
  if (capable === null) return 'Checking this device.';
  if (!capable) return 'Off on touch screens and narrow windows. The mascot needs a mouse or trackpad.';
  if (!on && reduced && choice === null) return 'Off: your system asks for reduced motion. Turn it on to see a still version.';
  if (!on) return 'Off. This is the page without a mascot.';
  if (reduced) return 'On, still: no blinking or squash, because your system asks for reduced motion.';
  return 'On. Point at a build or a join button, or poke the module.';
}

type ControlsProps = {
  readonly capable: boolean | null;
  readonly on: boolean;
  readonly paused: boolean;
  readonly status: string;
  readonly onToggle: () => void;
  readonly onPause: () => void;
};

function LabControls({ capable, on, paused, status, onToggle, onPause }: ControlsProps) {
  const unavailable = capable !== true;
  return (
    <section className={styles.labBar} aria-labelledby="mascot-lab-title">
      <div className={`${styles.wrap} ${styles.labInner}`}>
        <div className={styles.labText}>
          <p id="mascot-lab-title" className={styles.labTitle}>
            Design lab · Mascot comparison
          </p>
          <p id="mascot-lab-status" className={styles.labStatus} role="status">
            {status}
          </p>
        </div>
        <div className={styles.labButtons}>
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={on}
            aria-disabled={unavailable || undefined}
            aria-describedby="mascot-lab-status"
            onClick={unavailable ? undefined : onToggle}
          >
            <span>Mascot</span>
            <span className={styles.toggleState} aria-hidden="true">
              {on ? 'On' : 'Off'}
            </span>
          </button>
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={paused}
            aria-disabled={!on || undefined}
            onClick={on ? onPause : undefined}
          >
            <span>Pause motion</span>
            <span className={styles.toggleState} aria-hidden="true">
              {paused ? 'Paused' : 'Live'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function Hero({ mascot }: { readonly mascot: React.ReactNode }) {
  return (
    <section className={styles.hero} aria-labelledby="mascot-hero-title">
      <div className={`${styles.wrap} ${styles.heroInner}`}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 id="mascot-hero-title" className={styles.thesis}>
          {hero.thesis}
        </h1>
        <p className={styles.lead}>{hero.lead}</p>
        <div className={styles.ctaRow}>
          <a className={styles.ctaPrimary} href={hero.primaryCta.href} data-mascot="join">
            {hero.primaryCta.label}
          </a>
          <a className={styles.ctaSecondary} href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </a>
        </div>
        {/* Perch: absolutely positioned on the hero rule, so on/off never moves the layout. */}
        <div className={styles.perch}>{mascot}</div>
      </div>
    </section>
  );
}

function Builds() {
  return (
    <section id="builds" className={styles.builds} aria-labelledby="mascot-builds-title">
      <div className={styles.wrap}>
        <h2 id="mascot-builds-title" className={styles.h2}>
          The builds
        </h2>
        <ol className={styles.buildList}>
          {builds.map((b) => (
            <li key={b.code}>
              <article className={styles.build} data-mascot={b.key} aria-labelledby={`build-${b.key}`}>
                <div className={styles.buildHead}>
                  <p className={styles.code}>{b.code}</p>
                  <h3 id={`build-${b.key}`} className={styles.buildTitle}>
                    <a href={b.href}>{b.title}</a>
                  </h3>
                </div>
                <div className={styles.buildBody}>
                  <p className={styles.summary}>{b.summary}</p>
                  <dl className={styles.meta}>
                    {b.meta.map((m) => (
                      <div key={m.k} className={styles.metaRow}>
                        <dt>{m.k}</dt>
                        <dd>{m.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Join() {
  return (
    <section className={styles.join} aria-labelledby="mascot-join-title">
      <div className={styles.wrap}>
        <h2 id="mascot-join-title" className={styles.h2}>
          {join.heading}
        </h2>
        <p className={styles.joinLine}>{join.line}</p>
        <div className={styles.ctaRow}>
          <a className={styles.ctaPrimary} href={join.cta.href} data-mascot="join">
            {join.cta.label}
          </a>
          <a className={styles.ctaSecondary} href={join.discord.href} rel="noopener noreferrer" target="_blank">
            {join.discord.label}
            <span className={styles.srOnly}> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function MascotDemo() {
  const capable = useMediaQuery(CAPABLE_QUERY);
  const reduced = useMediaQuery(REDUCED_QUERY);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [paused, setPaused] = useState(false);

  // Default: on only for a fine pointer with motion allowed. An explicit choice wins.
  const on = capable === true && (choice ?? reduced === false);
  const status = statusText(capable, reduced, on, choice);

  return (
    <div className={styles.page}>
      <LabControls
        capable={capable}
        on={on}
        paused={paused}
        status={paused && on ? 'Paused. The mascot is frozen and ignores the page.' : status}
        onToggle={() => setChoice(!on)}
        onPause={() => setPaused((p) => !p)}
      />
      <Hero mascot={on ? <ModuleMascot paused={paused} reducedMotion={reduced === true} /> : null} />
      <Builds />
      <Join />
    </div>
  );
}
