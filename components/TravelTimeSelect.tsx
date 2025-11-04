"use client"
import * as React from 'react'

const OPTIONS = [15,30,45,90,'any'] as const
type Opt = typeof OPTIONS[number]

export default function TravelTimeSelect({ value, onChange }: { value: Opt; onChange: (v: Opt)=>void }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="tt" className="text-sm">Travel time</label>
      <select id="tt" className="field h-11 px-3" value={String(value)} onChange={(e)=>onChange((isNaN(Number(e.target.value))?'any':Number(e.target.value)) as Opt)}>
        {OPTIONS.map(o => <option key={String(o)} value={String(o)}>{o==='any'?'Any':`${o} min`}</option>)}
      </select>
    </div>
  )
}

