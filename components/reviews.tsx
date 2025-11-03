"use client"
import * as React from 'react'
import { Review } from '@/lib/types'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { useToast } from './ui/toast'

function useLocalReviews(placeId: string) {
  const [local, setLocal] = React.useState<Review[]>([])
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('localReviews')
    const map: Record<string, Review[]> = raw ? JSON.parse(raw) : {}
    setLocal(map[placeId] ?? [])
  }, [placeId])
  const save = (r: Review) => {
    const raw = localStorage.getItem('localReviews')
    const map: Record<string, Review[]> = raw ? JSON.parse(raw) : {}
    const list = [...(map[placeId] ?? []), r]
    map[placeId] = list
    localStorage.setItem('localReviews', JSON.stringify(map))
    setLocal(list)
  }
  return { local, save }
}

export function ReviewList({ base, placeId }: { base: Review[]; placeId: string }) {
  const { local } = useLocalReviews(placeId)
  const all = [...base, ...local].sort((a,b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  const avg = all.length ? (all.reduce((s,r)=>s+r.rating,0)/all.length) : 0
  return (
    <div className="space-y-4">
      <div className="font-semibold">{avg.toFixed(1)}★ average from {all.length} review{all.length!==1?'s':''}</div>
      <div className="space-y-3">
        {all.map(r => (
          <div key={r.id} className="card p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">{r.title} · {r.rating}★</div>
              <div className="text-white/60">{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
            <p className="text-sm text-white/80">{r.body}</p>
            {r.author && <div className="text-xs text-white/60">— {r.author}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReviewForm({ placeId, onAdd }: { placeId: string; onAdd: (r: Review) => void }) {
  const { notify } = useToast()
  const [rating, setRating] = React.useState(5)
  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')
  const [author, setAuthor] = React.useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating || !title || !body) return
    const review: Review = { id: String(Date.now()), placeId, rating: rating as any, title, body, author, createdAt: new Date().toISOString() }
    const raw = localStorage.getItem('localReviews')
    const map: Record<string, Review[]> = raw ? JSON.parse(raw) : {}
    map[placeId] = [...(map[placeId] ?? []), review]
    localStorage.setItem('localReviews', JSON.stringify(map))
    onAdd(review)
    notify({ title: 'Thanks for sharing a review!' })
    setTitle(''); setBody(''); setAuthor('')
  }

  return (
    <form onSubmit={submit} className="card p-4 space-y-3" aria-labelledby="review-form">
      <div className="font-semibold" id="review-form">Add a review</div>
      <label className="text-sm">Rating
        <Input type="number" min={1} max={5} value={rating} onChange={(e)=>setRating(Number(e.target.value))} aria-label="Rating 1 to 5" />
      </label>
      <label className="text-sm">Title
        <Input value={title} onChange={(e)=>setTitle(e.target.value)} aria-label="Title" />
      </label>
      <label className="text-sm">Your review
        <Textarea value={body} onChange={(e)=>setBody(e.target.value)} aria-label="Body" />
      </label>
      <label className="text-sm">Name (optional)
        <Input value={author} onChange={(e)=>setAuthor(e.target.value)} aria-label="Name" />
      </label>
      <Button type="submit">Submit</Button>
      <p className="text-xs text-white/60">MVP preview — in production we would store reviews on the server.</p>
    </form>
  )
}

