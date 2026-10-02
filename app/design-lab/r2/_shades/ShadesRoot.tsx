'use client';

/**
 * Page root for both SHADES worlds: owns the "more spacing" reader setting and the data-js flag.
 * - data-spacing="standard|more" drives the reading tokens in each world's CSS (page-wide).
 * - data-js appears after hydration, so no-JS visitors get the static (fully drawn) figures.
 * The setting is remembered per browser (localStorage, wrapped in try/catch); it defaults to standard.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const KEY = 'r2-shades-spacing';

interface SpacingState {
  readonly more: boolean;
  readonly toggle: () => void;
}

const SpacingContext = createContext<SpacingState>({ more: false, toggle: () => undefined });

export function useSpacing(): SpacingState {
  return useContext(SpacingContext);
}

export function ShadesRoot({ className, children }: { readonly className: string; readonly children: ReactNode }) {
  const [more, setMore] = useState(false);
  const [js, setJs] = useState(false);

  useEffect(() => {
    setJs(true);
    try {
      if (window.localStorage.getItem(KEY) === 'more') setMore(true);
    } catch {
      // Storage blocked (private mode, sandbox): the setting simply is not remembered.
    }
  }, []);

  const toggle = useCallback(() => {
    setMore((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(KEY, next ? 'more' : 'standard');
      } catch {
        // Not remembered; the page still applies it.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ more, toggle }), [more, toggle]);

  return (
    <SpacingContext.Provider value={value}>
      <div className={className} data-spacing={more ? 'more' : 'standard'} data-js={js ? '' : undefined}>
        {children}
      </div>
    </SpacingContext.Provider>
  );
}

/** The reader setting. A real toggle button (aria-pressed), 44px target; worlds style it via className. */
export function SpacingToggle({
  className,
  label,
  stateText,
}: {
  readonly className?: string;
  readonly label: string;
  /** Visible state words, e.g. { on: 'More', off: 'Standard' }. Omit to show the label only. */
  readonly stateText?: { readonly on: string; readonly off: string };
}) {
  const { more, toggle } = useSpacing();
  return (
    <button type="button" className={className} aria-pressed={more} onClick={toggle} data-on={more ? 'true' : 'false'}>
      <span data-part="label">{label}</span>
      {stateText ? <span data-part="state">{more ? stateText.on : stateText.off}</span> : null}
    </button>
  );
}
