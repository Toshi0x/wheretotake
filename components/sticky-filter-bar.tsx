"use client"
import * as React from 'react'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Button } from './ui/button'

export interface Filters {
  min?: string
  max?: string
  area?: string
  vibes?: string
  lead?: string
}

export default function StickyFilterBar({ initial, onApply }: { initial: Filters; onApply: (f: Filters)=>void }) {
  const [state, setState] = React.useState<Filters>(initial)
  function apply() { onApply(state) }
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[hsl(var(--card))] p-3 md:hidden">
      <div className="flex gap-2">
        <Input placeholder="Min £" value={state.min ?? ''} onChange={e=>setState(s=>({ ...s, min: e.target.value }))} />
        <Input placeholder="Max £" value={state.max ?? ''} onChange={e=>setState(s=>({ ...s, max: e.target.value }))} />
        <Input placeholder="Area" value={state.area ?? ''} onChange={e=>setState(s=>({ ...s, area: e.target.value }))} />
        <Select value={state.lead ?? ''} onChange={e=>setState(s=>({ ...s, lead: e.target.value }))}>
          <option value="">Lead</option>
          <option value="0">Walk-in</option>
          <option value="3">≤ 3 days</option>
          <option value="7">≤ 7 days</option>
          <option value="14">≤ 14 days</option>
        </Select>
        <Button onClick={apply}>Apply</Button>
      </div>
    </div>
  )
}

