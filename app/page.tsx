import QuickFinder from '@/components/quick-finder'
import PlaceCard from '@/components/place-card'
import FeaturedRow from '@/components/FeaturedRow'
// Collections removed; reviews is primary
import Steps from '@/components/steps'
import { getAllPlaces } from '@/lib/data'
import { getFeatured } from '@/lib/featured'
import EmailCapture from '@/components/email-capture'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import StickyCtaBar from '@/components/StickyCtaBar'
import Script from 'next/script'
import { itemListLD } from '@/lib/seo'

export default async function HomePage() {
  const places = await getAllPlaces()
  const featured = await getFeatured(places)
  const trending = places.slice(0,4)
  return (
    <div className="space-y-10">
      
      <section id="hero" className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold">Three options in 30 seconds.</h1>
        <p className="text-textDim max-w-2xl mx-auto">Pick your vibe, set your budget, and go.</p>
      </section>
      {featured.length > 0 && (
        <section className="space-y-4" aria-labelledby="featured-heading">
          <FeaturedRow items={featured} />
        </section>
      )}
      <QuickFinder />
      <p className="text-sm text-textDim text-center">Price is per person. We factor wait time and travel so plans actually work.</p>

      <section>
        <div className="text-textDim text-sm mb-2">Why trust it</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="card p-4 text-center font-medium">Curated by Londoners</div>
          <div className="card p-4 text-center font-medium">No filler listings</div>
          <div className="card p-4 text-center font-medium">Fast routes</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 hidden">
          {["10k+ dates planned","4.7? avg","Fast routes","Local picks"].map((t,i)=>(
            <div key={i} className="card p-4 text-center font-medium">{t}</div>
          ))}
        </div>
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
        <p className="text-textDim">One smart date idea, weekly. No spam.</p>
        <EmailCapture />
      </section>
      <StickyCtaBar />
      <Script id="ld-featured" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(itemListLD(featured.map(f=>({ name: f.name, url: `/place/${f.slug}` }))))}} />
      <Script id="ld-trending" type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(itemListLD(trending.map(t=>({ name: t.name, url: `/place/${t.slug}` }))))}} />
    </div>
  )
}




