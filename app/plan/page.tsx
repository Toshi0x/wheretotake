"use client"
import * as React from 'react'
import Presets from '@/components/planner/Presets'
import PlannerForm from '@/components/planner/PlannerForm'
import PlanResults from '@/components/planner/PlanResults'
import { loadPlaces, applyConstraints, scheduleSteps, type PlanFormState, writeFormToURL, readFormFromURL, persistForm, restoreForm } from '@/lib/planner'

export default function PlannerPage() {
  const today = new Date()
  const initial: PlanFormState = {
    dateISO: today.toISOString().slice(0,10),
    startTime: '19:00',
    budgetMin: undefined,
    budgetMax: undefined,
    area: undefined,
    when: 'Tonight',
    durationHrs: 2.5,
    maxTravelMins: 12,
    walkInOnly: true,
    quiet: false,
    stepFree: false,
    alcoholOk: true,
    vegetarian: false,
    vibes: ['low_key'],
    lockStep: undefined,
  }

  const [form, setForm] = React.useState<PlanFormState>({ ...initial, ...restoreForm(), ...readFormFromURL() } as PlanFormState)
  const [result, setResult] = React.useState<ReturnType<typeof scheduleSteps> | null>(null)
  const [lock1, setLock1] = React.useState(false)

  React.useEffect(()=>{ writeFormToURL(form); persistForm(form) }, [form])

  function onChange(p: Partial<PlanFormState>) { setForm(prev => ({ ...prev, ...p })) }

  function generate() {
    const places = applyConstraints(loadPlaces(), form)
    const res = scheduleSteps(places, form)
    setResult(res)
  }

  function copyPlan() {
    if (!result?.steps?.length) return
    const dt = new Date(form.dateISO)
    const fmtDate = dt.toLocaleDateString(undefined, { weekday:'short', day:'2-digit', month:'short' })
    const lines = [
      `DealMe3 plan — ${fmtDate}, start ${form.startTime}`,
      ...result.steps.map((s,i)=>`${i+1}) ${s.place.name} (${s.place.area}) ${s.start}–${s.end} — ${priceText(s.place)} — ${s.leadBadge}`),
      `Travel ≤ ${form.maxTravelMins}m per hop.`
    ]
    navigator.clipboard.writeText(lines.join('\n'))
  }

  function reroll2() {
    const places = applyConstraints(loadPlaces(), form)
    if (!result?.steps?.length) return generate()
    const first = lock1 ? result.steps[0]?.place : undefined
    const third = result.steps[2]?.place
    const pool = places.filter(p => p.id !== first?.id && p.id !== third?.id)
    const next = [first, pool[Math.floor(Math.random()*pool.length)], third].filter(Boolean) as any
    const res = scheduleSteps(next, form)
    setResult(res)
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Plan a mini-itinerary</h1>
      <Presets value={form} onChange={onChange} />
      <PlannerForm value={form} onChange={onChange} onGenerate={generate} onCopy={copyPlan} />
      <PlanResults result={result} onReroll2={reroll2} lock1={lock1} setLock1={setLock1} />
    </div>
  )
}

function priceText(p:any){ if(p.priceMin!=null&&p.priceMax!=null) return `£${p.priceMin}–${p.priceMax}`; return '£'.repeat(p.priceLevel??2) }
