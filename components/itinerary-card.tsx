import { Itinerary } from '@/lib/planner'
import { Card } from './ui/card'
import Link from 'next/link'

export default function ItineraryCard({ it }: { it: Itinerary }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">~{it.totalMinutes} mins · Est {`£${it.perPersonEstimate[0]}-£${it.perPersonEstimate[1]}`} pp</div>
      </div>
      <ol className="space-y-3">
        {it.steps.map((s, idx) => (
          <li key={idx} data-testid="itinerary-step" className="flex items-start gap-3">
            <div className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-black font-semibold">{idx+1}</div>
            <div>
              <div className="font-medium"><Link href={`/place/${s.place.slug}`} className="hover:underline">{s.place.name}</Link> <span className="text-white/60">· {s.place.area}</span></div>
              <div className="text-xs text-white/60">{s.arriveAt} - {s.departAt} · hop {s.travelMinutes}m</div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}
