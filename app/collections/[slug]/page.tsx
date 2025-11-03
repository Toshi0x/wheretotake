export const dynamic = 'force-dynamic'
import { getAllPlaces } from '@/lib/data'
import PlaceCard from '@/components/place-card'

const rules: Record<string, (p: any) => boolean> = {
  'under-40pp': (p) => (p.budget_max ?? (p.price_level===1?25:(p.price_level===2?45:75))) <= 40,
  'walk-in-friendly': (p) => p.lead_time_days <= 0,
  'rainy-but-cute': (p) => p.vibe_tags.includes('rainy_safe'),
  'sunset-rooftops': (p) => ['view','bar'].includes(p.category) && p.vibe_tags.includes('outdoors'),
  'soho-first-date': (p) => p.area === 'Soho',
  'shoreditch-low-key': (p) => p.area === 'Shoreditch' && p.vibe_tags.includes('low_key')
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const items = await getAllPlaces()
  const rule = rules[params.slug] ?? (() => true)
  const filtered = items.filter(rule)
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{decodeURIComponent(params.slug).replace(/-/g,' ')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => <PlaceCard key={p.id} place={p} />)}
      </div>
    </div>
  )
}
