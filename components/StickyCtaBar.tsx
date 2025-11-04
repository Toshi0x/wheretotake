"use client"
import * as React from 'react'
import { Button } from './ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

export default function StickyCtaBar() {
  const [visible, setVisible] = React.useState(false)
  const router = useRouter()
  const search = useSearchParams()

  React.useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const io = new IntersectionObserver((entries) => {
      const e = entries[0]
      setVisible(!e.isIntersecting)
    }, { root: null, rootMargin: '0px', threshold: 0.01 })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  function goPlan() {
    const qs = search?.toString() ?? ''
    router.push('/plan' + (qs ? `?${qs}` : ''))
  }

  if (!visible) return null
  return (
    <div className="fixed bottom-0 inset-x-0 pb-[env(safe-area-inset-bottom)] bg-card/85 backdrop-blur border-t border-border px-4 py-3 flex gap-2 md:hidden">
      <Button className="grow" onClick={goPlan}>Deal me 3</Button>
      <Button variant="secondary" asChild>
        <a href="/plan">Planner</a>
      </Button>
    </div>
  )
}

