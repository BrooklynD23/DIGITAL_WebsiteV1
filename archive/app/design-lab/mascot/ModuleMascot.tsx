'use client';

/**
 * "The Module" — a code-drawn SVG mascot for the MASCOT design-lab prototype.
 *
 * Body: a DG-001 subsystem board with 7 edge pins (one per real subsystem).
 * Eyes: the DG-002 Smart Reading glasses. Mouth: an RSVP strip that shows one word at a time.
 *
 * Interaction model adapted from page-mascot 0.1.0 (MIT, Kamran Ahmed): head follows a fine
 * pointer, a poke blinks then pays off, 4 quick pokes go "dizzy", squash honours reduced motion.
 * Here the "sprite cells" are continuous SVG transforms, so there is no raster and no sheet.
 *
 * Decorative only: the root is aria-hidden and holds nothing focusable.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { MascotKey } from './content';
import styles from './mascot.module.css';

type Props = { readonly paused: boolean; readonly reducedMotion: boolean };
type Point = { readonly x: number; readonly y: number };

const VIEW_W = 120;
const VIEW_H = 121;
const LENSES: ReadonlyArray<Point> = [
  { x: 43, y: 54 },
  { x: 77, y: 54 },
];
const LENS_R = 13;
const TRAVEL = 5.2; // max pupil offset, viewBox units
const DEAD_ZONE = 48; // px around the face where the eyes look straight out
const FULL_TRAVEL_AT = 260; // px distance at which pupils reach full travel
const CENTER: Point = { x: 0, y: 0 };

const PIN_COUNT = 7; // Modular Smartphone subsystems (phoneV2.ts)
const PIN_W = 6;
const PIN_STEP_X = 11;
const PIN_TOP = 111;
const PIN_H = 10;
const PIN_X0 = VIEW_W / 2 - ((PIN_COUNT - 1) * PIN_STEP_X + PIN_W) / 2;
const PINS = Array.from({ length: PIN_COUNT }, (_, i) => PIN_X0 + i * PIN_STEP_X);

const RSVP_WORDS = ['one', 'word', 'at', 'a', 'time'];
const MS_PER_WORD = Math.round(60000 / 450); // Smart Reading demo rate: 450 wpm
const PIN_STEP_MS = 60;
const BLINK_MS = 150;
const BLINK_MIN_MS = 3500;
const BLINK_SPREAD_MS = 4000;
const SLEEP_AFTER_MS = 20000;
const BOOP_PAYOFFS = ['REVIEW', 'PASS', 'SIGNED']; // ownership model: review path → test gate → signed
const BOOP_PAYOFF_MS = 120;
const BOOP_END_MS = 900;
const DIZZY_AFTER = 4;
const DIZZY_WINDOW_MS = 1600;
const DIZZY_END_MS = 1100;
const SQUASH_MS = 420;
const SQUASH: Keyframe[] = [
  { transform: 'scale(1, 1)', easing: 'ease-in' },
  { transform: 'scale(1.08, 0.88)', offset: 0.18, easing: 'ease-out' },
  { transform: 'scale(0.96, 1.06)', offset: 0.45, easing: 'ease-in-out' },
  { transform: 'scale(1.02, 0.98)', offset: 0.72, easing: 'ease-in-out' },
  { transform: 'scale(1, 1)' },
];

function traceFor(pinX: number, i: number): string {
  const px = pinX + PIN_W / 2;
  const sx = 34 + (i * 52) / (PIN_COUNT - 1);
  return `M${px} ${PIN_TOP} V105 L${sx} 99 V93`;
}

function mascotKeyOf(target: EventTarget | null): MascotKey | null {
  if (!(target instanceof Element)) return null;
  const host = target.closest<HTMLElement>('[data-mascot]');
  return (host?.dataset.mascot as MascotKey | undefined) ?? null;
}

/** True while the element is on screen and the tab is visible. */
function useOnScreen(ref: React.RefObject<HTMLElement>): boolean {
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === 'visible');
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [ref]);
  return inView && pageVisible;
}

