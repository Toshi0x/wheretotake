"use client"
import * as React from 'react'
import type { PlanResult, PlanStep } from '@/lib/planner'
import { Button } from '@/components/ui/button'
import ConfidenceMeter from './ConfidenceMeter'

export default function PlanResults({ result, onReroll2, lock1, setLock1 }: {
  result: PlanResult | null
  onReroll2: ()=>void
  lock1: boolean
  setLock1: (v:boolean)=>void
}) {
  if (!result || !result.steps.length) {
    return (
      <div className="text-sm text-textDim" data-testid="plan-results">
        <div className="mb-2">No results. Try:</div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full bg-muted px-3 py-1">Raise budget +£10</button>
          <button className="rounded-full bg-muted px-3 py-1">Remove “quiet”</button>
          <button className="rounded-full bg-muted px-3 py-1">Expand area to West End</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3" data-testid="plan-results" aria-live="polite">
      <p className="text-textDim">Your plan — tuned for walk-ins, travel ≤ 12 min{result.note ? ` (${result.note})` : ''}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {result.steps.map((s, idx)=> <StepCard key={idx} step={s} idx={idx+1} />)}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" data-testid="reroll-2" onClick={onReroll2}>Reroll step 2</Button>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={lock1} onChange={(e)=>setLock1(e.target.checked)} />
          <span data-testid="lock-step-1">Lock step 1</span>
        </label>
      </div>
    </div>
  )
}

function StepCard({ step, idx }: { step: PlanStep; idx: number }) {
  const price = priceText(step.place)
  return (
    <div className="rounded-2xl border border-border bg-card p-4" data-testid={`plan-step-${idx}`}>
      <div className="flex items-center justify-between text-sm text-textDim">
        <div className="font-medium">Step {idx} • {step.start}–{step.end}</div>
        <div className="rounded-full bg-muted px-2 py-0.5">{step.leadBadge}</div>
      </div>
      <div className="mt-1 text-lg font-semibold">{step.place.name}</div>
      <div className="text-sm text-textDim">{step.place.area} • {price}</div>
      {step.place.blurb && <p className="mt-2 text-textDim line-clamp-1">{step.place.blurb}</p>}
      <div className="mt-3"><ConfidenceMeter value={step.confidence} /></div>
      <div className="mt-3 flex gap-2">
        {step.place.bookingUrl && <Button asChild><a href={step.place.bookingUrl} target="_blank" rel="noreferrer">Book</a></Button>}
        <Button variant="ghost">Route</Button>
      </div>
    </div>
  )
}

function priceText(p: any) {
  if (p.priceMin!=null && p.priceMax!=null) return `£${p.priceMin}–${p.priceMax}`
  const level = p.priceLevel ?? 2
  return '£'.repeat(level)
}

