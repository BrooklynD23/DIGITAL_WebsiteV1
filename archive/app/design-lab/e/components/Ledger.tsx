'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Plus, X } from 'lucide-react';
import type { LedgerEntry } from '../content';
import { getLenis, wakeLenis } from './SmoothScroll';
import { OpenChip, Pending } from './Chips';
import s from '../e.module.css';

const SPRING = { type: 'spring', stiffness: 420, damping: 40, mass: 0.9 } as const;
const NAV_OFFSET = -72;

interface LedgerProps {
  readonly entries: readonly LedgerEntry[];
  readonly asOf: string | null;
}

function RowContent({ entry }: { readonly entry: LedgerEntry }) {
  return (
    <>
      <span className={s.rowIdCell}>
        <motion.span layoutId={`id-${entry.id}`} className={s.rowId}>
          {entry.code}
        </motion.span>
      </span>
      <span className={s.rowMain}>
        <motion.span layoutId={`title-${entry.id}`} className={s.rowTitle}>
          {entry.title}
        </motion.span>
        <motion.span layout="position" className={s.rowLine}>
          {entry.line}
        </motion.span>
        <motion.span layout="position" className={s.rowStage}>
          {entry.stage}
        </motion.span>
      </span>
      <motion.span layout="position" className={s.rowSide}>
        <motion.span layoutId={`status-${entry.id}`} className={s.status} data-kind={entry.status}>
          {entry.statusLabel}
        </motion.span>
        <span className={s.outcomeTag}>{entry.outcomeShort}</span>
      </motion.span>
      <motion.span layout="position" className={s.rowIcon} aria-hidden="true">
        <Plus size={20} strokeWidth={1.5} />
      </motion.span>
    </>
  );
}

/**
 * Hero artifact: the build ledger. Without JS each row is a link to its case study (or contact path).
 * With JS a row opens a case brief that morphs out of the row via shared layoutIds (motion.dev).
 */
export function Ledger({ entries, asOf }: LedgerProps) {
  const [enhanced, setEnhanced] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const pendingScroll = useRef<string | null>(null);

  useEffect(() => setEnhanced(true), []);

  const close = useCallback(
    (scrollTo?: string) => {
      const id = openId;
      setOpenId(null);
      if (scrollTo) {
        pendingScroll.current = scrollTo;
      } else if (id) {
        requestAnimationFrame(() => triggers.current[id]?.focus({ preventScroll: true }));
      }
    },
    [openId],
  );

  /** Runs after the brief has fully morphed back, so Lenis has been restarted. */
  const onExitComplete = useCallback(() => {
    const href = pendingScroll.current;
    pendingScroll.current = null;
    if (!href) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    // Defer one tick: the brief's cleanup (restore overflow, lenis.start) commits after this callback.
    window.setTimeout(() => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: NAV_OFFSET, force: true, duration: 0.9 });
        wakeLenis();
      }
      else target.scrollIntoView({ block: 'start' });
      target.querySelector<HTMLElement>('[data-case-heading]')?.focus({ preventScroll: true });
      history.replaceState(null, '', href);
    }, 30);
  }, []);

  const open = openId ? entries.find((e) => e.id === openId) ?? null : null;

  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      <LayoutGroup id="ledger">
        <section className={s.ledger} aria-labelledby="ledger-title">
          <div className={s.ledgerHead}>
            <h2 id="ledger-title" className={s.ledgerTitle}>
              Build ledger
            </h2>
            <span className={s.ledgerAsOf}>{asOf ? `As of ${asOf}` : 'Ledger date pending'}</span>
          </div>
          <div className={`${s.ledgerCols} ${s.mono}`} aria-hidden="true">
            <span>ID</span>
            <span>Build</span>
            <span>Status</span>
            <span />
          </div>
          <ul className={s.ledgerList}>
            {entries.map((entry, i) => (
              <li
                key={entry.id}
                className={`${s.ledgerItem} ${s.post}`}
                style={{ '--i': i } as CSSProperties}
              >
                {enhanced ? (
                  <motion.button
                    type="button"
                    layoutId={`card-${entry.id}`}
                    ref={(el) => {
                      triggers.current[entry.id] = el;
                    }}
                    className={`${s.row} ${entry.status === 'open' ? s.rowOpen : ''}`}
                    aria-haspopup="dialog"
                    aria-expanded={openId === entry.id}
                    onClick={() => setOpenId(entry.id)}
                    style={{ borderRadius: 0 }}
                  >
                    <RowContent entry={entry} />
                  </motion.button>
                ) : (
                  <a href={entry.href} className={`${s.row} ${entry.status === 'open' ? s.rowOpen : ''}`}>
                    <RowContent entry={entry} />
                  </a>
                )}
              </li>
            ))}
          </ul>
          <ul className={s.ledgerLegend} aria-label="Status key">
            <li>
              <span className={s.status} data-kind="active">Active</span> building now
            </li>
            <li>
              <span className={s.status} data-kind="program">Program</span> serves every build
            </li>
            <li>
              <span className={s.status} data-kind="open">Open slot</span> no owner yet
            </li>
          </ul>
        </section>
        <AnimatePresence onExitComplete={onExitComplete}>
          {open ? <Brief key={open.id} entry={open} onClose={close} /> : null}
        </AnimatePresence>
      </LayoutGroup>
    </MotionConfig>
  );
}

