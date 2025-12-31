'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui'

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong
        </h2>
        <p className="text-text-muted mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  )
}
