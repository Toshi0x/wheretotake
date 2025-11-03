import { Place, Vibe } from './types'
import { distanceKm, daysUntil, priceBandFromLevel } from './utils'
import { getAllPlaces } from './data'

export type When = 'tonight'|'weekend'|'daytime'

export interface PlannerInput {
  dateISO: string
  budgetMin?: number
  budgetMax?: number
  area?: string
  vibes: Vibe[]
  when: When
}

export interface ItineraryStep {
  place: Place
  arriveAt: string
  departAt: string
  travelMinutes: number
}

export interface Itinerary {
  steps: ItineraryStep[]
  totalMinutes: number
  perPersonEstimate: [number, number]
}

function overlaps(min?: number, max?: number, pMin?: number, pMax?: number, level?: 1|2|3) {
  const [bandMin, bandMax] = level ? priceBandFromLevel(level) : [undefined, undefined]
  const a = pMin ?? bandMin!
  const b = pMax ?? bandMax!
  if (min == null && max == null) return true
  if (min == null) return a <= (max as number)
  if (max == null) return (min as number) <= b
  return Math.max(min, a) <= Math.min(max, b)
}

function vibeMatch(sel: Vibe[], p: Place) {
  if (!sel.length) return true
  return sel.some(v => p.vibe_tags.includes(v))
}

function areaMatch(area: string | undefined, p: Place) {
  if (!area) return true
  const q = area.toLowerCase()
  return p.area.toLowerCase().includes(q) || p.borough.toLowerCase().includes(q)
}

function whenWeight(when: When, p: Place) {
  if (when === 'tonight') return p.lead_time_days <= 0 ? 2 : 0
  if (when === 'daytime') return ['activity','view','dessert','walk'].includes(p.category) ? 2 : 1
  return 1
}

export async function plan(input: PlannerInput): Promise<Itinerary[]> {
  const all = await getAllPlaces()
  const days = daysUntil(input.dateISO)

  const filtered = all.filter(p => {
    const priceOk = overlaps(input.budgetMin, input.budgetMax, p.budget_min, p.budget_max, p.price_level)
    const areaOk = areaMatch(input.area, p)
    const vibeOk = vibeMatch(input.vibes, p)
    const leadOk = p.lead_time_days <= days
    return priceOk && areaOk && vibeOk && leadOk
  })

  // score for sorting
  const scored = filtered.map(p => ({
    p,
    score: whenWeight(input.when, p) + (p.vibe_tags.some(v => input.vibes.includes(v)) ? 1 : 0)
  }))
  scored.sort((a,b) => b.score - a.score)
  const candidates = scored.map(s => s.p)

  // helper to get a place by categories without duplicates
  const take = (pool: Place[], cats: Place['category'][], used: Set<string>) => {
    for (const p of pool) {
      if (used.has(p.id)) continue
      if (cats.includes(p.category)) return p
    }
    return undefined
  }

  const itineraries: Itinerary[] = []
  const maxItins = 3
  const pool = candidates
  for (let i=0; i<maxItins; i++) {
    const used = new Set<string>()
    const pre = take(pool, ['bar','activity'], used) || take(pool, ['activity','bar'], used)
    if (!pre) break
    used.add(pre.id)
    // choose main close to pre
    const nearMain = pool
      .filter(p => !used.has(p.id) && ['restaurant','activity'].includes(p.category))
      .sort((a,b) => (distanceKm(pre,a) ?? 1) - (distanceKm(pre,b) ?? 1))
    const main = nearMain[0]
    if (!main) break
    used.add(main.id)

    const nearEnd = pool
      .filter(p => !used.has(p.id) && ['dessert','walk','view'].includes(p.category))
      .sort((a,b) => (distanceKm(main,a) ?? 1) - (distanceKm(main,b) ?? 1))
    const end = nearEnd[0]
    if (!end) break
    used.add(end.id)

    const hop = (a?: Place, b?: Place) => {
      if (!a || !b) return 10
      const km = distanceKm(a,b)
      if (km == null) return 8 + Math.round(Math.random()*10)
      return Math.min(20, Math.max(5, Math.round(km * 12))) // ~12 min/km walking
    }

    const total = 120
    const start = new Date()
    const fmt = (d: Date) => d.toTimeString().slice(0,5)

    const step1End = new Date(start.getTime() + 35*60000)
    const step2Start = new Date(step1End.getTime() + hop(pre, main)*60000)
    const step2End = new Date(step2Start.getTime() + 55*60000)
    const step3Start = new Date(step2End.getTime() + hop(main, end)*60000)
    const step3End = new Date(step3Start.getTime() + 30*60000)

    const range = (p: Place): [number, number] => [p.budget_min ?? priceBandFromLevel(p.price_level)[0], p.budget_max ?? priceBandFromLevel(p.price_level)[1]]
    const estimate: [number, number] = [
      Math.round((range(pre)[0] + range(main)[0] + range(end)[0]) / 3),
      Math.round((range(pre)[1] + range(main)[1] + range(end)[1]) / 3)
    ]

    itineraries.push({
      steps: [
        { place: pre, arriveAt: fmt(start), departAt: fmt(step1End), travelMinutes: hop(pre, main) },
        { place: main, arriveAt: fmt(step2Start), departAt: fmt(step2End), travelMinutes: hop(main, end) },
        { place: end, arriveAt: fmt(step3Start), departAt: fmt(step3End), travelMinutes: 0 },
      ],
      totalMinutes: total,
      perPersonEstimate: estimate
    })
  }

  return itineraries.length ? itineraries.slice(0,3) : []
}