interface BriefProps {
  readonly entry: LedgerEntry;
  readonly onClose: (scrollTo?: string) => void;
}

function Brief({ entry, onClose }: BriefProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `brief-title-${entry.id}`;

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const lenis = getLenis();
    lenis?.stop();
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, []);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !sheetRef.current) return;
    const focusables = sheetRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const goToCase = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!entry.href.startsWith('#')) return;
    event.preventDefault();
    onClose(entry.href);
  };

  return (
    <>
      <motion.div
        className={s.scrim}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
        onClick={() => onClose()}
        aria-hidden="true"
      />
      <div className={s.sheetWrap}>
        <motion.div
          ref={sheetRef}
          layoutId={`card-${entry.id}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={s.sheet}
          onKeyDown={onKeyDown}
          style={{ borderRadius: 4 }}
        >
          <div className={s.sheetHead}>
            <div>
              <motion.span layoutId={`id-${entry.id}`} className={s.rowId}>
                {entry.code}
              </motion.span>
              <div>
                <motion.h3 layoutId={`title-${entry.id}`} id={titleId} className={s.sheetTitle}>
                  {entry.title}
                </motion.h3>
              </div>
            </div>
            <button ref={closeRef} type="button" className={s.sheetClose} onClick={() => onClose()} aria-label="Close brief">
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <motion.div
            className={s.sheetBody}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.14, duration: 0.24 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <p className={s.lead} style={{ maxWidth: '52ch' }}>
              {entry.line}
            </p>
            <dl className={s.sheetGrid}>
              <div className={s.sheetRow}>
                <dt>Status</dt>
                <dd>
                  <motion.span layoutId={`status-${entry.id}`} className={s.status} data-kind={entry.status}>
                    {entry.statusLabel}
                  </motion.span>
                </dd>
              </div>
              {entry.problem ? (
                <div className={s.sheetRow}>
                  <dt>{entry.status === 'program' ? 'Learn' : 'Problem'}</dt>
                  <dd>{entry.problem}</dd>
                </div>
              ) : null}
              <div className={s.sheetRow}>
                <dt>Stage</dt>
                <dd>{entry.stage}</dd>
              </div>
              <div className={s.sheetRow}>
                <dt>Outcome</dt>
                <dd>
                  {entry.status === 'open' ? (
                    <OpenChip href={entry.href}>{entry.outcome}</OpenChip>
                  ) : (
                    <Pending>{entry.outcome}</Pending>
                  )}
                </dd>
              </div>
              {entry.disciplines.length > 0 ? (
                <div className={s.sheetRow}>
                  <dt>Needs</dt>
                  <dd>
                    <ul className={s.chips} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {entry.disciplines.map((d) => (
                        <li key={d} className={s.chip}>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className={s.sheetActions}>
              <a href={entry.href} className={s.btnPrimary} onClick={goToCase}>
                {entry.hrefLabel}
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </a>
              {entry.route ? (
                <a href={entry.route} className={s.btnGhost}>
                  Current project page
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
