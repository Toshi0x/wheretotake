"use client"
import * as React from 'react'
import { plan } from '@/lib/planner'
import { Vibe } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import ItineraryCard from '@/components/itinerary-card'
import { useToast } from '@/components/ui/toast'

export default function PlannerPage() {
  const { notify } = useToast()
  const today = new Date();
  const defaultDate = new Date(today.getTime() + 14*24*60*60*1000)
  const [date, setDate] = React.useState<string>(defaultDate.toISOString().slice(0,10))
  const [min, setMin] = React.useState('')
  const [max, setMax] = React.useState('')
  const [area, setArea] = React.useState('')
  const [when, setWhen] = React.useState<'tonight'|'weekend'|'daytime'>('tonight')
  const [vibes, setVibes] = React.useState<Vibe[]>(['low_key'])
  const [its, setIts] = React.useState<any[]>([])
  const [hours, setHours] = React.useState(2)
  const [alcoholOk, setAlcoholOk] = React.useState(true)
  const [outdoorsOk, setOutdoorsOk] = React.useState(true)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const out = await plan({ dateISO: date, budgetMin: min?Number(min):undefined, budgetMax: max?Number(max):undefined, area: area||undefined, vibes, when })
    setIts(out)
    notify({ title: `Generated ${out.length} option(s)` })
  }

  function copy() {
    const text = its[0]?.steps.map((s: any,i:number)=>`${i+1}. ${s.place.name} (${s.arriveAt}-${s.departAt})`).join('\n')
    if (text) navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Plan a mini-itinerary</h1>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3 card p-4">
        <label className="text-sm">Date<Input type="date" min={today.toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} /></label>
        <label className="text-sm">Budget Min (£)<Input value={min} onChange={e=>setMin(e.target.value)} /></label>
        <label className="text-sm">Budget Max (£)<Input value={max} onChange={e=>setMax(e.target.value)} /></label>
        <label className="text-sm">Area<Input value={area} onChange={e=>setArea(e.target.value)} /></label>
        <label className="text-sm">When<Select value={when} onChange={e=>setWhen(e.target.value as any)}><option value="tonight">Tonight</option><option value="weekend">Weekend</option><option value="daytime">Daytime</option></Select></label>
        <label className="text-sm">Duration (hrs)<Input type="number" min={1} max={4} value={hours} onChange={(e)=>setHours(Number(e.target.value))} /></label>
        <div className="text-sm">Hints
          <div className="flex gap-3 mt-2 text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={alcoholOk} onChange={e=>setAlcoholOk(e.target.checked)} />Alcohol ok</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={outdoorsOk} onChange={e=>setOutdoorsOk(e.target.checked)} />Outdoors ok</label>
          </div>
        </div>
        <div className="md:col-span-3 flex gap-2">
          <Button type="submit">Generate</Button>
          <Button type="button" variant="secondary" onClick={copy}>Copy plan</Button>
        </div>
      </form>
      <div className="space-y-3">
        {its.map((it,idx)=>(<ItineraryCard key={idx} it={it} />))}
      </div>
    </div>
  )
}

