"use client"
import * as React from 'react'
import ReviewSearchBar from '@/components/ReviewSearchBar'
import FiltersBar from '@/components/FiltersBar'
import PlaceReviewCard from '@/components/PlaceReviewCard'
import SkeletonCard from '@/components/SkeletonCard'
import { useSearchParams, useRouter } from 'next/navigation'
import { buildSearchDocs, buildFuse, searchDocs } from '@/lib/search'
import { buildFacets } from '@/lib/facets'
import ReviewsPanel from '@/components/ReviewsPanel'
import Script from 'next/script'
import { itemListLD } from '@/lib/seo'

export default function ReviewsPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [docs, setDocs] = React.useState<any[]>([])
  const [fuse, setFuse] = React.useState<any>(null)
  const [tokens, setTokens] = React.useState<string[]>([])
  const [sort, setSort] = React.useState<'most'|'rating'|'newest'>('most')
  const [fac, setFac] = React.useState<{ has?: boolean; rating?: boolean; quiet?: boolean; warm?: boolean; shortQueue?: boolean }>({})
  const [page, setPage] = React.useState(1)
  const [panelOpen, setPanelOpen] = React.useState(false)
  const [panelPlace, setPanelPlace] = React.useState<any>(null)

  React.useEffect(() => {
    buildSearchDocs().then((d)=>{ setDocs(d); setFuse(buildFuse(d)); setLoading(false) })
  }, [])

  React.useEffect(() => {
    const q = sp.get('q') ?? ''
    setTokens(q ? q.split('+').map(decodeURIComponent) : [])
  }, [sp])

  const results = React.useMemo(() => {
    if (!fuse) return []
    // When no tokens, show all docs (sorted) instead of an empty Fuse search
    let res = (tokens && tokens.length > 0)
      ? searchDocs(fuse, tokens).map((r:any)=>r.item)
      : (docs as any[])
    // facets
    res = res.filter((d:any)=>!fac.has || (d.ratingCount>0))
    res = res.filter((d:any)=>!fac.rating || ((d.ratingAvg??0)>=4.5))
    res = res.filter((d:any)=>!fac.quiet || d.tags?.noise)
    res = res.filter((d:any)=>!fac.warm || d.tags?.lighting)
    res = res.filter((d:any)=>!fac.shortQueue || (d.lead??99)<=2)
    // sort
    if (sort==='most') res.sort((a:any,b:any)=> (b.ratingCount??0)-(a.ratingCount??0))
    if (sort==='rating') res.sort((a:any,b:any)=> (b.ratingAvg??0)-(a.ratingAvg??0))
    if (sort==='newest') res.sort((a:any,b:any)=> (b.id.localeCompare(a.id)))
    return res
  }, [fuse, tokens, fac, sort, docs])

  const facets = React.useMemo(()=> buildFacets(docs as any), [docs])

  const shown = results.slice(0, page*12)

  function onTokens({ tokens: t, query }: { tokens: string[]; query: string }) {
    const qs = new URLSearchParams(sp.toString())
    if (t.length) qs.set('q', t.join('+')); else qs.delete('q')
    router.replace('?' + qs.toString())
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Reviews</h1>

      <ReviewSearchBar defaultQuery={(sp.get('q')??'').split('+').map(decodeURIComponent).join(' ')} onChange={onTokens} />
      <FiltersBar facets={facets} value={{...fac, sort}} onChange={(v)=>{ const {sort: s, ...rest} = v; setSort(s ?? 'most'); setFac(rest) }} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({length:6}).map((_,i)=>(<SkeletonCard key={i} />))}
        </div>
      ) : (
        <>
          <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shown.map((d:any)=> (
              <li key={d.id}>
                <PlaceReviewCard
                  place={{ id: d.id, slug: d.slug, name: d.name, area: d.area, budget_min: d.priceMin, budget_max: d.priceMax, price_level: (d as any).price_level ?? 2, lead_time_days: d.lead }}
                  summary={{ avg: d.ratingAvg, count: d.ratingCount, tags: d.tags }}
                  snippet={d.reviewText?.slice(0,160)}
                  tokens={tokens}
                  photos={[]}
                  onOpenReviews={(id)=>{ setPanelPlace(d); setPanelOpen(true); const qs=new URLSearchParams(sp.toString()); qs.set('place', d.slug); router.replace('?'+qs.toString()) }}
                />
              </li>
            ))}
          </ul>
          {shown.length < results.length && (
            <div className="flex justify-center pt-2">
              <button className="rounded-xl bg-muted text-text px-4 py-2 focus-ring" onClick={()=>setPage(p=>p+1)}>Load more</button>
            </div>
          )}
        </>
      )}

      <ReviewsPanel open={panelOpen} onOpenChange={(o)=>{ setPanelOpen(o); if(!o){ const qs = new URLSearchParams(sp.toString()); qs.delete('place'); router.replace('?'+qs.toString()) } }} title={panelPlace ? `Reviews — ${panelPlace.name}` : 'Reviews'}>
        {/* In a fuller implementation, render review list, helpful/report, and add-review form */}
        <div className="text-sm text-textDim">Coming soon: full reviews panel.</div>
      </ReviewsPanel>

      <Script id="ld-reviews" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(itemListLD(shown.map((d:any)=>({ name: d.name, url: `/place/${d.slug}` }))))}} />
    </div>
  )
}
