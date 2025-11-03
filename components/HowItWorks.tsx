import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="mb-6 md:mb-8">
        <h1 id="how-heading" className="text-3xl md:text-4xl font-semibold">How DealMe3 works</h1>
        <p className="mt-2 text-textDim max-w-3xl">
          Tell us your vibe, budget and date. We filter places by <strong>price per person</strong> and <strong>wait time</strong>,
          then stitch a three-step mini-itinerary with realistic travel hops. London-first.
        </p>
      </header>

      {/* Steps */}
      <ol className="grid gap-4 md:gap-6 md:grid-cols-3">
        {[
          { n: 1, title: 'Set your vibe & budget', body: 'Choose area, vibes and a custom &pound;min-&pound;max per person.' },
          { n: 2, title: 'Get three that just work', body: 'We factor wait time, travel &le;20 min, kitchen hours and noise.' },
          { n: 3, title: 'Book or wander', body: 'Copy the plan, open routes, or book ahead.' },
        ].map(({ n, title, body }) => (
          <li key={n}>
            <Card className="rounded-2xl">
              <div className="flex items-center gap-3">
                <div aria-hidden className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-text font-semibold">{n}</div>
                <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
              </div>
              <p className="mt-2 text-textDim">{body}</p>
            </Card>
          </li>
        ))}
      </ol>

      {/* What we factor */}
      <div className="mt-8">
        <p className="text-sm font-medium text-textDim">What we factor</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Wait time', 'Travel &le;20 min', 'Kitchen hours', 'Noise level', 'Walk-in friendly'].map((t) => (
            <Badge key={t} className="bg-muted text-textDim text-sm px-3 py-1">{t}</Badge>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="/" className="focus-ring rounded-xl bg-accent px-4 py-2 text-bg font-medium hover:opacity-90">Deal me 3</Link>
        <Link href="/plan?example=1" className="focus-ring rounded-xl bg-muted px-4 py-2 text-text hover:opacity-90">View an example plan</Link>
      </div>

      {/* Mini FAQ */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { q: 'Are prices per person?', a: 'Yes. Cards show “£min–£max per person”.' },
          { q: 'Can I go tonight?', a: 'Choose “Tonight”. We favour walk-in friendly places and late kitchens.' },
          { q: 'Can I set my own budget?', a: 'Yes—set custom min & max in the finder or planner.' },
        ].map(({ q, a }) => (
          <Card key={q} className="rounded-2xl">
            <CardTitle className="font-semibold text-base md:text-lg">{q}</CardTitle>
            <p className="mt-2 text-textDim text-sm md:text-base">{a}</p>
          </Card>
        ))}
      </div>

      {/* Trust strip */}
      <div className="mt-10 flex flex-wrap gap-2 text-sm text-textDim">
        <Badge className="bg-muted text-textDim text-sm px-3 py-1">Curated by Londoners</Badge>
        <Badge className="bg-muted text-textDim text-sm px-3 py-1">No filler listings</Badge>
        <Badge className="bg-muted text-textDim text-sm px-3 py-1">Fast routes</Badge>
      </div>
    </section>
  );
}



