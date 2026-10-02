'use client';

import { useEffect, useState } from 'react';
import { NameTag } from './NameTag';
import { NAME_MAX, NameText, useSign } from './SignProvider';
import { PixelIcon } from './icons';
import { LINKS, MEETING, ORG, OTHER_PATHS, OWNERSHIP, WORKFLOW } from './content';
import styles from './f.module.css';

/* ---------- Hero ---------- */

export function HeroTitle() {
  return (
    <h1 className={styles.thesis}>
      <span className={styles.srOnly}>Make something worth putting your name on.</span>
      <span aria-hidden="true" className={styles.thesisVisual}>
        <span className={styles.thesisLine}>Make something</span>
        <span className={styles.thesisLine}>worth putting</span>
        <span className={styles.thesisLine}>
          <NameTag
            size="hero"
            className={styles.heroTag}
            onClick={() => document.getElementById('f-sign')?.focus()}
          />{' '}
          on.
        </span>
      </span>
    </h1>
  );
}

export function SignField() {
  const { name, setName, ready } = useSign();
  return (
    <div className={styles.signField}>
      <label htmlFor="f-sign" className={styles.signLabel}>
        Sign here. Watch where it lands.
      </label>
      <input
        id="f-sign"
        className={styles.signInput}
        type="text"
        inputMode="text"
        autoComplete="given-name"
        spellCheck={false}
        maxLength={NAME_MAX}
        placeholder="your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={!ready}
        aria-describedby="f-sign-note"
      />
      <p id="f-sign-note" className={styles.signNote}>
        {ready ? 'Stays in this browser. Nothing is sent.' : 'Signing needs JavaScript. Everything else on this page works without it.'}
      </p>
    </div>
  );
}

/* ---------- Sheet (how a build runs) ---------- */

