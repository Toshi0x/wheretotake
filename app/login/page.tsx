"use client"
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    const user = { name, email }
    if (typeof window !== 'undefined') {
      localStorage.setItem('signedIn', 'true')
      localStorage.setItem('user', JSON.stringify(user))
    }
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={submit} className="card p-4 space-y-3" aria-label="Login form">
        <label className="text-sm">Name (optional)
          <Input value={name} onChange={(e)=>setName(e.target.value)} aria-label="Name" />
        </label>
        <label className="text-sm">Email
          <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} aria-label="Email" required />
        </label>
        <Button type="submit">Continue</Button>
      </form>
    </div>
  )
}

