import { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function priceBandFromLevel(level: 1|2|3): [number, number] {
  if (level === 1) return [12, 25]
  if (level === 2) return [25, 45]
  return [45, 75]
}

export function fmtPriceRange(r?: [number, number]) {
  if (!r) return '£?'
  const [a, b] = r
  return `£${a}-${b}`
}

export function daysUntil(dateISO: string) {
  const now = new Date()
  const d = new Date(dateISO)
  const diff = Math.ceil((d.setHours(0,0,0,0) - now.setHours(0,0,0,0)) / 86400000)
  return Math.max(0, diff)
}

// naive haversine distance in km
export function distanceKm(a: {lat?: number, lng?: number}, b: {lat?: number, lng?: number}) {
  if (!a.lat || !a.lng || !b.lat || !b.lng) return undefined
  const toRad = (x: number) => (x * Math.PI) / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const aa = Math.sin(dLat/2)**2 + Math.sin(dLon/2)**2 * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa))
  return R * c
}

export function track(event: string, payload?: any) {
  // Plausible stub
  // In production we would call window.plausible or our analytics SDK
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[track]', event, payload ?? {})
  }
}

