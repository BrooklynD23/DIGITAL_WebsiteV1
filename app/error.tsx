'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button, Eyebrow } from '@/components/ui'

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
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-xl text-center">
        <Eyebrow>System Fault</Eyebrow>
        <h1 className="mt-4 font-display text-[clamp(40px,7vw,76px)] font-extrabold uppercase leading-[.92] tracking-[-.03em] text-ink">
          Something Went <span className="text-outline">Wrong</span>
          <span className="text-accent">.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={() => reset()}>Try again</Button>
          <Link href="/">
            <Button variant="ghost">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
