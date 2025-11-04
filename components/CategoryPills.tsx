"use client"
import * as React from 'react'

const CATS = ['food','restaurant','bar','cafe','outdoors','walk','scenic','museum','activity','view','dessert']

export default function CategoryPills({ value, onChange }: { value: string[]; onChange: (v: string[])=>void }) {
  function toggle(c: string) {
    const has = value.includes(c)
    onChange(has ? value.filter(x=>x!==c) : [...value, c])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {CATS.map(c => (
        <button key={c} type="button" aria-pressed={value.includes(c)} onClick={()=>toggle(c)} className={`rounded-full px-3 py-1 text-sm focus-ring ${value.includes(c) ? 'bg-accent/16 text-accent' : 'bg-muted text-textDim'}`}>{c}</button>
      ))}
    </div>
  )
}

