import { getAllPlaces, getPlaceBySlug, getReviewsForPlace } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import PlaceCard from '@/components/place-card'
import { Review, Place } from '@/lib/types'
import { ReviewForm, ReviewList } from '@/components/reviews'
import { fmtPriceRange, priceBandFromLevel } from '@/lib/utils'

export default async function PlacePage({ params }: { params: { slug: string } }) {
  const place = await getPlaceBySlug(params.slug)
  if (!place) return <div>Not found</div>
  const baseReviews = await getReviewsForPlace(place.id)
  const allPlaces = await getAllPlaces()
  const nearby = allPlaces
    .filter(p => p.id !== place.id && (p.area === place.area || p.vibe_tags.some(v => place.vibe_tags.includes(v))))
    .slice(0, 3)

  const price: [number, number] = [
    place.budget_min ?? priceBandFromLevel(place.price_level)[0],
    place.budget_max ?? priceBandFromLevel(place.price_level)[1]
  ]

  const avg = baseReviews.length ? (baseReviews.reduce((s, r) => s + r.rating, 0) / baseReviews.length) : undefined
  const ld: any = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: place.name,
    address: place.address,
    url: `https://example.com/place/${place.slug}`,
  }
  if (avg) {
    ld.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount: baseReviews.length
    }
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <div className="space-y-8">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">{place.name}</h1>
        <div className="text-white/70">{place.area} · {'£'.repeat(place.price_level)} · {fmtPriceRange(price)}</div>
        <p className="text-white/80 max-w-2xl">{place.review_blurb}</p>
        <div className="flex gap-2 flex-wrap">{place.vibe_tags.map(v => <Badge key={v}>{v.replace('_','-')}</Badge>)}</div>
        <div className="flex gap-2 pt-2">
          {place.booking_url && (
            <a className="rounded-2xl bg-[hsl(var(--accent))] text-black px-4 py-2" href={place.booking_url} target="_blank" rel="noopener noreferrer">Book</a>
          )}
          <a className="rounded-2xl bg-white/10 px-4 py-2" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address ?? place.name + ' ' + place.area)}`} target="_blank" rel="noopener noreferrer">Route</a>
        </div>
      </section>
      {place.lat && place.lng && (
        <div className="card p-0 overflow-hidden">
          <div className="h-56 w-full bg-[hsl(var(--muted))] grid place-items-center text-white/60">Map placeholder ({place.lat.toFixed(3)}, {place.lng.toFixed(3)})</div>
        </div>
      )}
      <section>
        <h2 className="text-xl font-semibold mb-2">Good to know</h2>
        <p className="text-sm text-white/80">{place.lead_time_days > 0 ? `Book ${place.lead_time_days} day(s) ahead recommended` : 'Walk-in friendly; earlier evenings easiest.'}</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <ReviewList base={baseReviews as Review[]} placeId={place.id} />
        <ReviewForm placeId={place.id} onAdd={() => {}} />
      </section>
      {!!nearby.length && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Similar nearby</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearby.map((p: Place) => <PlaceCard key={p.id} place={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}

