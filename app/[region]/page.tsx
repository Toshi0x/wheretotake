"use client"
import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAllPlaces } from '@/lib/data'
import PlaceCard from '@/components/place-card'
import { Vibe } from '@/lib/types'
import { fmtPriceRange, priceBandFromLevel } from '@/lib/utils'
import { isValidRegion, REGIONS, DEFAULT_REGION } from '@/lib/region.config'
import { scorePlace } from '@/lib/rank'
import { estimateMinutes } from '@/lib/geo'
import CitySwitcher from '@/components/CitySwitcher'
import CategoryPills from '@/components/CategoryPills'
import StickyFilterBar, { Filters as StickyFilters } from '@/components/sticky-filter-bar'

export default function RegionPage({ params }: { params: { region: string } }) {
  const regionKey = isValidRegion(params.region) ? (params.region as keyof typeof REGIONS) : DEFAULT_REGION
  const [places, setPlaces] = React.useState<any[]>([])
  const search = useSearchParams(); const router = useRouter()

  React.useEffect(() => { getAllPlaces().then(setPlaces) }, [])

  // URL filters
  const categories = (search.get('c')?.split(',') ?? []).filter(Boolean)
  const ttRaw = search.get('tt')
  const tt = ttRaw==='any' || ttRaw==null ? undefined : Number(ttRaw)
  const initial: StickyFilters = {
    budget: search.get('budget') ?? search.get('max') ?? undefined,
    area: search.get('area') ?? undefined,
    vibes: search.get('vibes') ?? undefined,
    date: search.get('date') ?? undefined,
    when: search.get('when') ?? undefined,
  }

  function applySticky(f: StickyFilters) {
    const params = new URLSearchParams(search.toString())
    params.delete('budget'); params.delete('max')
    if (f.budget) params.set('budget', f.budget)
    if (f.area) params.set('area', f.area)
    if (f.vibes) params.set('vibes', f.vibes)
    if (f.date) params.set('date', f.date)
    if (f.when) params.set('when', f.when)
    router.replace(`/${regionKey}?${params.toString()}`)
  }

  function setCats(c: string[]) {
    const params = new URLSearchParams(search.toString())
    if (c.length) params.set('c', c.join(',')); else params.delete('c')
    router.replace(`/${regionKey}?${params.toString()}`)
  }
  function setTt(v: any) {
    const params = new URLSearchParams(search.toString())
    if (v && v!=='any') params.set('tt', String(v)); else params.delete('tt')
    router.replace(`/${regionKey}?${params.toString()}`)
  }

  const origin = REGIONS[regionKey].center

  const scored = places.map(p => ({ p, ...scorePlace(p as any, regionKey, { tt, origin }) }))
  const filtered = scored
    .filter(x => !categories.length || categories.includes((x.p.category as string)))
    .sort((a,b)=> (b.score - a.score))
    .map(x => x)

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Browse {REGIONS[regionKey].name}</h1>
        </div>
        <div className="hidden md:flex items-end gap-3">
          <CitySwitcher current={regionKey} />
        </div>
      </div>
      <div className="hidden md:block"><CategoryPills value={categories} onChange={setCats} /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(({p, est}) => (
          <PlaceCard key={p.id} place={p} distanceKm={est?.distanceKm} minutes={est?.minutes} originName={REGIONS[regionKey].name} />
        ))}
        {!filtered.length && (
          <div className="text-textDim">
            <div>Few options here. Try:</div>
            <div className="mt-2 flex gap-2 flex-wrap">
              <button className="rounded-full bg-muted text-textDim px-3 py-1 focus-ring" onClick={()=>setCats(['outdoors','walk','scenic'])}>Outdoors-first preset</button>
              <button className="rounded-full bg-muted text-textDim px-3 py-1 focus-ring" onClick={()=>setTt(45)}>Expand travel time</button>
              {REGIONS[regionKey].neighbors.map(n => (
                <button key={n} className="rounded-full bg-muted text-textDim px-3 py-1 focus-ring" onClick={()=>router.push(`/${n}?${search.toString()}`)}>View {REGIONS[n].name}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <StickyFilterBar initial={initial} onApply={applySticky} />
    </div>
  )
}
