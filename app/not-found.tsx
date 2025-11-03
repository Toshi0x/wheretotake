import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-white/70">This page isn’t available. Here’s a placeholder instead.</p>
      <Link href="/" className="inline-block rounded-2xl bg-[hsl(var(--accent))] text-black px-4 py-2">Go home</Link>
    </div>
  )
}