export function Sheet() {
  const { seat, name } = useSign();
  const owner = name.trim();
  const cells: { k: string; v: string; filled: boolean }[] = [
    { k: 'Record', v: seat ? `${seat.projectCode} · ${seat.projectTitle}` : '______', filled: Boolean(seat) },
    { k: 'Seat', v: seat ? seat.title : '______', filled: Boolean(seat) },
    { k: 'Owner', v: owner || '______', filled: Boolean(owner) },
    { k: 'Review', v: OWNERSHIP[1] ?? '', filled: true },
    { k: 'Test gate', v: OWNERSHIP[2] ?? '', filled: true },
    { k: 'Repair plan', v: OWNERSHIP[3] ?? '', filled: true },
  ];
  return (
    <>
      <div className={styles.sheetHead}>
        <h2 className={styles.h2}>{seat ? 'Your sheet.' : 'The sheet you’d sign.'}</h2>
        <ol className={styles.mechanism}>
          <li>You take a subsystem.</li>
          <li>You own it through the test gate.</li>
          <li>Someone reviews every handoff.</li>
        </ol>
      </div>
      <div className={styles.titleBlock} role="group" aria-label="Build sheet">
        {cells.map((c) => (
          <div key={c.k} className={styles.tbCell} data-filled={c.filled ? '' : undefined}>
            <span className={styles.mono}>{c.k}</span>
            <span className={styles.tbValue}>{c.v}</span>
          </div>
        ))}
      </div>
      <p className={styles.footnote}>
        Rules from DG-001&rsquo;s build scope: {OWNERSHIP.join(' · ')}. <span className={styles.flag}>[confirm they apply to every build]</span>
      </p>

      <ol className={styles.rail} aria-label="Workflow">
        {WORKFLOW.map((stage, i) => (
          <li key={stage} className={styles.railStep}>
            <span className={styles.mono}>0{i + 1}</span>
            <span className={styles.railName}>{stage}</span>
          </li>
        ))}
      </ol>

      <div className={styles.seatDetail} aria-live="polite">
        {seat ? (
          <>
            <h3 className={styles.h3}>
              {seat.title} <span className={styles.muted}>on {seat.projectCode}</span>
            </h3>
            <p className={styles.body}>{seat.line}</p>
            <ul className={styles.bullets}>
              {seat.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className={styles.notes}>
              {seat.notes.map((n) => (
                <span key={n} className={styles.mono}>
                  {n}
                </span>
              ))}
            </p>
          </>
        ) : (
          <p className={styles.body}>
            Nothing here yet. <a href="#bench">Put your tag on a seat</a> and this sheet fills in with what that seat
            owns.
          </p>
        )}
      </div>
    </>
  );
}

/* ---------- Thursday (join) ---------- */

export function SignedStatus() {
  const { seat, ready } = useSign();
  if (!ready) return <span className={styles.stepState}>Needs JavaScript; skip to step 2.</span>;
  return seat ? (
    <span className={styles.stepState} data-done="">
      <PixelIcon name="check" /> Done: {seat.projectCode} · {seat.title}
    </span>
  ) : (
    <a className={styles.stepState} href="#bench">
      Not yet. Go to the bench <PixelIcon name="arrow-right" />
    </a>
  );
}

export function JoinSteps() {
  return (
    <ol className={styles.steps}>
      <li className={styles.step}>
        <span className={styles.stepNum}>1</span>
        <div>
          <h3 className={styles.stepTitle}>Sign the bench.</h3>
          <SignedStatus />
        </div>
      </li>
      <li className={styles.step}>
        <span className={styles.stepNum}>2</span>
        <div>
          <h3 className={styles.stepTitle}>Tell us the seat.</h3>
          <p className={styles.stepBody}>One short form. Your name tag stays here; you type what you want to share.</p>
          <a className={styles.cta} href={LINKS.contactSeat}>
            <span>Take a subsystem</span>
            <PixelIcon name="arrow-right" />
          </a>
        </div>
      </li>
      <li className={styles.step}>
        <span className={styles.stepNum}>3</span>
        <div>
          <h3 className={styles.stepTitle}>Show up Thursday.</h3>
          <p className={styles.factLine}>
            <PixelIcon name="calendar" /> <span>{MEETING.when}</span>
          </p>
          <p className={styles.factLine}>
            <PixelIcon name="map" /> <span>{MEETING.where}, {MEETING.campus}</span>
          </p>
          <p className={styles.stepBody}>{MEETING.rhythm}</p>
        </div>
      </li>
      <li className={styles.step}>
        <span className={styles.stepNum}>4</span>
        <div>
          <h3 className={styles.stepTitle}>Say hi first, if you like.</h3>
          <a className={styles.textLink} href={LINKS.discord} rel="noopener noreferrer" target="_blank">
            <PixelIcon name="message" /> <span>Discord</span>
            <span className={styles.srOnly}> (opens in a new tab)</span>
          </a>
        </div>
      </li>
    </ol>
  );
}

export function OtherPaths() {
  return (
    <a className={styles.textLink} href={LINKS.otherPaths}>
      <span>Alumni, mentors, companies: {OTHER_PATHS} more ways to back a build</span>
      <PixelIcon name="arrow-right" />
    </a>
  );
}

/* ---------- Footer signature ---------- */

export function FooterSignature() {
  return (
    <p className={styles.bigSign}>
      <span className={styles.mono}>Drawn by</span>
      <NameText className={styles.bigName} fallback="your name" />
    </p>
  );
}

/* ---------- Index tabs (nav) ---------- */

const TABS = [
  { id: 'sign', n: '01', label: 'Sign' },
  { id: 'bench', n: '02', label: 'Bench' },
  { id: 'sheet', n: '03', label: 'Sheet' },
  { id: 'thursday', n: '04', label: 'Thursday' },
] as const;

export function IndexTabs() {
  const [active, setActive] = useState<string>('sign');
  useEffect(() => {
    const els = TABS.map((t) => document.getElementById(t.id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.01] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return (
    <nav className={styles.tabs} aria-label="Page index">
      <ol>
        {TABS.map((t) => (
          <li key={t.id}>
            <a href={`#${t.id}`} aria-current={active === t.id ? 'true' : undefined} className={styles.tab}>
              <span className={styles.tabNum}>{t.n}</span>
              <span className={styles.tabLabel}>{t.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export const ORG_LINE = ORG.positioning;
