"use client"

import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'
import { Place } from '@/lib/types'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { fmtPriceRange, priceBandFromLevel } from '@/lib/utils'
import { leadTimeBadge } from '@/lib/leadTime'
import { getReviewsForPlace } from '@/lib/data'
import { track } from '@/lib/analytics'

export default function PlaceCard({ place, distanceKm, minutes, originName }: { place: Place; distanceKm?: number; minutes?: number; originName?: string }) {
  const price: [number, number] = [
    place.budget_min ?? priceBandFromLevel(place.price_level)[0],
    place.budget_max ?? priceBandFromLevel(place.price_level)[1]
  ]
  const [snippet, setSnippet] = React.useState<string | null>(null)

  React.useEffect(() => {
    let alive = true
    getReviewsForPlace(place.id).then((rs) => {
      if (!alive) return
      if (!rs?.length) return
      const top = rs[0]
      const s = (top.body?.trim?.() || top.title || '').trim()
      if (s) setSnippet(s.length > 160 ? s.slice(0, 157) + '…' : s)
    })
    return () => { alive = false }
  }, [place.id])

  function save() {
    try {
      if (typeof window === 'undefined') return
      const raw = localStorage.getItem('favourites')
      const list: string[] = raw ? JSON.parse(raw) : []
      if (!list.includes(place.id)) localStorage.setItem('favourites', JSON.stringify([...list, place.id]))
    } catch {}
    track('saveClick', { id: place.id })
  }

  return (
    <div className="card p-4 flex flex-col gap-3" data-testid="place-card">
      <div className="w-full h-40 rounded-lg overflow-hidden bg-[hsl(var(--muted))]">
        <Image
          src={place.photo_url || '/placeholder.svg'}
          alt={`${place.name} photo`}
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-full object-cover"
          placeholder="blur"
          blurDataURL={'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#1f2937"/></svg>')}
        />
      </div>
      <div>
        <Link href={`/place/${place.slug}`} className="text-lg font-semibold hover:underline">{place.name}</Link>
        <div className="text-xs text-textDim">{place.area} · {'£'.repeat(place.price_level)} · {fmtPriceRange(price)}</div>
        {(distanceKm!=null && minutes!=null && ['outdoors','walk','scenic','view','activity'].includes(place.category as any)) && (
          <div className="text-xs text-textDim mt-0.5">~{Math.round(minutes)} min{originName?` from ${originName}`:''} • {distanceKm.toFixed(1)} km</div>
        )}
      </div>
      <div className="flex flex-wrap gap-2" data-testid="place-badges">
        {leadTimeBadge(place.lead_time_days) && <Badge>{leadTimeBadge(place.lead_time_days)}</Badge>}
        {place.vibe_tags.slice(0,2).map(t => <Badge key={t}>{t.replace('_',' ')}</Badge>)}
      </div>
      <p className="text-sm text-textDim line-clamp-2">{place.review_blurb}</p>
      {snippet && <p className="text-sm italic text-textDim line-clamp-2">“{snippet}”</p>}
      <div className="flex gap-2 pt-2">
        {place.booking_url ? (
          <Button onClick={() => track('bookingClick', { id: place.id })} asChild>
            <a target="_blank" rel="noopener noreferrer" href={place.booking_url}>Book</a>
          </Button>
        ) : (
          <Button onClick={save}>Save</Button>
        )}
        <Button variant="secondary" asChild>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address ?? place.name + ' ' + place.area)}`}
            onClick={() => track('routeClick', { id: place.id })}
          >
            Route
          </a>
        </Button>
      </div>
    </div>
  )
}