export default function ModuleMascot({ paused, reducedMotion }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const rootRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const sleepTimer = useRef<number>(0);
  const lastPointer = useRef<Point | null>(null);
  const boops = useRef({ count: 0, at: 0 });

  const [pupil, setPupil] = useState<Point>(CENTER);
  const [blinking, setBlinking] = useState(false);
  const [sleepy, setSleepy] = useState(false);
  const [wide, setWide] = useState(false);
  const [dizzy, setDizzy] = useState(false);
  const [strip, setStrip] = useState<string | null>(null);
  const [pinsLit, setPinsLit] = useState(0);

  const onScreen = useOnScreen(rootRef);
  const active = onScreen && !paused;

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const resetFace = useCallback(() => {
    clearTimers();
    setPinsLit(0);
    setWide(false);
    setDizzy(false);
    setStrip(null);
  }, [clearTimers]);

  const wake = useCallback(() => {
    setSleepy(false);
    window.clearTimeout(sleepTimer.current);
    sleepTimer.current = window.setTimeout(() => setSleepy(true), SLEEP_AFTER_MS);
  }, []);

  // Paused or off screen: freeze to a neutral face, drop every timer.
  useEffect(() => {
    if (active) {
      wake();
      return () => window.clearTimeout(sleepTimer.current);
    }
    resetFace();
    setPupil(CENTER);
    setBlinking(false);
    setSleepy(false);
    window.clearTimeout(sleepTimer.current);
    return undefined;
  }, [active, resetFace, wake]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Eyes follow a fine pointer, and keyboard focus (so keyboard users get the same reaction).
  useEffect(() => {
    if (!active) return undefined;
    let raf = 0;
    const aim = () => {
      raf = 0;
      const el = rootRef.current;
      const p = lastPointer.current;
      if (!el || !p) return;
      const box = el.getBoundingClientRect();
      const dx = p.x - (box.left + box.width / 2);
      const dy = p.y - (box.top + box.height * 0.45);
      const dist = Math.hypot(dx, dy);
      const k = dist < DEAD_ZONE ? 0 : (TRAVEL * Math.min(1, dist / FULL_TRAVEL_AT)) / dist;
      const x = Math.round(dx * k * 4) / 4;
      const y = Math.round(dy * k * 4) / 4;
      setPupil((prev) => (prev.x === x && prev.y === y ? prev : { x, y }));
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(aim);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      wake();
      schedule();
    };
    const onFocus = (e: FocusEvent) => {
      if (!(e.target instanceof HTMLElement)) return;
      const r = e.target.getBoundingClientRect();
      lastPointer.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      wake();
      schedule();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('focusin', onFocus);
    schedule();
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('focusin', onFocus);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [active, wake]);

  // Idle blink: only while visible, unpaused, awake and motion is allowed. No rAF loop.
  useEffect(() => {
    if (!active || reducedMotion || sleepy) return undefined;
    let wait = 0;
    let close = 0;
    const loop = () => {
      wait = window.setTimeout(() => {
        setBlinking(true);
        close = window.setTimeout(() => {
          setBlinking(false);
          loop();
        }, BLINK_MS);
      }, BLINK_MIN_MS + Math.random() * BLINK_SPREAD_MS);
    };
    loop();
    return () => {
      window.clearTimeout(wait);
      window.clearTimeout(close);
    };
  }, [active, reducedMotion, sleepy]);

  const react = useCallback(
    (key: MascotKey | null) => {
      resetFace();
      if (key === 'dg-001') {
        setStrip('DG-001');
        if (reducedMotion) setPinsLit(PIN_COUNT);
        else PINS.forEach((_, i) => later((i + 1) * PIN_STEP_MS, () => setPinsLit(i + 1)));
      } else if (key === 'dg-002') {
        if (reducedMotion) {
          setStrip('DG-002');
          return;
        }
        RSVP_WORDS.forEach((w, i) => later(i * MS_PER_WORD, () => setStrip(w)));
        later(RSVP_WORDS.length * MS_PER_WORD + 160, () => setStrip('DG-002'));
      } else if (key === 'join') {
        setWide(true);
        setStrip('THU 6PM');
      }
    },
    [later, reducedMotion, resetFace],
  );

  // Page events → reactions. Hover (mouse/pen) and keyboard focus both count.
  useEffect(() => {
    if (!active) return undefined;
    let current: MascotKey | null = null;
    const update = (key: MascotKey | null) => {
      if (key === current) return;
      current = key;
      react(key);
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') update(mascotKeyOf(e.target));
    };
    const onFocusIn = (e: FocusEvent) => update(mascotKeyOf(e.target));
    const onFocusOut = (e: FocusEvent) => {
      if (!e.relatedTarget) update(null);
    };
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, [active, react]);

  const boop = (e: React.PointerEvent) => {
    if (paused || e.button !== 0 || e.pointerType === 'touch') return;
    wake();
    resetFace();
    const now = Date.now();
    const b = boops.current;
    b.count = now - b.at < DIZZY_WINDOW_MS ? b.count + 1 : 1;
    b.at = now;
    if (b.count >= DIZZY_AFTER) {
      b.count = 0;
      setDizzy(true);
      setStrip('RETEST');
      later(DIZZY_END_MS, () => {
        setDizzy(false);
        setStrip(null);
      });
    } else {
      const payoff = BOOP_PAYOFFS[(b.count - 1) % BOOP_PAYOFFS.length];
      setBlinking(true);
      later(BOOP_PAYOFF_MS, () => {
        setBlinking(false);
        setStrip(payoff);
      });
      later(BOOP_END_MS, () => setStrip(null));
    }
    if (!reducedMotion) squashRef.current?.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
  };

  const lid = blinking ? 1 : sleepy ? 0.55 : 0;
  const pupilR = wide ? 3.6 : 4.4;

  return (
    <div
      ref={rootRef}
      className={styles.mascot}
      aria-hidden="true"
      data-mascot-root=""
      data-paused={paused ? 'true' : 'false'}
      onPointerDown={boop}
    >
      <div ref={squashRef} className={styles.squash}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={styles.svg} focusable="false">
          <defs>
            {LENSES.map((l, i) => (
              <clipPath id={`${uid}-lens-${i}`} key={i}>
                <circle cx={l.x} cy={l.y} r={LENS_R} />
              </clipPath>
            ))}
          </defs>

          {PINS.map((x, i) => (
            <rect
              key={x}
              x={x}
              y={PIN_TOP}
              width={PIN_W}
              height={PIN_H}
              rx={1}
              className={i < pinsLit ? styles.pinLit : styles.pin}
            />
          ))}
          <rect x={10} y={16} width={100} height={96} rx={6} className={styles.board} />
          <circle cx={19} cy={25} r={2.6} className={styles.hole} />
          <circle cx={101} cy={25} r={2.6} className={styles.hole} />
          <text x={60} y={28} textAnchor="middle" className={styles.silk}>
            DIGITAL
          </text>
          {PINS.map((x, i) => (
            <path key={x} d={traceFor(x, i)} className={styles.trace} />
          ))}

          <path d="M30 51 L20 47" className={styles.frame} />
          <path d="M90 51 L100 47" className={styles.frame} />
          <path d="M56 52 Q60 47 64 52" className={styles.frame} />

          {LENSES.map((l, i) => {
            const off = dizzy ? { x: i === 0 ? TRAVEL : -TRAVEL, y: 0 } : pupil;
            return (
              <g key={i}>
                <circle cx={l.x} cy={l.y} r={LENS_R} className={styles.lens} />
                <g clipPath={`url(#${uid}-lens-${i})`}>
                  <g className={styles.pupilMove} style={{ transform: `translate(${off.x}px, ${off.y}px)` }}>
                    <circle cx={l.x} cy={l.y} r={pupilR} className={styles.pupil} />
                    <circle cx={l.x - 1.4} cy={l.y - 1.6} r={1.1} className={styles.glint} />
                  </g>
                  <rect
                    x={l.x - LENS_R}
                    y={l.y - LENS_R}
                    width={LENS_R * 2}
                    height={LENS_R * 2}
                    className={styles.lid}
                    style={{ transform: `scaleY(${lid})` }}
                  />
                </g>
                <circle cx={l.x} cy={l.y} r={LENS_R} className={styles.lensRim} />
              </g>
            );
          })}

          <rect x={28} y={76} width={64} height={17} rx={2} className={styles.strip} />
          <text x={60} y={87.4} textAnchor="middle" className={strip ? styles.stripText : styles.stripIdle}>
            {strip ?? '—'}
          </text>
        </svg>
      </div>
    </div>
  );
}
