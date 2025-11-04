export type RegionKey = 'london'|'hertfordshire'

export const REGIONS: Record<RegionKey, {
  key: RegionKey
  name: string
  center: { lat: number; lng: number }
  neighbors: RegionKey[]
  weights: Partial<Record<string, number>>
}> = {
  london: {
    key: 'london',
    name: 'London',
    center: { lat: 51.5074, lng: -0.1278 },
    neighbors: ['hertfordshire'],
    weights: {
      restaurant: 1.0,
      bar: 1.0,
      cafe: 0.8,
      walk: 0.7,
      view: 0.75,
      outdoors: 0.7,
      activity: 0.9,
      museum: 0.85,
      food: 1.0,
      dessert: 0.9,
    }
  },
  hertfordshire: {
    key: 'hertfordshire',
    name: 'Hertfordshire',
    center: { lat: 51.8098, lng: -0.2377 },
    neighbors: ['london'],
    weights: {
      restaurant: 0.9,
      bar: 0.9,
      cafe: 0.9,
      walk: 1.1,
      view: 1.1,
      outdoors: 1.15,
      activity: 1.0,
      museum: 0.8,
      food: 0.95,
      dessert: 0.9,
    }
  }
}

export function isValidRegion(key: string): key is RegionKey {
  return key in REGIONS
}

export const DEFAULT_REGION: RegionKey = 'london'

