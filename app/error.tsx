"use client"
import * as React from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-white/70">We’re showing a friendly placeholder instead of an error.</p>
      <button onClick={() => reset()} className="inline-block rounded-2xl bg-[hsl(var(--accent))] text-black px-4 py-2">Try again</button>
    </div>
  )
}

