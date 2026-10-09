'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { SystemScreen, systemScreen as c } from './(apple)/_chrome/SystemScreen'
import s from './(apple)/_chrome/site-page.module.css'
import { SYSTEM } from './(apple)/_content/system'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <SystemScreen>
      <h1 className={s.heroTitle}>{SYSTEM.error.title}</h1>
      <p className={s.heroLead}>{SYSTEM.error.body}</p>
      <div className={c.actions}>
        <button type="button" onClick={() => reset()} className={s.button}>
          {SYSTEM.retry}
        </button>
        <Link href={SYSTEM.home.href} className={s.buttonQuiet}>
          {SYSTEM.home.label}
        </Link>
      </div>
    </SystemScreen>
  )
}
