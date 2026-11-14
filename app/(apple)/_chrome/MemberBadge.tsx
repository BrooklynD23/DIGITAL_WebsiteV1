'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { IconBrain, IconDeviceMobile, IconEyeglass2, type Icon } from '@tabler/icons-react';
import { BADGE } from './club';
import s from './member-badge.module.css';

export interface BadgeRole {
  readonly name: string;
  /** Per-role project (used when the badge has no single `project`). */
  readonly project?: string;
}

/** Team marks: Tabler line icons, same set and stroke as the footer socials (DESIGN §13.3). */
const TEAM_ICONS: Record<string, Icon> = { SIDEKICK: IconDeviceMobile, SHADES: IconEyeglass2, BRAIN: IconBrain };

const TYPE_MS = 70;
const FADE_MS = 240;
const FLARE_MS = 650;
const TILT_DEG = 8;
const HUE_STEP = 70;

const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Chrome member badge (Head Designer exception 2026-11-12, DESIGN §6 / §11 / §20): brushed-chrome clip card with a
 * holographic film that follows the pointer and a tilt of at most 8°. The placeholder name types once on entry.
 * Click / Enter / Space: a 900ms light sweep, the film flares and shifts hue, the next open role shows (announced
 * in a polite live region). Reduced motion: no tilt, sweep or flare; a press still advances the role.
 * Pointer moves write CSS variables on the element, not React state (DESIGN §16).
 */
export function MemberBadge({ roles, project }: { readonly roles: readonly BadgeRole[]; readonly project?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const hue = useRef(0);
  const timers = useRef<number[]>([]);
  const [typed, setTyped] = useState(BADGE.name.length); // full text until the effect starts the animation (SSR / reduced motion)
  const [i, setI] = useState(0);
  const [faded, setFaded] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Type the placeholder name once, the first time the badge is on screen.
  useEffect(() => {
    const el = ref.current;
    const pending = timers.current;
    if (!el || reducedMotion()) return undefined;
    const type = (n: number): void => {
      setTyped(n);
      if (n < BADGE.name.length) pending.push(window.setTimeout(() => type(n + 1), TYPE_MS));
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      type(0);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      pending.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const setLight = (x: number, y: number, tilt: boolean): void => {
    const st = ref.current?.style;
    if (!st) return;
    st.setProperty('--mx', `${x * 100}%`);
    st.setProperty('--my', `${y * 100}%`);
    st.setProperty('--ry', tilt ? `${(x - 0.5) * 2 * TILT_DEG}deg` : '0deg');
    st.setProperty('--rx', tilt ? `${(0.5 - y) * 2 * TILT_DEG}deg` : '0deg');
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>): void => {
    if (reducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.dataset.live = '';
    setLight((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, true);
  };

  const onLeave = (): void => {
    delete ref.current?.dataset.live;
    setLight(0.5, 0.5, false);
  };

  const onPress = (): void => {
    const el = ref.current;
    if (!el || roles.length < 2) return;
    setPressed(true);
    if (reducedMotion()) {
      setI((n) => (n + 1) % roles.length);
      return;
    }
    setFaded(true);
    timers.current.push(
      window.setTimeout(() => {
        setI((n) => (n + 1) % roles.length);
        setFaded(false);
      }, FADE_MS),
    );
    hue.current = (hue.current + HUE_STEP) % 360;
    el.style.setProperty('--hue', `${hue.current}deg`);
    el.style.setProperty('--shine', '0.95');
    el.removeAttribute('data-flash');
    void el.offsetWidth; // restart the sweep animation
    el.setAttribute('data-flash', '');
    timers.current.push(window.setTimeout(() => el.style.removeProperty('--shine'), FLARE_MS));
  };

  const role = roles[i] ?? roles[0];
  const team = project ?? role?.project;
  const TeamIcon = team ? TEAM_ICONS[team] : undefined;
  const label = `${BADGE.label} ${roles.map((r) => (project ? r.name : [r.project, r.name].filter(Boolean).join(': '))).join(', ')}. ${BADGE.press}`;
  const fade = { opacity: faded ? 0 : 1 };

  return (
    <div className={s.tilt}>
      <button
        ref={ref}
        type="button"
        className={s.badge}
        aria-label={label}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={onPress}
      >
        <span className={s.holo} aria-hidden="true" />
        <span className={s.spec} aria-hidden="true" />
        <span className={s.sweep} aria-hidden="true" />
        <span className={s.slot} aria-hidden="true" />
        <span className={s.body} aria-hidden="true">
          <span className={s.you}>{BADGE.name.slice(0, typed)}</span>
          <span className={s.role} style={fade}>
            {role?.name}
          </span>
          <span className={s.foot}>
            <span className={s.org}>{BADGE.org}</span>
            {team && (
              <span className={s.team} style={project ? undefined : fade}>
                {TeamIcon && <TeamIcon size={16} stroke={1.5} />}
                {team}
              </span>
            )}
          </span>
        </span>
      </button>
      <span className={s.srOnly} aria-live="polite">
        {pressed ? [team, role?.name].filter(Boolean).join(': ') : ''}
      </span>
    </div>
  );
}
