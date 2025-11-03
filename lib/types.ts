export type Vibe = 'romantic'|'low_key'|'playful'|'bougie'|'hidden_gem'|'rainy_safe'|'outdoors'
export type Category = 'restaurant'|'bar'|'activity'|'dessert'|'walk'|'view'

export interface Place {
  id: string
  slug: string
  name: string
  category: Category
  area: string
  borough: string
  budget_min?: number
  budget_max?: number
  price_level: 1|2|3
  vibe_tags: Vibe[]
  lead_time_days: number
  review_blurb: string
  address?: string
  lat?: number
  lng?: number
  booking_url?: string
  website?: string
  instagram_url?: string
  tiktok_url?: string
  photo_url?: string
}

export interface Review {
  id: string
  placeId: string
  rating: 1|2|3|4|5
  title: string
  body: string
  author?: string
  createdAt: string // ISO
}

