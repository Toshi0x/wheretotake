import places from '@/data/places.json'
import seedReviews from '@/data/reviews.json'
import { Place, Review } from './types'

export async function getAllPlaces(): Promise<Place[]> {
  return places as unknown as Place[]
}

export async function getPlaceBySlug(slug: string): Promise<Place | undefined> {
  const all = await getAllPlaces()
  return all.find(p => p.slug === slug)
}

export async function getReviewsForPlace(placeId: string): Promise<Review[]> {
  const r = (seedReviews as unknown as Review[]).filter(r => r.placeId === placeId)
  return r
}

