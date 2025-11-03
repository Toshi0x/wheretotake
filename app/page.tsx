import QuickFinder from '@/components/quick-finder'
import PlaceCard from '@/components/place-card'
import CollectionsGrid from '@/components/collections-grid'
import Steps from '@/components/steps'
import { getAllPlaces } from '@/lib/data'
import EmailCapture from '@/components/email-capture'

export default async function HomePage() {
  const places = await getAllPlaces()
  const trending = places.slice(0,4)
  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold">Three date options in 30 seconds.</h1>
        <p className="text-white/70 max-w-2xl mx-auto">Pick your vibe, set your budget, and get a mini-plan with realistic travel times. London-first.</p>
      </section>

      <QuickFinder />

      <section>
        <div className="text-white/60 text-sm mb-2">Trusted by Londoners</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["10k+ dates planned","4.7★ avg","Fast routes","Local picks"].map((t,i)=>(
            <div key={i} className="card p-4 text-center font-medium">{t}</div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Collections</h2>
        <CollectionsGrid />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Trending places</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trending.map(p => <PlaceCard key={p.id} place={p} />)}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How it works</h2>
        <Steps />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Get the Friday Fix</h2>
        <p className="text-white/70">One smart date idea, weekly. No spam.</p>
        <EmailCapture />
      </section>
    </div>
  )
}

