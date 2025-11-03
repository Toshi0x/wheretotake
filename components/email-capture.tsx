"use client"
import * as React from 'react'
import { useToast } from './ui/toast'
import { track } from '@/lib/utils'

export default function EmailCapture() {
  const { notify } = useToast()
  const [email, setEmail] = React.useState('')
  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify({ title: 'Enter a valid email' })
      return
    }
    notify({ title: 'Subscribed. See you Friday!' })
    track('emailCapture', { email })
    setEmail('')
  }
  return (
    <form onSubmit={submit} className="flex gap-2 max-w-md">
      <input aria-label="Email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 px-3" />
      <button className="h-11 px-5 rounded-2xl bg-[hsl(var(--accent))] text-black font-semibold">Subscribe</button>
    </form>
  )
}

