import { Place } from '@/lib/types'
import { getReviewsForPlace } from '@/lib/data'

function inWindow(p: Place, today: Date) {
  const f = p.featured
  if (!f?.active) return false
  const fromOk = f.from ? new Date(f.from) <= today : true
  const toOk = f.to ? today <= new Date(f.to) : true
  return fromOk && toOk
}

export async function getFeatured(places: Place[], today = new Date()): Promise<Place[]> {
  const active = places.filter(p => inWindow(p, today))
  const withCounts = await Promise.all(active.map(async p => {
    const reviews = await getReviewsForPlace(p.id)
    return { p, count: reviews.length, avg: reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length) : 0 }
  }))
  const sorted = withCounts
    .sort((a,b)=> (a.p.featured?.rank ?? 999) - (b.p.featured?.rank ?? 999) || (b.count - a.count) || (b.avg - a.avg))
    .map(x=>x.p)

  if (sorted.length < 5) {
    const remaining = await Promise.all(places
      .filter(p=>!sorted.includes(p))
      .map(async p=>({ p, count: (await getReviewsForPlace(p.id)).length })))
    const filler = remaining.sort((a,b)=>b.count - a.count).slice(0, 5 - sorted.length).map(x=>x.p)
    return [...sorted, ...filler]
  }
  return sorted
}

