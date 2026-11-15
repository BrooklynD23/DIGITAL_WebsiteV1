/**
 * Site theme (DESIGN.md §9): the visitor's choice is 'system' (default), 'light' or 'dark'.
 * <html data-theme-choice> holds the choice (drives the toggle icon). <html data-theme> holds what renders:
 *   'light' = every chapter light; 'dark' = every chapter dark; absent = the designed mix (dark story, light
 *   catalogue). 'system' renders the mix while the OS is light and 'dark' while it is dark.
 * THEME_SCRIPT runs inline in <head> (app/layout.tsx) before first paint, so a stored theme never flashes.
 * worlds.css maps data-theme onto the token sets.
 */
export type ThemeChoice = 'system' | 'light' | 'dark';

export const THEME_KEY = 'r2-theme';
export const THEME_ORDER: readonly ThemeChoice[] = ['system', 'light', 'dark'];
/** Fired on window after the theme changes, so canvas figures can re-read their ink. */
export const THEME_EVENT = 'r2-theme';

/** Inline, dependency-free. Exposes window.__r2Theme(choice) so the toggle and the OS listener share one apply. */
export const THEME_SCRIPT = `(function(){var d=document.documentElement,m=matchMedia('(prefers-color-scheme: dark)'),c='system';try{c=localStorage.getItem('${THEME_KEY}')||'system'}catch(e){}
function a(n){c=n==='light'||n==='dark'?n:'system';var t=c==='system'?(m.matches?'dark':''):c;d.dataset.themeChoice=c;if(t)d.dataset.theme=t;else delete d.dataset.theme;
var k=document.querySelector('meta[name="theme-color"]');if(k)k.content=t==='light'?'#ffffff':'#000000';dispatchEvent(new Event('${THEME_EVENT}'))}
a(c);m.addEventListener('change',function(){if(c==='system')a(c)});window.__r2Theme=a})()`;

declare global {
  interface Window {
    __r2Theme?: (choice: ThemeChoice) => void;
  }
}

/** Read the current choice (client only). */
export function readChoice(): ThemeChoice {
  const c = document.documentElement.dataset.themeChoice;
  return c === 'light' || c === 'dark' ? c : 'system';
}

/** Apply and persist a choice. Storage can throw (private mode, blocked site data); the theme still applies. */
export function setChoice(choice: ThemeChoice): void {
  try {
    if (choice === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    /* not persisted; this page still switches */
  }
  window.__r2Theme?.(choice);
}
