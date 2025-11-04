"use client"
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { clamp } from '@/lib/utils'
import { addHoursToTime } from '@/lib/time'
import { feasibilityScore } from '@/lib/planner'
import type { PlanFormState } from '@/lib/planner'

export default function PlannerForm({ value, onChange, onGenerate, onCopy }: {
  value: PlanFormState
  onChange: (next: Partial<PlanFormState>)=>void
  onGenerate: ()=>void
  onCopy: ()=>void
}) {
  const todayISO = new Date().toISOString().slice(0,10)
  const [plans, setPlans] = React.useState<number|undefined>(undefined)
  const [reasons, setReasons] = React.useState<string[]|undefined>(undefined)

  React.useEffect(() => {
    const h = setTimeout(() => {
      const f = feasibilityScore(value)
      setPlans(f.plans)
      setReasons(f.reasons)
    }, 250)
    return () => clearTimeout(h)
  }, [value])

  function useMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
      onChange({ originLat: pos.coords.latitude, originLng: pos.coords.longitude })
    })
  }

  const endTime = addHoursToTime(value.startTime, value.durationHrs)
  const estHops = clamp(Math.floor((value.durationHrs*60) / (40 + value.maxTravelMins)), 2, 4)
  return (
    <form id="planner-form" className="card p-5 grid grid-cols-1 md:grid-cols-3 gap-3" data-testid="planner-form" onSubmit={(e)=>{e.preventDefault(); onGenerate()}}>
      <div className="md:col-span-3 flex flex-wrap items-end gap-3">
        <label className="text-sm" htmlFor="origin">Origin
          <Input id="origin" placeholder="Postcode or area" value={value.area ?? ''} onChange={e=>onChange({ area: e.target.value||undefined })} />
        </label>
        <Button type="button" variant="secondary" onClick={useMyLocation}>Use my location</Button>
        <div className="text-sm">
          <label htmlFor="transport">Transport</label>
          <Select id="transport" value={value.transport ?? 'walk'} onChange={(e)=>onChange({ transport: e.target.value as any })}>
            <option value="walk">Walk</option>
            <option value="public">Public</option>
            <option value="drive">Drive</option>
          </Select>
        </div>
        {plans!=null && (
          <div className="ml-auto rounded-full bg-muted px-3 py-1 text-sm">≈ {plans} plans found</div>
        )}
      </div>
      <label className="text-sm" htmlFor="date">Date
        <Input id="date" type="date" value={value.dateISO} min={todayISO} onChange={e=>onChange({ dateISO: e.target.value })} />
      </label>
      <label className="text-sm" htmlFor="min">Budget Min (£)
        <Input id="min" data-testid="input-budget-min" value={value.budgetMin ?? ''} inputMode="numeric" onChange={e=>onChange({ budgetMin: e.target.value?Number(e.target.value):undefined })} />
      </label>
      <label className="text-sm" htmlFor="max">Budget Max (£)
        <Input id="max" data-testid="input-budget-max" value={value.budgetMax ?? ''} inputMode="numeric" onChange={e=>onChange({ budgetMax: e.target.value?Number(e.target.value):undefined })} />
      </label>
      <label className="text-sm" htmlFor="area">Area
        <Input id="area" data-testid="input-area" placeholder="e.g., Soho or W1" value={value.area ?? ''} onChange={e=>onChange({ area: e.target.value||undefined })} />
      </label>
      <div className="text-sm">
        <label htmlFor="when">When</label>
        <Select id="when" value={value.when} onChange={e=>onChange({ when: e.target.value as PlanFormState['when'], walkInOnly: e.target.value==='Tonight' ? true : value.walkInOnly })}>
          <option>Tonight</option>
          <option>Weeknight</option>
          <option>Weekend</option>
          <option>Date</option>
        </Select>
      </div>
      <div className="md:col-span-3 grid grid-cols-2 gap-3 text-xs text-textDim">
        <div>End time: <span className="font-medium text-text">{endTime}</span></div>
        <div>Est. hops: <span className="font-medium text-text">{estHops}</span></div>
      </div>
      {reasons?.length ? (
        <div className="md:col-span-3 text-xs text-textDim">Why 0 results: {reasons.join(' · ')}</div>
      ) : null}
      <label className="text-sm" htmlFor="dur">Duration (hrs)
        <Input id="dur" type="number" step={0.5} min={1.5} max={4} value={value.durationHrs} onChange={e=>onChange({ durationHrs: Number(e.target.value) })} />
      </label>

      <div className="text-sm md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <label htmlFor="start">Start time
          <input id="start" data-testid="slider-start" type="range" min={17} max={22} step={0.5} value={timeToVal(value.startTime)} onChange={e=>onChange({ startTime: valToTime(Number(e.target.value)) })} className="w-full" />
          <div className="flex justify-between text-xs text-textDim"><span>17:00</span><span>19:00</span><span>21:30</span></div>
        </label>
        <label htmlFor="travel">Max travel per hop
          <input id="travel" data-testid="slider-travel" type="range" min={5} max={25} step={1} value={value.maxTravelMins} onChange={e=>onChange({ maxTravelMins: Number(e.target.value) })} className="w-full" />
          <div className="flex justify-between text-xs text-textDim"><span>5m</span><span>12m</span><span>25m</span></div>
        </label>
      </div>

      {value.when === 'Tonight' && (
        <div className="md:col-span-3 flex items-center gap-3">
          <label htmlFor="walkin" className="text-sm">Walk-in only</label>
          <input id="walkin" data-testid="switch-walkin" type="checkbox" checked={value.walkInOnly} onChange={(e)=>onChange({ walkInOnly: e.target.checked })} />
        </div>
      )}

      <div className="md:col-span-3">
        <p className="text-sm text-textDim">Advanced options</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            {k:'quiet',label:'Quiet space'},
            {k:'stepFree',label:'Step-free'},
            {k:'alcoholOk',label:'Alcohol ok'},
            {k:'vegetarian',label:'Vegetarian'},
          ].map((c)=>{
            const pressed = (value as any)[c.k]
            return (
              <button key={c.k} type="button" aria-pressed={!!pressed} onClick={()=>onChange({ [c.k]: !pressed } as any)} className={`rounded-full px-3 py-1 text-sm focus-ring ${pressed ? 'bg-accent/15 text-accent2' : 'bg-muted text-textDim'}`}>{c.label}</button>
            )
          })}
        </div>
      </div>

      <div className="md:col-span-3 flex gap-3 pt-1">
        <Button type="submit" data-testid="generate-btn">Generate</Button>
        <Button type="button" variant="ghost" onClick={onCopy} data-testid="copy-btn">Copy plan</Button>
      </div>
    </form>
  )
}

function timeToVal(t: string) {
  const [h,m] = (t||'19:00').split(':').map(Number)
  return h + (m>=30?0.5:0)
}
function valToTime(v: number) {
  const h = Math.floor(v)
  const m = v%1 ? 30 : 0
  return `${String(h).padStart(2,'0')}:${m? '30':'00'}`
}
