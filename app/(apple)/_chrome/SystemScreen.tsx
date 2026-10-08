/**
 * SystemScreen: one black, centred screen for pages that have no chrome: 404, error, global-error, redirect stubs.
 * It carries its own world shell (the same classes app/(apple)/layout.tsx applies), so it also works from the app
 * root, outside the (apple) route group. Renders the page's single <main>; put the h1, one sentence and the
 * actions inside. Classes for children: site-page.module.css (.heroTitle, .heroLead, .button, .buttonQuiet,
 * .textLink) plus `actions` from system-screen.module.css.
 */
import type { ReactNode } from 'react';
import '../_system/tokens/worlds.css';
import { fontApple } from '../_system/fonts';
import c from './system-screen.module.css';

export { default as systemScreen } from './system-screen.module.css';

export function SystemScreen({ children }: { readonly children: ReactNode }) {
  return (
    <div className={`world-apple ${fontApple}`} data-world="apple" data-tone="dark">
      <main className={c.screen}>{children}</main>
    </div>
  );
}
