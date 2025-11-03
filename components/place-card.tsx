"use client"

import Link from 'next/link'
import Image from 'next/image'
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
    <div className="card p-4 flex flex-col gap-3" data-testid="place-card">
      <div className="w-full h-40 rounded-lg overflow-hidden bg-[hsl(var(--muted))]">
        <Image
          src={place.photo_url || '/placeholder.svg'}
          alt={`${place.name} photo`}
          width={640}
          height={320}
          className="w-full h-full object-cover"
          placeholder="blur"
          blurDataURL={'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320"><rect width="100%" height="100%" fill="#1f2937"/></svg>')}
        />
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/place/${place.slug}`} className="text-lg font-semibold hover:underline">{place.name}</Link>
          <div className="text-xs text-textDim">{place.area} • {'£'.repeat(place.price_level)} • {fmtPriceRange(price)}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2" data-testid="place-badges">
        {place.lead_time_days === 0 && <Badge>Walk-in</Badge>}
        {place.lead_time_days > 0 && place.lead_time_days <= 2 && <Badge>Book 1–2d</Badge>}
        {place.lead_time_days >= 3 && place.lead_time_days <= 7 && <Badge>Book 3–7d</Badge>}
        {place.lead_time_days > 7 && <Badge>Book 1–2w</Badge>}
      </div>
      <p className="text-sm text-textDim line-clamp-2">{place.review_blurb}</p>
      <div className="flex flex-wrap gap-2">{place.vibe_tags.slice(0,4).map(t => <Badge key={t}>{t.replace('_',' ')}</Badge>)}</div>
      <div className="flex gap-2 pt-2">
        {place.booking_url ? (
          <Button onClick={() => track('bookingClick', { place: place.slug })} asChild>
            <a target="_blank" rel="noopener noreferrer" href={place.booking_url}>Book</a>
          </Button>
        ) : (
          <Button onClick={() => track('saveClick', { place: place.slug })}>Save</Button>
        )}
        <Button variant="secondary" asChild>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address ?? place.name + ' ' + place.area)}`}
            onClick={() => track('routeClick', { place: place.slug })}
          >
            Route
          </a>
        </Button>
      </div>
    </div>
  )
}
