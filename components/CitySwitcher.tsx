"use client"
import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { REGIONS, DEFAULT_REGION, type RegionKey } from '@/lib/region.config'
import { haversineKm } from '@/lib/geo'

export default function CitySwitcher({ current }: { current: RegionKey }) {
  const router = useRouter()
  const sp = useSearchParams()
  const [open, setOpen] = React.useState(false)
  const [q, setQ] = React.useState('')
  const allRegions = Object.values(REGIONS)
  const visibleRegions = allRegions.filter(r => r.key !== 'hertfordshire')

  function go(region: RegionKey) {
    try { localStorage.setItem('wt_region', region) } catch {}
    const qs = sp?.toString() ?? ''
    router.push(`/${region}` + (qs ? `?${qs}` : ''))
  }

  async function useMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos)=>{
      const me = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      let best = DEFAULT_REGION; let bestD = Infinity
      for (const r of visibleRegions) {
        const d = haversineKm(me, r.center)
        if (d < bestD) { bestD = d; best = r.key }
      }
      go(best)
    })
  }

  const options = visibleRegions.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.key.includes(q.toLowerCase()))

  return (
    <div className="relative">
      <label htmlFor="city" className="text-xs text-textDim">City</label>
      <button id="city" aria-haspopup="listbox" aria-expanded={open} onClick={()=>setOpen(o=>!o)} className="field h-11 px-3 w-48 text-left">
        {REGIONS[current]?.name ?? 'Enter location'}
      </button>
      {open && (
        <div role="listbox" className="absolute z-30 mt-1 w-72 rounded-xl border border-border bg-card shadow-soft p-2">
          <input aria-label="Search city" placeholder="Enter location" value={q} onChange={e=>setQ(e.target.value)} className="field w-full px-3 py-2 mb-2" />
          <button type="button" className="w-full text-left rounded-xl bg-muted text-text px-3 py-2 mb-2" onClick={useMyLocation}>Use my location</button>
          <ul className="max-h-64 overflow-y-auto">
            {options.map(o => (
              <li key={o.key}>
                <button type="button" className="w-full text-left px-3 py-2 hover:bg-muted rounded" onClick={()=>{ setOpen(false); go(o.key) }}>{o.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
