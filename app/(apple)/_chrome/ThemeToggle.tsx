'use client';

/**
 * Theme control in <LocalNav> (DESIGN.md §9, §13.1): one 44px button that cycles System → Light → Dark.
 * The accessible name says the current theme and what a press does; a visible tooltip repeats the current
 * theme on hover and keyboard focus (Escape hides it). All three icons are in the server HTML and CSS shows
 * the one for <html data-theme-choice>, set by the inline head script, so the icon is right at first paint.
 */
import { useEffect, useState } from 'react';
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';
import { THEME } from './club';
import { THEME_EVENT, THEME_ORDER, readChoice, setChoice, type ThemeChoice } from './theme';
import styles from './chrome.module.css';

const ICON = { size: 20, stroke: 1.5, 'aria-hidden': true } as const;

export function ThemeToggle() {
  const [choice, setState] = useState<ThemeChoice>('system');
  const [tipHidden, setTipHidden] = useState(false);

  useEffect(() => {
    const sync = (): void => setState(readChoice());
    sync();
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  const next = THEME_ORDER[(THEME_ORDER.indexOf(choice) + 1) % THEME_ORDER.length];

  return (
    <button
      type="button"
      className={styles.theme}
      aria-label={`${THEME.label[choice]}. ${THEME.next[choice]}`}
      data-tip-hidden={tipHidden || undefined}
      onClick={() => setChoice(next)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setTipHidden(true);
      }}
      onBlur={() => setTipHidden(false)}
      onPointerLeave={() => setTipHidden(false)}
    >
      <IconSunMoon {...ICON} data-for="system" />
      <IconSun {...ICON} data-for="light" />
      <IconMoon {...ICON} data-for="dark" />
      <span className={styles.themeTip} aria-hidden="true">
        {THEME.label[choice]}
      </span>
    </button>
  );
}
