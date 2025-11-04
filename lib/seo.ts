export function itemListLD(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: it.url,
      name: it.name,
    })),
  }
}

export function placeLD(place: {
  name: string
  url: string
  address?: string
  aggregateRating?: { ratingValue: number; reviewCount: number }
}) {
  const base: any = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: place.name,
    url: place.url,
  }
  if (place.address) base.address = place.address
  if (place.aggregateRating) {
    base.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: place.aggregateRating.ratingValue,
      reviewCount: place.aggregateRating.reviewCount,
    }
  }
  return base
}

