import Fuse from 'fuse.js'
import { getAllPlaces, getReviewsForPlace } from '@/lib/data'
import type { Place, Review } from '@/lib/types'

export interface SearchDoc {
  id: string
  slug: string
  name: string
  area: string
  borough: string
  priceMin?: number
  priceMax?: number
  vibes: string[]
  lead: number
  reviewText: string
  ratingAvg?: number
  ratingCount: number
  tags: { noise?: boolean; lighting?: boolean; queue?: boolean }
  booking_url?: string
  photo_url?: string
  address?: string
}

export const ALIASES: Record<string, string[]> = {
  quiet: ['quiet','low music','calm','talkable'],
  cosy: ['cosy','cozy','snug','intimate','low_key'],
  romantic: ['romantic','datey','candle','warm lighting'],
  queue: ['queue','line','wait'],
  walkin: ['walk-in','walkin','no booking'],
  rooftop: ['rooftop','skyline','view','sunset'],
  cheap: ['cheap','budget','under 40','£','low price']
}

export function expandQueryTokens(q: string): string[] {
  if (!q) return []
  const out: string[] = []
  const re = /\"([^\"]+)\"|([^\s]+)/g
  const lower = q.toLowerCase()
  let m: RegExpExecArray | null
  while ((m = re.exec(lower)) !== null) {
    const token = (m[1] || m[2] || '').trim()
    if (!token) continue
    out.push(token)
    for (const [key, vals] of Object.entries(ALIASES)) {
      if (token === key || vals.includes(token)) {
        out.push(...vals)
      }
    }
  }
  return Array.from(new Set(out))
}

export const fuseOptions: any = {
  keys: [
    { name: 'name', weight: 0.35 },
    { name: 'area', weight: 0.2 },
    { name: 'borough', weight: 0.1 },
    { name: 'vibes', weight: 0.15 },
    { name: 'reviewText', weight: 0.2 },
  ],
  threshold: 0.33,
  includeScore: true,
  ignoreLocation: true,
  useExtendedSearch: true,
}

function summarize(placeId: string, reviews: Review[]) {
  const list = reviews.filter(r => r.placeId === placeId)
  const count = list.length
  const avg = count ? list.reduce((s,r)=>s+r.rating,0)/count : undefined
  const text = list.map(r => `${r.title} ${r.body}`).join(' ')
  const textLower = text.toLowerCase()
  const tags = {
    noise: /quiet|low music|calm|talkable/.test(textLower),
    lighting: /candle|warm lighting|dim|cozy|cosy/.test(textLower),
    queue: /queue|line|wait/.test(textLower),
  }
  return { count, avg, text, tags }
}

export async function buildSearchDocs(): Promise<SearchDoc[]> {
  const places = await getAllPlaces()
  const allReviews = await Promise.all(places.map(p => getReviewsForPlace(p.id)))
  const reviewMap: Record<string, Review[]> = {}
  places.forEach((p, i) => { reviewMap[p.id] = allReviews[i] })
  const docs: SearchDoc[] = places.map(p => {
    const s = summarize(p.id, reviewMap[p.id] || [])
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      area: p.area,
      borough: p.borough,
      priceMin: p.budget_min,
      priceMax: p.budget_max,
      vibes: p.vibe_tags,
      lead: p.lead_time_days,
      reviewText: s.text,
      ratingAvg: s.avg,
      ratingCount: s.count,
      tags: s.tags,
      booking_url: (p as any).booking_url,
      photo_url: (p as any).photo_url,
      address: (p as any).address,
    }
  })
  return docs
}

export function buildFuse(docs: SearchDoc[]) {
  return new Fuse(docs as any, fuseOptions)
}

export function searchDocs(fuse: any, tokens: string[]): any[] {
  if (!tokens.length) return fuse.search('')
  const sets = tokens.map(t => {
    const exact = `\'${t}`
    if (t.length > 3) {
      const a = fuse.search(exact)
      const b = fuse.search(t)
      const map = new Map<string, any>() 
      for (const r of [...a, ...b]) {
        const key = r.item.id
        const prev = map.get(key)
        if (!prev || (r.score ?? 1) < (prev.score ?? 1)) map.set(key, r)
      }
      return Array.from(map.values())
    }
    return fuse.search(exact)
  })
  const idSets = sets.map((s:any[]) => new Set(s.map((r:any) => r.item.id)))
  const keepId = (id: string) => idSets.every(S => S.has(id))
  const mergedMap = new Map<string, any>()
  for (const arr of sets) {
    for (const r of arr) {
      if (!keepId(r.item.id)) continue
      const prev = mergedMap.get(r.item.id)
      if (!prev || (r.score ?? 1) < (prev.score ?? 1)) mergedMap.set(r.item.id, r)
    }
  }
  return Array.from(mergedMap.values()).sort((a,b)=> (a.score??0)-(b.score??0))
}
