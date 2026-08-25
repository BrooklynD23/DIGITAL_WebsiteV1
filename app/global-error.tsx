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
      <body
        style={{
          margin: 0,
          background: '#F7F6F2',
          color: '#111311',
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        }}
      >
        {/* Self-contained inline tokens — global-error renders without globals.css */}
        <main
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '96px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 576, margin: '0 auto' }}>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                letterSpacing: '.24em',
                textTransform: 'uppercase',
                color: '#5A615B',
              }}
            >
              System fault
            </p>
            <h1
              style={{
                marginTop: 10,
                fontSize: 'clamp(34px, 6vw, 58px)',
                fontWeight: 500,
                lineHeight: 1.14,
                letterSpacing: '-0.01em',
              }}
            >
              Something went wrong.
            </h1>
            <p style={{ margin: '10px auto 0', maxWidth: 448, fontSize: 13, lineHeight: 1.75, color: '#5A615B' }}>
              A critical error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                marginTop: 28,
                borderRadius: 2,
                border: 'none',
                background: '#111311',
                color: '#F7F6F2',
                padding: '11px 24px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10.5,
                letterSpacing: '.12em',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
