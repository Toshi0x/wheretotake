import { notFound } from 'next/navigation'
import { getPlaceBySlug, getReviewsForPlace } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ReviewForm, ReviewList } from '@/components/reviews'
import { fmtPriceRange, priceBandFromLevel } from '@/lib/utils'

export default async function PlacePage({ params }: { params: { slug: string } }) {
  const place = await getPlaceBySlug(params.slug)
  if (!place) return notFound()
  const reviews = await getReviewsForPlace(place.id)
  const price: [number, number] = [
    place.budget_min ?? priceBandFromLevel(place.price_level)[0],
    place.budget_max ?? priceBandFromLevel(place.price_level)[1]
  ]
  return (
    <div className="space-y-5">
      <section className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{place.name}</h1>
            <div className="text-sm text-textDim">{place.area} • {'£'.repeat(place.price_level)} • {fmtPriceRange(price)}</div>
            <div className="mt-2 flex flex-wrap gap-2">{place.vibe_tags.map(t => <Badge key={t}>{t.replace('_',' ')}</Badge>)}</div>
            <div className="mt-2">
              {place.lead_time_days === 0 && <Badge>Walk-in</Badge>}
              {place.lead_time_days > 0 && place.lead_time_days <= 2 && <Badge>Book 1–2d</Badge>}
              {place.lead_time_days >= 3 && place.lead_time_days <= 7 && <Badge>Book 3–7d</Badge>}
              {place.lead_time_days > 7 && <Badge>Book 1–2w</Badge>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {place.booking_url && (
              <Button asChild><a href={place.booking_url} target="_blank" rel="noopener noreferrer">Book</a></Button>
            )}
            <Button variant="secondary" asChild>
              <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address ?? place.name + ' ' + place.area)}`}>Route</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="reviews" className="space-y-4" data-testid="reviews-panel">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <Link href="#review-form" className="text-sm underline">Write a review</Link>
        </div>
        <div className="space-y-3">
          <ReviewList base={reviews} placeId={place.id} />
          <div data-testid="review-form">
            <ReviewForm placeId={place.id} />
          </div>
        </div>
      </section>
    </div>
  )
}



