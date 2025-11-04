import type { Place } from '@/lib/types'
import { REGIONS } from '@/lib/region.config'
import { estimateMinutes } from '@/lib/geo'

export function scorePlace(place: Place, regionKey: keyof typeof REGIONS, filters: { tt?: number; origin?: {lat:number,lng:number}; rainSafe?: boolean }) {
  const w = REGIONS[regionKey].weights
  const cat = (place.category as keyof typeof w) as any
  let s = (place as any).baseScore ?? 1
  s *= (w[cat] ?? 0.6)

  const origin = filters.origin ?? REGIONS[regionKey].center
  const est = estimateMinutes(origin, place)
  if (filters.tt && est?.minutes != null) {
    if (est.minutes <= filters.tt) s *= 1.15
    if (est.minutes > (filters.tt * 1.5)) s *= 0.85
  }
  if (filters.rainSafe && (place as any).rain_safe) s *= 1.1
  return { score: s, est }
}

