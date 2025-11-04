"use client"
import * as React from 'react'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Facets } from '@/lib/facets'

export default function FiltersBar({
  facets,
  value,
  onChange,
}: {
  facets: Facets
  value: { has?: boolean; rating?: boolean; quiet?: boolean; warm?: boolean; shortQueue?: boolean; sort?: 'most'|'rating'|'newest' }
  onChange: (v: { has?: boolean; rating?: boolean; quiet?: boolean; warm?: boolean; shortQueue?: boolean; sort?: 'most'|'rating'|'newest' }) => void
}) {
  function toggle(key: keyof typeof value) { onChange({ ...value, [key]: !value[key] }) }
  return (
    <div className="sticky top-16 z-20 bg-bg/90 backdrop-blur border-b border-border">
      <div className="container-page py-3 flex items-center gap-2 overflow-x-auto">
        <Chip active={!!value.has} onClick={()=>toggle('has')}>Has reviews <span className="text-textDim">{facets.hasReviews}</span></Chip>
        <Chip active={!!value.rating} onClick={()=>toggle('rating')}>Rating ≥4.5 <span className="text-textDim">{facets.rating45}</span></Chip>
        <Chip active={!!value.quiet} onClick={()=>toggle('quiet')}>Quiet <span className="text-textDim">{facets.quiet}</span></Chip>
        <Chip active={!!value.warm} onClick={()=>toggle('warm')}>Warm lighting <span className="text-textDim">{facets.warmLighting}</span></Chip>
        <Chip active={!!value.shortQueue} onClick={()=>toggle('shortQueue')}>Short queue <span className="text-textDim">{facets.shortQueue}</span></Chip>
        <button className="rounded-full bg-muted text-text px-3 py-1 focus-ring" onClick={()=>onChange({})}>Reset</button>
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort" className="text-sm">Sort</label>
          <Select id="sort" value={value.sort ?? 'most'} onChange={(e)=>onChange({ ...value, sort: e.target.value as any })} className="w-40">
            <option value="most">Most reviewed</option>
            <option value="rating">Highest rated</option>
            <option value="newest">Newest</option>
          </Select>
        </div>
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: ()=>void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cn('rounded-full px-3 py-1 text-sm focus-ring', active ? 'bg-accent/16 text-accent' : 'bg-muted text-text')}>{children}</button>
  )
}

