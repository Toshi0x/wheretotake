"use client"

import Link from 'next/link'
import { Place } from '@/lib/types'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { fmtPriceRange, priceBandFromLevel, track } from '@/lib/utils'

export default function PlaceCard({ place }: { place: Place }) {
  const price: [number, number] = [
    place.budget_min ?? priceBandFromLevel(place.price_level)[0],
    place.budget_max ?? priceBandFromLevel(place.price_level)[1]
  ]
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/place/${place.slug}`} className="text-lg font-semibold hover:underline">{place.name}</Link>
          <div className="text-xs text-white/60">{place.area} · {'£'.repeat(place.price_level)} · {fmtPriceRange(price)}</div>
        </div>
      </div>
      <p className="text-sm text-white/80 line-clamp-2">{place.review_blurb}</p>
      <div className="flex flex-wrap gap-2">{place.vibe_tags.slice(0,4).map(t => <Badge key={t}>{t.replace('_','-')}</Badge>)}</div>
      <div className="flex gap-2 pt-2">
        {place.booking_url && (
          <Button variant="secondary" onClick={() => track('bookingClick', { place: place.slug })} asChild>
            <a target="_blank" rel="noopener noreferrer" href={place.booking_url}>Book</a>
          </Button>
        )}
        <Button variant="ghost" asChild>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address ?? place.name + ' ' + place.area)}`}
            onClick={() => track('routeClick', { place: place.slug })}
          >
            Route
          </a>
        </Button>
        <Button variant="ghost" asChild>
          <Link href={`/place/${place.slug}`}>View</Link>
        </Button>
      </div>
    </div>
  )
}

