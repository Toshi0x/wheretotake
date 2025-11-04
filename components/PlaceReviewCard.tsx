"use client"
import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { leadTimeBadge } from '@/lib/leadTime'
import { Highlighter } from '@/components/ReviewSearchBar'
import { fmtPriceRange, priceBandFromLevel } from '@/lib/utils'
import { track } from '@/lib/analytics'
import { useRouter } from 'next/navigation'

export default function PlaceReviewCard({
  place,
  summary,
  snippet,
  tokens,
  photos = [],
  onOpenReviews,
}: {
  place: { id: string; slug: string; name: string; area: string; budget_min?: number; budget_max?: number; price_level: 1|2|3; lead_time_days: number }
  summary: { avg?: number; count: number; tags?: { noise?: boolean; lighting?: boolean; queue?: boolean } }
  snippet?: string
  tokens?: string[]
  photos?: string[]
  onOpenReviews?: (placeId: string) => void
}) {
  const price: [number, number] = [
    place.budget_min ?? priceBandFromLevel(place.price_level)[0],
    place.budget_max ?? priceBandFromLevel(place.price_level)[1]
  ]

  const router = useRouter()
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries)=>{
      if (entries[0].isIntersecting) {
        router.prefetch(`/place/${place.slug}`)
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [router, place.slug])

  return (
    <article ref={ref} className="card p-4 relative" data-testid="place-review-card">
      {leadTimeBadge(place.lead_time_days) && (
        <span className="absolute right-4 top-4"><Badge>{leadTimeBadge(place.lead_time_days)}</Badge></span>
      )}
      <div>
        <Link href={`/place/${place.slug}`} className="text-lg font-semibold hover:underline">{place.name}</Link>
        <div className="text-xs text-textDim">{place.area} · {fmtPriceRange(price)}</div>
      </div>
      <div className="mt-1 text-sm" aria-label={`Rating ${summary.avg?.toFixed(1) ?? '0'} out of 5 from ${summary.count} reviews`}>
        <span>★ {summary.avg?.toFixed(1) ?? '–'}</span>
        <span className="text-textDim"> · {summary.count} reviews</span>
        <span className="ml-2 inline-flex gap-1 text-textDim">
          {summary.tags?.noise && <span className="rounded-full bg-muted px-2">Quiet</span>}
          {summary.tags?.lighting && <span className="rounded-full bg-muted px-2">Warm</span>}
          {summary.tags?.queue && <span className="rounded-full bg-muted px-2">Short queue</span>}
        </span>
      </div>
      {snippet && (
        <p className="mt-2 text-sm text-textDim line-clamp-2">
          <em>“<Highlighter text={snippet} tokens={tokens ?? []} />”</em>
        </p>
      )}
      {photos?.length > 0 && (
        <div className="mt-2 flex gap-2">
          {photos.slice(0,3).map((src,i)=> (
            <Image key={i} src={src} alt="" width={96} height={96} className="h-16 w-16 object-cover rounded" placeholder="blur" blurDataURL={'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="100%" height="100%" fill="#1f2937"/></svg>')} />
          ))}
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <Button variant="ghost" onClick={()=>{ track('reviews_open',{ id: place.id }); onOpenReviews?.(place.id) }}>Reviews</Button>
        <Button onClick={()=>track('detail_click',{ id: place.id })} asChild>
          <Link href={`/place/${place.slug}`}>Detailed view</Link>
        </Button>
      </div>
    </article>
  )
}
