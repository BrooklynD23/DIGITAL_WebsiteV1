'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-studio text-ink">
        <main className="flex min-h-screen items-center justify-center px-4 py-24">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-mono text-[12px] uppercase tracking-[.22em] text-accent">
              System Fault
            </p>
            <h1 className="mt-4 font-display text-[clamp(40px,7vw,76px)] font-extrabold uppercase leading-[.92] tracking-[-.03em] text-ink">
              Something Went{' '}
              <span className="[-webkit-text-stroke:2px_var(--ink)] text-transparent">Wrong</span>
              <span className="text-accent">.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-ink-soft">
              A critical error occurred. Please try again.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded border-[1.5px] border-ink bg-ink px-[26px] py-4 font-display text-sm font-semibold uppercase tracking-[.04em] text-studio transition-[transform,background-color,border-color] duration-200 ease-studio hover:-translate-y-0.5 hover:border-accent hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-studio"
              >
                Try again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
