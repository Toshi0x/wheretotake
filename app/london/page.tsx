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
    min: search.get('min') ?? undefined,
    max: search.get('max') ?? undefined,
    area: search.get('area') ?? undefined,
    vibes: search.get('vibes') ?? undefined,
    lead: search.get('lead') ?? undefined
  }

  const filtered = places.filter(p => {
    const min = initial.min ? Number(initial.min) : undefined
    const max = initial.max ? Number(initial.max) : undefined
    const [bandMin, bandMax] = priceBandFromLevel(p.price_level)
    const budget = (min==null && max==null) || (
      Math.max(min ?? -Infinity, p.budget_min ?? bandMin) <=
      Math.min(max ?? Infinity, p.budget_max ?? bandMax)
    )
    const area = initial.area ? (p.area.toLowerCase().includes(initial.area.toLowerCase()) || p.borough.toLowerCase().includes(initial.area.toLowerCase())) : true
    const vibes = initial.vibes ? initial.vibes.split(',').some(v => (p.vibe_tags as Vibe[]).includes(v as Vibe)) : true
    const lead = initial.lead ? p.lead_time_days <= Number(initial.lead) : true
    return budget && area && vibes && lead
  })

  function apply(f: Filters) {
    const params = new URLSearchParams()
    if (f.min) params.set('min', f.min)
    if (f.max) params.set('max', f.max)
    if (f.area) params.set('area', f.area)
    if (f.vibes) params.set('vibes', f.vibes)
    if (f.lead) params.set('lead', f.lead)
    router.replace(`/london?${params.toString()}`)
    track('filterApply', Object.fromEntries(params))
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Browse London</h1>

      <div className="hidden md:flex items-end gap-2 card p-4 sticky top-2 z-10">
        <form onSubmit={(e)=>{e.preventDefault(); const fd=new FormData(e.currentTarget as HTMLFormElement); apply({ min: String(fd.get('min')||''), max: String(fd.get('max')||''), area: String(fd.get('area')||''), vibes: String(fd.get('vibes')||''), lead: String(fd.get('lead')||'') })}} className="flex gap-2 w-full">
          <input name="min" defaultValue={initial.min} placeholder="Min £" className="h-11 rounded-xl bg-white/5 border border-white/10 px-3" />
          <input name="max" defaultValue={initial.max} placeholder="Max £" className="h-11 rounded-xl bg-white/5 border border-white/10 px-3" />
          <input name="area" defaultValue={initial.area} placeholder="Area" className="h-11 rounded-xl bg-white/5 border border-white/10 px-3" />
          <input name="vibes" defaultValue={initial.vibes ?? ''} placeholder="Vibes (comma-separated)" className="h-11 rounded-xl bg-white/5 border border-white/10 px-3 flex-1" />
          <select name="lead" defaultValue={initial.lead ?? ''} className="h-11 rounded-xl bg-white/5 border border-white/10 px-3">
            <option value="">Lead</option>
            <option value="0">Walk-in</option>
            <option value="3">≤ 3 days</option>
            <option value="7">≤ 7 days</option>
            <option value="14">≤ 14 days</option>
          </select>
          <button className="h-11 px-5 rounded-2xl bg-[hsl(var(--accent))] text-black font-semibold">Apply</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => <PlaceCard key={p.id} place={p} />)}
        {!filtered.length && <div className="text-white/70">No matches. Try widening budget or removing a vibe.</div>}
      </div>

      <StickyFilterBar initial={initial} onApply={apply} />
    </div>
  )
}

