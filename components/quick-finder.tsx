"use client"
import * as React from 'react'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog'
import { plan, type Itinerary } from '@/lib/planner'
import { Vibe } from '@/lib/types'
import ItineraryCard from './itinerary-card'
import { useToast } from './ui/toast'
import { track } from '@/lib/utils'
import Link from 'next/link'

const vibesList: { key: Vibe; label: string }[] = [
  { key: 'romantic', label: 'romantic' },
  { key: 'low_key', label: 'low-key' },
  { key: 'playful', label: 'playful' },
  { key: 'bougie', label: 'bougie' },
  { key: 'hidden_gem', label: 'hidden gem' },
  { key: 'rainy_safe', label: 'rainy-safe' },
  { key: 'outdoors', label: 'outdoors' }
]

export default function QuickFinder() {
  const { notify } = useToast()
  const [max, setMax] = React.useState<string>('')
  const today = new Date()
  const defaultDate = new Date(today.getTime() + 14*24*60*60*1000)
  const [date, setDate] = React.useState<string>(defaultDate.toISOString().slice(0,10))
  const [area, setArea] = React.useState('')
  const [when, setWhen] = React.useState<'tonight'|'weekend'|'daytime'>('tonight')
  const [vibes, setVibes] = React.useState<Vibe[]>(['low_key'])
  const [open, setOpen] = React.useState(false)
  const [its, setIts] = React.useState<Itinerary[]|null>(null)
  const maxDate = new Date(today.getTime() + 60*24*60*60*1000)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const input = {
      dateISO: date,
      budgetMax: max ? Number(max) : undefined,
      area: area || undefined,
      vibes,
      when,
    }
    const out = await plan(input)
    setIts(out)
    setOpen(true)
    track('got3options')
  }

  function toggle(v: Vibe) {
    setVibes(prev => prev.includes(v) ? prev.filter(x=>x!==v) : [...prev, v])
  }

  function copyPlan() {
    if (!its?.length) return
    const first = its[0]
    const text = first.steps.map((s,i)=>`${i+1}. ${s.place.name} (${s.arriveAt}-${s.departAt})`).join('\n')
    navigator.clipboard.writeText(text)
    notify({ title: 'Plan copied to clipboard' })
  }

  return (
    <div className="card p-5" data-testid="quick-finder">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3" aria-label="Quick finder form">
        <fieldset className="text-sm md:col-span-3">
          <legend className="mb-2 block">Budget (£, per person)</legend>
          <div className="grid grid-cols-1 gap-3" aria-describedby="budgetHelp">
            <label className="text-sm" htmlFor="budget">Budget
              <Input id="budget" data-testid="budget" inputMode="numeric" value={max} onChange={e=>setMax(e.target.value)} placeholder="Any" aria-label="Budget" />
            </label>
          </div>
          <small id="budgetHelp" className="mt-1 block text-textDim">We'll use per-person price.</small>
        </fieldset>
        <label className="text-sm" htmlFor="date">Date
          <Input id="date" type="date" min={today.toISOString().slice(0,10)} max={maxDate.toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} aria-label="Date" />
        </label>
        <label className="text-sm" htmlFor="area">Area / Postcode
          <Input id="area" value={area} onChange={(e)=>setArea(e.target.value)} placeholder="e.g., Soho" aria-label="Area" />
        </label>
        <div className="text-sm">
          <label htmlFor="when">When</label>
          <Select id="when" value={when} onChange={(e)=>setWhen(e.target.value as any)} aria-label="When">
            <option value="tonight">Tonight</option>
            <option value="weekend">Weekend</option>
            <option value="daytime">Daytime</option>
          </Select>
          {(when === 'tonight') && (
            <small className="mt-1 block text-textDim">We'll favour walk-in friendly spots.</small>
          )}
          {when !== 'tonight' && (new Date(date) >= new Date(today.getTime() + 14*24*60*60*1000)) && (
            <small className="mt-1 block text-textDim">Includes places requiring booking up to 2 weeks.</small>
          )}
        </div>
        <fieldset className="text-sm md:col-span-3">
          <legend id="vibes-label" className="mb-2 block">Vibes</legend>
          <div className="mt-0 flex flex-wrap gap-2" aria-labelledby="vibes-label">
            {vibesList.map(v => (
              <button
                key={v.key}
                type="button"
                data-testid={`vibe-chip-${v.key}`}
                onClick={()=>toggle(v.key)}
                onKeyDown={(e)=>{ if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(v.key) } }}
                aria-pressed={vibes.includes(v.key)}
                className={`rounded-full px-3 py-1 text-sm focus-ring ${vibes.includes(v.key) ? 'bg-accent/16 text-accent' : 'bg-muted text-textDim'}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="md:col-span-3 flex gap-3 pt-2">
          <Button ref={triggerRef} type="submit" className="grow md:grow-0">Deal me 3</Button>
          <Button variant="secondary" asChild><Link href="/london">Browse London</Link></Button>
        </div>
      </form>

      {its && !!its.length && (
        <div className="mt-4 space-y-3">
          {its.map((it, idx) => <ItineraryCard key={idx} it={it} />)}
          <div className="flex gap-2">
            <Button onClick={submit as any} variant="secondary">Try another</Button>
            <Button onClick={copyPlan} variant="ghost">Copy plan</Button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={(o)=>{ setOpen(o); if (!o) triggerRef.current?.focus() }}>
        <DialogTrigger asChild>
          <span className="sr-only" />
        </DialogTrigger>
        <DialogContent role="dialog" aria-modal="true" aria-labelledby="itinerary-title">
          <DialogTitle id="itinerary-title" className="mb-3">Your mini-plan</DialogTitle>
          {its?.map((it,idx)=>(<div key={idx} className="mb-3"><ItineraryCard it={it} /></div>))}
          <div className="flex gap-2 mt-2">
            <Button onClick={copyPlan}>Copy plan</Button>
            <Button variant="secondary" onClick={()=>setOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
