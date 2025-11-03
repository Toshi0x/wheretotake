"use client"
import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAllPlaces } from '@/lib/data'
import PlaceCard from '@/components/place-card'
import StickyFilterBar, { Filters } from '@/components/sticky-filter-bar'
import { Vibe } from '@/lib/types'
import { priceBandFromLevel, track } from '@/lib/utils'

export default function LondonPage() {
  const [places, setPlaces] = React.useState<any[]>([])
  const search = useSearchParams(); const router = useRouter()

  React.useEffect(() => { getAllPlaces().then(setPlaces) }, [])

  const initial: Filters = {
    budget: search.get('budget') ?? search.get('max') ?? undefined,
    area: search.get('area') ?? undefined,
    vibes: search.get('vibes') ?? undefined,
    date: search.get('date') ?? undefined,
    when: search.get('when') ?? undefined,
  }

  const filtered = places.filter(p => {
    const minParam = search.get('min')
    const min = minParam ? Number(minParam) : undefined
    const max = initial.budget ? Number(initial.budget) : (search.get('max') ? Number(search.get('max')!) : undefined)
    const [bandMin, bandMax] = priceBandFromLevel(p.price_level)
    const budget = (min==null && max==null) || (
      Math.max(min ?? -Infinity, p.budget_min ?? bandMin) <=
      Math.min(max ?? Infinity, p.budget_max ?? bandMax)
    )
    const area = initial.area ? (p.area.toLowerCase().includes(initial.area.toLowerCase()) || p.borough.toLowerCase().includes(initial.area.toLowerCase())) : true
    const vibes = initial.vibes ? initial.vibes.split(',').some(v => (p.vibe_tags as Vibe[]).includes(v as Vibe)) : true
    return budget && area && vibes
  })

  function apply(f: Filters) {
    const params = new URLSearchParams()
    if (f.budget) params.set('budget', f.budget)
    if (f.area) params.set('area', f.area)
    if (f.vibes) params.set('vibes', f.vibes)
    if (f.date) params.set('date', f.date)
    if (f.when) params.set('when', f.when)
    router.replace(`/london?${params.toString()}`)
    track('filterApply', Object.fromEntries(params))
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Browse London</h1>

      <DesktopFilters initial={initial} onApply={apply} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => <PlaceCard key={p.id} place={p} />)}
        {!filtered.length && <div className="text-white/70">No matches. Try widening budget or removing a vibe.</div>}
      </div>

      <StickyFilterBar initial={initial} onApply={apply} />
    </div>
  )
}

function DesktopFilters({ initial, onApply }: { initial: Filters; onApply: (f: Filters)=>void }) {
  const [budget, setBudget] = React.useState<string>(initial.budget ?? '')
  const [area, setArea] = React.useState<string>(initial.area ?? '')
  const [vibesSel, setVibesSel] = React.useState<Vibe[]>(() => (initial.vibes ? (initial.vibes.split(',') as Vibe[]) : []))
  const today = new Date()
  const maxDate = new Date(today.getTime() + 60*24*60*60*1000)
  const [date, setDate] = React.useState<string>(initial.date ?? today.toISOString().slice(0,10))
  const [when, setWhen] = React.useState<string>(initial.when ?? 'tonight')

  const vibesList: { key: Vibe; label: string }[] = [
    { key: 'romantic', label: 'romantic' },
    { key: 'low_key', label: 'low-key' },
    { key: 'playful', label: 'playful' },
    { key: 'bougie', label: 'bougie' },
    { key: 'hidden_gem', label: 'hidden gem' },
    { key: 'rainy_safe', label: 'rainy-safe' },
    { key: 'outdoors', label: 'outdoors' }
  ]

  function toggle(v: Vibe) {
    setVibesSel(prev => prev.includes(v) ? prev.filter(x=>x!==v) : [...prev, v])
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onApply({ budget, area, vibes: vibesSel.join(','), date, when })
  }

  return (
    <div className="hidden md:flex items-end gap-2 card p-4 sticky top-2 z-10">
      <form onSubmit={submit} className="flex gap-2 w-full items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Budget (£)</label>
          <input name="budget" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Budget (£)" className="h-11 rounded-xl bg-white/5 border border-white/10 px-3" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Area</label>
          <input name="area" value={area} onChange={e=>setArea(e.target.value)} placeholder="Area" className="h-11 rounded-xl bg-white/5 border border-white/10 px-3" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Date</label>
          <input name="date" type="date" min={today.toISOString().slice(0,10)} max={maxDate.toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} className="h-11 rounded-xl bg-white/5 border border-white/10 px-3" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">When</label>
          <select name="when" value={when} onChange={e=>setWhen(e.target.value)} className="h-11 rounded-xl bg-white/5 border border-white/10 px-3">
            <option value="tonight">Tonight</option>
            <option value="weekend">Weekend</option>
            <option value="daytime">Daytime</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-white/60">Vibes</label>
          <div className="flex flex-wrap gap-2">
            {vibesList.map(v => (
              <button
                key={v.key}
                type="button"
                onClick={()=>toggle(v.key)}
                onKeyDown={(e)=>{ if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(v.key) } }}
                aria-pressed={vibesSel.includes(v.key)}
                className={`rounded-full px-3 py-1 text-sm focus-ring ${vibesSel.includes(v.key) ? 'bg-accent/15 text-accent2' : 'bg-muted text-textDim'}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
        <button className="h-11 px-5 rounded-2xl bg-[hsl(var(--accent))] text-black font-semibold">Search</button>
      </form>
    </div>
  )
}
