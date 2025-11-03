"use client"
import * as React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select } from './ui/select'
import { Vibe } from '@/lib/types'

export interface Filters {
  budget?: string
  area?: string
  vibes?: string
  date?: string
  when?: string
}

const vibesList: { key: Vibe; label: string }[] = [
  { key: 'romantic', label: 'romantic' },
  { key: 'low_key', label: 'low-key' },
  { key: 'playful', label: 'playful' },
  { key: 'bougie', label: 'bougie' },
  { key: 'hidden_gem', label: 'hidden gem' },
  { key: 'rainy_safe', label: 'rainy-safe' },
  { key: 'outdoors', label: 'outdoors' }
]

export default function StickyFilterBar({ initial, onApply }: { initial: Filters; onApply: (f: Filters)=>void }) {
  const [budget, setBudget] = React.useState<string>(initial.budget ?? '')
  const [area, setArea] = React.useState<string>(initial.area ?? '')
  const [vibesSel, setVibesSel] = React.useState<Vibe[]>(() => (initial.vibes ? (initial.vibes.split(',') as Vibe[]) : []))
  const today = new Date()
  const maxDate = new Date(today.getTime() + 60*24*60*60*1000)
  const [date, setDate] = React.useState<string>(initial.date ?? today.toISOString().slice(0,10))
  const [when, setWhen] = React.useState<string>(initial.when ?? 'tonight')

  function toggle(v: Vibe) {
    setVibesSel(prev => prev.includes(v) ? prev.filter(x=>x!==v) : [...prev, v])
  }

  function apply() {
    onApply({ budget, area, vibes: vibesSel.join(','), date, when })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card p-3 md:hidden">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input placeholder="Budget (£)" value={budget} onChange={e=>setBudget(e.target.value)} />
          <Input placeholder="Area" value={area} onChange={e=>setArea(e.target.value)} />
          <Button onClick={apply}>Search</Button>
        </div>
        <div className="flex gap-2">
          <Input aria-label="Date" type="date" min={today.toISOString().slice(0,10)} max={maxDate.toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} />
          <Select aria-label="When" value={when} onChange={(e)=>setWhen(e.target.value)}>
            <option value="tonight">Tonight</option>
            <option value="weekend">Weekend</option>
            <option value="daytime">Daytime</option>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          {vibesList.map(v => (
            <button
              key={v.key}
              type="button"
              onClick={()=>toggle(v.key)}
              onKeyDown={(e)=>{ if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(v.key) } }}
              aria-pressed={vibesSel.includes(v.key)}
              className={`rounded-full px-3 py-1 text-sm focus-ring ${vibesSel.includes(v.key) ? 'bg-accent/16 text-accent' : 'bg-muted text-textDim'}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
