import type { Metadata } from 'next';
import Link from 'next/link';
import { SystemScreen } from './_chrome/SystemScreen';
import s from './_chrome/site-page.module.css';
import { SYSTEM } from './_content/system';

export const movedMetadata: Metadata = {
  title: 'Moved — DIGITAL @ Cal Poly Pomona',
  robots: { index: false },
};

/**
 * Static-export-safe redirect stub: a client-side `location.replace` plus a visible fallback link for when JS
 * never runs. One line, one link, on the black system screen.
 */
export function RedirectStub({ to, label }: { readonly to: string; readonly label: string }) {
  return (
    <SystemScreen>
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(to)});` }} />
      <h1 className={s.srOnly}>{SYSTEM.moved.title}</h1>
      <p className={s.heroLead} style={{ marginTop: 0 }}>
        {SYSTEM.moved.lead}{' '}
        <Link href={to} className={s.textLink}>
          {label}
        </Link>
        .
      </p>
    </SystemScreen>
  );
}
