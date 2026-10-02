'use client';

import { useEffect, useState } from 'react';
import { nameScale } from './NameTag';
import { NAME_MAX, useSign } from './SignProvider';
import { PixelIcon } from './icons';
import { LINKS, MEETING, OTHER_PATHS, OWNERSHIP, WORKFLOW } from './content';
import styles from './f.module.css';

/* ---------- Hero: you write on the tag itself ---------- */

export function Hero() {
  const { name, setName, ready } = useSign();
  const written = name.trim();
  return (
    <>
      <h1 className={styles.srOnly}>Make something worth putting your name on.</h1>
      <div className={styles.thesis}>
        <span className={styles.thesisLine} aria-hidden="true">
          Make something
        </span>
        <span className={styles.thesisLine} aria-hidden="true">
          worth putting
        </span>
        <span className={styles.thesisLine}>
          <span className={`${styles.tag} ${styles.tag_hero}`}>
            <label htmlFor="f-sign" className={styles.tagBand}>
              Built by
            </label>
            <span
              className={styles.tagField}
              data-value={written || 'your name'}
              style={{ ['--name-scale' as string]: nameScale(written.length || 9) }}
            >
              <input
                id="f-sign"
                className={styles.tagInput}
                type="text"
                size={1}
                autoComplete="given-name"
                spellCheck={false}
                maxLength={NAME_MAX}
                placeholder="your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!ready}
                aria-describedby="f-sign-note"
              />
            </span>
          </span>
          <span aria-hidden="true">on.</span>
        </span>
      </div>
      <div className={styles.heroFoot}>
        <p id="f-sign-note" className={styles.signNote}>
          {ready ? (
            <>
              <strong>Write your name on the tag.</strong> It stays in this browser. Nothing is sent.
            </>
          ) : (
            'Writing on the tag needs JavaScript. Everything else on this page works without it.'
          )}
        </p>
        <a className={styles.cta} href="#bench">
          <span>Now put it on a part</span>
          <PixelIcon name="arrow-down" />
        </a>
      </div>
    </>
  );
}

/* ---------- Sheet: the title block, mapped to the real ownership model ---------- */

export function Sheet() {
  const { seat, name } = useSign();
  const owner = name.trim();
  const cells: { k: string; v: string; sub?: string; filled: boolean }[] = [
    { k: 'Record', v: seat ? `${seat.projectCode} · ${seat.projectTitle}` : '______', filled: Boolean(seat) },
    { k: 'Seat', v: seat ? seat.title : '______', filled: Boolean(seat) },
    { k: 'Built by', v: owner || '______', sub: OWNERSHIP[0], filled: Boolean(owner) },
    { k: 'Checked by', v: '______', sub: OWNERSHIP[1], filled: false },
    { k: 'Released at', v: '______', sub: OWNERSHIP[2], filled: false },
    { k: 'Repair plan', v: '______', sub: OWNERSHIP[3], filled: false },
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
      <div className={styles.titleBlock} role="group" aria-label="Title block">
        {cells.map((c) => (
          <div key={c.k} className={styles.tbCell} data-filled={c.filled ? '' : undefined}>
            <span className={styles.mono}>{c.k}</span>
            <span className={styles.tbValue}>{c.v}</span>
            {c.sub && <span className={styles.tbSub}>{c.sub}</span>}
          </div>
        ))}
      </div>
      <p className={styles.footnote}>
        Checked, released and repair plan stay blank until real people sign them. Rules from DG-001&rsquo;s build scope{' '}
        <span className={styles.flag}>[confirm they apply to every build]</span>
      </p>

      <ol className={styles.rail} aria-label="Workflow">
        {WORKFLOW.map((stage, i) => (
          <li key={stage} className={styles.railStep}>
            <span className={styles.mono}>0{i + 1}</span>
            <span className={styles.railName}>{stage}</span>
          </li>
        ))}
      </ol>

      {/* Not a live region: the tray's status line already announces the change once. */}
      <div className={styles.seatDetail}>
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
            Nothing here yet. <a className={styles.inlineLink} href="#bench">Put your tag on a seat</a> and this sheet
            fills in with what that seat owns.
          </p>
        )}
      </div>
    </>
  );
}

/* ---------- Thursday (join) ---------- */

function SignedStatus() {
  const { seat, ready, name } = useSign();
  if (!ready) return <span className={styles.stepState}>Needs JavaScript; skip to step 2.</span>;
  if (seat)
    return (
      <span className={styles.stepState} data-done="">
        <PixelIcon name="check" /> Done: {name.trim() || 'you'} on {seat.projectCode} · {seat.title}
      </span>
    );
  return (
    <a className={`${styles.stepState} ${styles.textLink}`} href="#sign">
      <span>Not yet. Write your name on the tag</span> <PixelIcon name="arrow-right" />
    </a>
  );
}

function SeatCta() {
  const { seatId } = useSign();
  return (
    <a className={styles.cta} href={LINKS.contactFor(seatId)}>
      <span>Take a subsystem</span>
      <PixelIcon name="arrow-right" />
    </a>
  );
}

export function JoinSteps() {
  return (
    <ol className={styles.steps}>
      <li className={styles.step}>
        <span className={styles.stepNum}>1</span>
        <div>
          <h3 className={styles.stepTitle}>Put your name on a part.</h3>
          <SignedStatus />
        </div>
      </li>
      <li className={styles.step}>
        <span className={styles.stepNum}>2</span>
        <div>
          <h3 className={styles.stepTitle}>Tell us the seat.</h3>
          <p className={styles.stepBody}>One short form. The seat comes with you; your name stays here.</p>
          <SeatCta />
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

/* ---------- Footer: the signature, and a closer that changes once you sign ---------- */

export function FooterSignature() {
  const { name, seat } = useSign();
  const written = name.trim();
  let closer = 'Put your name on one.';
  if (written && seat) closer = `${written} · ${seat.title} · ${MEETING.when} · ${MEETING.where}.`;
  else if (written) closer = 'Now put it on one.';
  return (
    <>
      <p className={styles.bigSign}>
        <span className={styles.mono}>Built by</span>
        {written ? (
          <span className={styles.bigName}>{written}</span>
        ) : (
          <span className={styles.bigRule}>
            <span className={styles.srOnly}>unsigned</span>
          </span>
        )}
      </p>
      <p className={styles.closer} aria-live="off">
        {closer}
      </p>
    </>
  );
}

/* ---------- Index tabs (page nav) ---------- */

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
