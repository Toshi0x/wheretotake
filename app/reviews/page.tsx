"use client"
import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { buildSearchDocs, buildFuse, expandQueryTokens, searchDocs, type SearchDoc } from '@/lib/search'
import { getReviewsForPlace } from '@/lib/data'
import { ReviewList, ReviewForm } from '@/components/reviews'
import { track } from '@/lib/utils'

type SortKey = 'reviews'|'rating'|'price'|'lead'

export default function ReviewsIndexPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const [q, setQ] = React.useState<string>(sp.get('q') ?? '')
  const [sort, setSort] = React.useState<SortKey>('reviews')
  const [filters, setFilters] = React.useState({ hasReviews: false, highRating: false, quiet: false, warm: false, shortQueue: false })
  const [docs, setDocs] = React.useState<SearchDoc[]>([])
  const [openSlug, setOpenSlug] = React.useState<string | null>(sp.get('place'))
  const reviewsRef = React.useRef<HTMLDivElement | null>(null)
  const [baseReviews, setBaseReviews] = React.useState<any[]>([])

  React.useEffect(() => { (async()=>{ setDocs(await buildSearchDocs()) })() }, [])

  React.useEffect(() => {
    const h = setTimeout(() => {
      const params = new URLSearchParams(sp.toString())
      if (q) params.set('q', q); else params.delete('q')
      router.replace(`/reviews?${params.toString()}`)
      track('search', { q, tokens: expandQueryTokens(q) })
    }, 200)
    return () => clearTimeout(h)
  }, [q])

  React.useEffect(() => {
    setOpenSlug(sp.get('place'))
  }, [sp])

  React.useEffect(() => {
    (async () => {
      const d = docs.find(x => x.slug === openSlug!)
      if (d?.id) {
        const list = await getReviewsForPlace(d.id)
        setBaseReviews(list as any)
      } else {
        setBaseReviews([])
      }
    })()
  }, [openSlug, docs])

  const tokens = expandQueryTokens(q)
  const fuse = React.useMemo(() => buildFuse(docs), [docs])
  let results = searchDocs(fuse, tokens).map(r => r.item)
  if (!q) results = docs
  results = results.filter(r => {
    if (filters.hasReviews && r.ratingCount <= 0) return false
    if (filters.highRating && (r.ratingAvg ?? 0) < 4.5) return false
    if (filters.quiet && !r.tags.noise) return false
    if (filters.warm && !r.tags.lighting) return false
    if (filters.shortQueue && !r.tags.queue) return false
    return true
  })
  results = [...results].sort((a,b)=>{
    if (sort==='reviews') return (b.ratingCount)-(a.ratingCount)
    if (sort==='rating') return (b.ratingAvg??0)-(a.ratingAvg??0)
    if (sort==='price') return (a.priceMin??0)-(b.priceMin??0)
    if (sort==='lead') return (a.lead)-(b.lead)
    return 0
  })

  function toggleFilter(key: keyof typeof filters) { setFilters(prev => ({...prev, [key]: !prev[key]})) }

  function highlight(text: string, toks: string[] = tokens) {
    if (!toks.length) return text
    const uniq = Array.from(new Set(toks.map(t=>t.toLowerCase())))
    const esc = (s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(uniq.map(esc).join('|'), 'gi')
    const parts = text.split(re)
    const matches = text.match(re) || []
    const out: string[] = []
    parts.forEach((p, i) => {
      out.push(p)
      if (i < matches.length) out.push(`<mark>${matches[i]}</mark>`)
    })
    return out.join('')
  }
  function openPlace(slug: string) {
    const params = new URLSearchParams(sp.toString())
    params.set('place', slug)
    router.replace(`/reviews?${params.toString()}`)
  }
  function closePlace() {
    const params = new URLSearchParams(sp.toString())
    params.delete('place')
    router.replace(`/reviews?${params.toString()}`)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div className="grow">
          <label className="text-sm" htmlFor="search">Search</label>
          <Input id="search" aria-label="Search" placeholder='Try: "quiet ramen soho", "walk-in romantic"' value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <div>
          <label className="text-sm" htmlFor="sort">Sort</label>
          <Select id="sort" value={sort} onChange={e=>setSort(e.target.value as SortKey)}>
            <option value="reviews">Most reviewed</option>
            <option value="rating">Highest rated</option>
            <option value="price">Price</option>
            <option value="lead">Wait time</option>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[{k:'hasReviews',label:'Has reviews'},{k:'highRating',label:'Rating 4.5+'},{k:'quiet',label:'Quiet'},{k:'warm',label:'Warm lighting'},{k:'shortQueue',label:'Short queue'}].map(c=>{
          const pressed = filters[c.k as keyof typeof filters]
          return (
            <button key={c.k} type="button" aria-pressed={pressed} onClick={()=>toggleFilter(c.k as keyof typeof filters)} className={`rounded-full px-3 py-1 text-sm focus-ring ${pressed ? 'bg-accent/15 text-accent2' : 'bg-muted text-textDim'}`}>{c.label}</button>
          )
        })}
      </div>

      {results.length === 0 && (
        <div className="text-sm text-white/70">
          No results. Try these:
          <div className="mt-2 flex flex-wrap gap-2">
            {['Raise price','Remove a term','Expand area'].map(t => <span key={t} className="rounded-full bg-white/10 px-3 py-1">{t}</span>)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map(r => (
          <div key={r.id} className="card p-4 flex flex-col gap-2" data-testid="place-card">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/place/${r.slug}`} className="font-semibold hover:underline" dangerouslySetInnerHTML={{ __html: highlight(r.name) }} />
                <div className="text-xs text-white/60">{r.area} &middot; &pound;{r.priceMin ?? '-'}-&pound;{r.priceMax ?? '-'}</div>
              </div>
            </div>
            <div className="text-sm text-white/80">
              <span className="mr-2">{'\u2605'} {r.ratingAvg?.toFixed(1) ?? '—'} {'\u2022'} {r.ratingCount} reviews</span>
              <span className="inline-flex gap-2">
                {r.tags.noise && <Badge>Quiet</Badge>}
                {r.tags.lighting && <Badge>Warm lighting</Badge>}
                {r.tags.queue && <Badge>Short queue</Badge>}
              </span>
            </div>
            {r.reviewText && <p className="text-sm text-white/70 line-clamp-2" dangerouslySetInnerHTML={{ __html: highlight(r.reviewText.slice(0, 180)) }} />}
            <div className="flex gap-2">
              <Link href={`/place/${r.slug}#reviews`} className="rounded-2xl bg-muted px-3 py-1 text-sm">Reviews</Link>
              <button onClick={()=>openPlace(r.slug)} className="rounded-2xl bg-accent text-bg px-3 py-1 text-sm">Detailed view</button>
            </div>
          </div>
        ))}
      </div>
      {/* Right-rail details sheet controlled by ?place= */}
      <Sheet open={!!openSlug} onOpenChange={(o)=>{ if(!o) closePlace() }}>
        <SheetContent side="right" aria-label="Place details">
          {openSlug && (() => {
            const d = docs.find(x => x.slug === openSlug)
            if (!d) return null
            return (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden bg-muted" style={{height:180}}>
                  {d.photo_url ? (
                    <Image src={d.photo_url} alt={`${d.name} photo`} width={640} height={320} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full animate-pulse" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xl font-semibold">{d.name}</div>
                  <div className="hidden md:flex gap-2">
                    <Button variant="ghost" onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Read review</Button>
                    <Button variant="ghost" asChild><Link href={`/place/${d.slug}#reviews`}>Read all reviews</Link></Button>
                  </div>
                </div>
                <div className="text-xs text-textDim">{d.area} • £{d.priceMin ?? '—'}-{d.priceMax ?? '—'}</div>
                <div className="text-sm">★ {d.ratingAvg?.toFixed(1) ?? '—'} • {d.ratingCount} reviews</div>
                {d.address && (
                  <div className="text-sm text-textDim">Address: {d.address}</div>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm text-textDim">
                  <div>Borough: {d.borough}</div>
                  <div>Wait time: {d.lead} days</div>
                </div>
                <div className="flex flex-wrap gap-2">{d.vibes.map((v:string)=> <Badge key={v}>{v.replace('_',' ')}</Badge>)}</div>
                {d.reviewText && <p className="text-sm text-textDim">{d.reviewText.slice(0,180)}…</p>}
                <div className="flex gap-2 pt-2">
                  {d.booking_url ? (
                    <Button asChild><a href={d.booking_url} target="_blank" rel="noopener noreferrer">Book</a></Button>
                  ) : (
                    <Button>Save</Button>
                  )}
                  <Button variant="secondary" asChild>
                    <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.name + ' ' + (d.area||''))}`}>Route</a>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href={`/place/${d.slug}#reviews`}>Read all reviews</Link>
                  </Button>
                </div>
                <div ref={reviewsRef} className="mt-4 space-y-3">
                  <h3 className="text-base font-semibold">Reviews</h3>
                  <ReviewList base={baseReviews as any} placeId={d.id} />
                  <div>
                    <h4 className="text-sm font-medium mb-1">Add a review</h4>
                    <ReviewForm placeId={d.id} onAdd={() => { /* list updates from local storage by hook */ }} />
                  </div>
                </div>
              </div>
            )
          })()}
        </SheetContent>
      </Sheet>
    </div>
  )
}


