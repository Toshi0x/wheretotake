import type { Place } from '@/lib/types'

export function haversineKm(a: {lat: number, lng: number}, b: {lat: number, lng: number}) {
  const toRad = (x: number) => (x * Math.PI) / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const s = Math.sin(dLat/2)**2 + Math.sin(dLon/2)**2 * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1-s))
  return R * c
}

export function estimateMinutes(origin: {lat:number,lng:number}, place: Place) {
  if (!origin?.lat || !origin?.lng || !place?.lat || !place?.lng) return undefined
  const d = haversineKm(origin as any, { lat: place.lat!, lng: place.lng! })
  const slowerCats = new Set(['outdoors','walk','scenic','view','activity'])
  const speedKmH = slowerCats.has(place.category as any) ? 5 : 25
  const minutes = (d / speedKmH) * 60
  return { distanceKm: d, minutes }
}

