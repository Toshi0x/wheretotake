"use client"
import * as React from 'react'

export default function StickyPlannerCta({ targetId, onSubmit, onCopy }: { targetId: string; onSubmit: ()=>void; onCopy: ()=>void }) {
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    const io = new IntersectionObserver((entries)=>{
      setVisible(!entries[0].isIntersecting)
    }, { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [targetId])
  if (!visible) return null
  return (
    <div className="fixed bottom-0 inset-x-0 bg-card/85 backdrop-blur border-t border-border px-4 py-3 flex gap-2 md:hidden">
      <button className="bg-accent text-onAccent rounded-xl px-4 py-2" type="button" onClick={onSubmit}>Generate plan</button>
      <button className="bg-muted text-text rounded-xl px-4 py-2" type="button" onClick={onCopy}>Copy plan</button>
    </div>
  )
}

