"use client"
import * as React from 'react'
import { cn } from '@/lib/utils'
import type { PlanFormState, VibeKey } from '@/lib/planner'

export default function Presets({ value, onChange }: { value: PlanFormState; onChange: (next: Partial<PlanFormState>)=>void }) {
  function applyPreset(k: string) {
    const common = { budgetMin: undefined as number|undefined, budgetMax: undefined as number|undefined, walkInOnly: value.when==='Tonight' ? true : value.walkInOnly }
    if (k==='first') return onChange({ ...common, vibes: ['romantic'] as VibeKey[], budgetMax: 45, alcoholOk: true })
    if (k==='low') return onChange({ ...common, vibes: ['low_key'], budgetMax: 25 })
    if (k==='play') return onChange({ ...common, vibes: ['playful'], alcoholOk: true })
    if (k==='bougie') return onChange({ ...common, vibes: ['bougie'], budgetMin: 35 })
    if (k==='rain') return onChange({ ...common, vibes: ['rainy_safe'] })
  }
  const chips = [
    { k:'first', label:'First date' },
    { k:'low', label:'Low-key' },
    { k:'play', label:'Playful' },
    { k:'bougie', label:'Bougie' },
    { k:'rain', label:'Rainy-safe' },
  ]
  return (
    <div className="flex flex-wrap gap-2" data-testid="quick-presets" aria-label="Presets">
      {chips.map(c => (
        <button
          key={c.k}
          type="button"
          onClick={()=>applyPreset(c.k)}
          aria-pressed={false}
          className={cn('rounded-full bg-muted text-textDim px-3 py-1 text-sm focus-ring hover:opacity-90')}
        >{c.label}</button>
      ))}
    </div>
  )
}

