import Link from 'next/link'

const tiles = [
  { slug: 'under-40pp', title: 'Under £40pp' },
  { slug: 'walk-in-friendly', title: 'Walk-in friendly' },
  { slug: 'rainy-but-cute', title: 'Rainy day but still cute' },
  { slug: 'sunset-rooftops', title: 'Sunset rooftops' },
  { slug: 'soho-first-date', title: 'Soho first date' },
  { slug: 'shoreditch-low-key', title: 'Shoreditch low-key' }
]

export default function CollectionsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tiles.map(t => (
        <Link key={t.slug} href={`/collections/${t.slug}`} className="card p-5 hover:brightness-110 transition">
          <div className="text-lg font-semibold">{t.title}</div>
          <div className="text-sm text-white/60">Browse curated spots matching the theme.</div>
        </Link>
      ))}
    </div>
  )
}

