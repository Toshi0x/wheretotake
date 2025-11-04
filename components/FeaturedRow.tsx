"use client"
import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Place } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { track } from '@/lib/utils'

export default function FeaturedRow({ items }: { items: Place[] }) {
  const scrollerId = React.useId()
  React.useEffect(() => {
    if (!items?.length) return
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('featured_seen')) return
    sessionStorage.setItem('featured_seen', '1')
    track('featured_impression', { ids: items.map(i=>i.id) })
  }, [items])
  if (!items?.length) return null

  function onNav(dir: 'prev'|'next') {
    const el = document.getElementById(scrollerId)
    if (!el) return
    const dx = dir === 'next' ? el.clientWidth : -el.clientWidth
    el.scrollBy({ left: dx, behavior: 'smooth' })
  }

  const firstRow = items.slice(0,2)
  const secondRow = items.slice(2,5)

  return (
    <section aria-labelledby="featured-heading" data-testid="featured-row" className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 id="featured-heading" className="text-2xl font-semibold">Featured</h2>
          <p className="text-textDim">Curated picks, updated weekly.</p>
        </div>
        <div className="hidden" role="group" aria-label="Featured carousel controls" />
      </div>

      {/* Desktop grid: first row 2 cards, second row 3 cards */}
      <div className="hidden md:block" aria-roledescription="carousel">
        <div className="grid grid-cols-2 gap-3">
          {firstRow.map((p,i)=> (
            <FeaturedCard key={p.id} place={p} dataIndex={i} total={items.length} />
          ))}
        </div>
        {secondRow.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {secondRow.map((p,i)=> (
              <FeaturedCard key={p.id} place={p} dataIndex={i+2} total={items.length} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile horizontal carousel */}
      <div id={scrollerId} className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-3" aria-roledescription="carousel">
        {items.map((p,i)=> (
          <FeaturedCard key={p.id} place={p} dataIndex={i} total={items.length} mobile />
        ))}
      </div>
    </section>
  )
}

function FeaturedCard({ place, large, mobile, dataIndex, total }: { place: Place; large?: boolean; mobile?: boolean; dataIndex: number; total: number }) {
  const price = place.budget_min && place.budget_max ? `£${place.budget_min}–£${place.budget_max}` : '£'.repeat(place.price_level)
  const onClick = (action: 'book'|'details') => track('featured_click', { id: place.id, action })
  const vibes = place.vibe_tags.slice(0,2)
  return (
    <article role="group" aria-label={`Slide ${dataIndex+1} of ${total}`} data-testid="featured-card" className={[
      'relative bg-card border border-border rounded-2xl overflow-hidden shadow-soft',
      mobile ? 'min-w-[80%] snap-start' : ''
    ].join(' ')}>
      <div role="img" aria-label={`${place.name}, ${place.area}, ${price}`}>
        <Image src={place.photo_url || '/placeholder.svg'} alt={`${place.name} photo`} width={800} height={480} sizes="(max-width: 768px) 100vw, 50vw" priority={dataIndex===0} className="h-56 w-full object-cover md:h-48" />
      </div>
      <div className="overlay-gradient absolute inset-0 pointer-events-none" />
      <div className="absolute left-3 right-3 bottom-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {place.featured?.label ? <Badge className="bg-muted text-textDim">{place.featured.label}</Badge> : <Badge className="bg-muted text-textDim">Featured</Badge>}
          {place.featured?.sponsored && <Badge className="bg-muted text-textDim">Sponsored</Badge>}
        </div>
        <div>
          <div className="font-semibold leading-tight">{place.name}</div>
          <div className="text-xs text-textDim">{place.area} • {price}</div>
          <div className="mt-1 flex gap-2">{vibes.map(v => <span key={v} className="rounded-full bg-muted px-2 py-0.5 text-xs text-textDim">{v.replace('_',' ')}</span>)}</div>
        </div>
        <div className="mt-2 flex gap-2">
          {place.booking_url ? (
            <Button onClick={()=>onClick('book')} asChild>
              <a href={place.booking_url} target="_blank" rel="noopener noreferrer">Book</a>
            </Button>
          ) : (
            <Button onClick={()=>onClick('details')} asChild>
              <Link href={`/place/${place.slug}`}>Detailed view</Link>
            </Button>
          )}
          <Button variant="ghost" onClick={()=>onClick('details')} asChild>
            <Link href={`/place/${place.slug}`}>Detailed view</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
