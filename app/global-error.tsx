'use client'

import { SystemScreen, systemScreen as c } from './(apple)/_chrome/SystemScreen'
import s from './(apple)/_chrome/site-page.module.css'
import { SYSTEM } from './(apple)/_content/system'

/** Replaces the root layout when it fails, so it brings its own <html>/<body>; the world shell comes from SystemScreen. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#000' }}>
        <SystemScreen>
          <h1 className={s.heroTitle}>{SYSTEM.error.title}</h1>
          <p className={s.heroLead}>{SYSTEM.error.body}</p>
          <div className={c.actions}>
            <button type="button" onClick={() => reset()} className={s.button}>
              {SYSTEM.retry}
            </button>
            {/* plain anchor: a full reload is the point when the root layout failed */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href={SYSTEM.home.href} className={s.buttonQuiet}>
              {SYSTEM.home.label}
            </a>
          </div>
        </SystemScreen>
      </body>
    </html>
  )
}
