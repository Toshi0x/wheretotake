import type { SearchDoc } from '@/lib/search'

export type Facets = {
  hasReviews: number
  rating45: number
  quiet: number
  warmLighting: number
  shortQueue: number
}

export function buildFacets(docs: SearchDoc[]): Facets {
  const f: Facets = { hasReviews: 0, rating45: 0, quiet: 0, warmLighting: 0, shortQueue: 0 }
  for (const d of docs) {
    if ((d.ratingCount ?? 0) > 0) f.hasReviews++
    if ((d.ratingAvg ?? 0) >= 4.5) f.rating45++
    if (d.tags?.noise) f.quiet++
    if (d.tags?.lighting) f.warmLighting++
    if ((d.lead ?? 99) <= 2) f.shortQueue++
  }
  return f
}

