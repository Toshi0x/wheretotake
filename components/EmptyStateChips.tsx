"use client"
import * as React from 'react'

export default function EmptyStateChips({ onMutate }: { onMutate: (action: 'raise'|'removeVibe'|'expandArea') => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <button type="button" className="rounded-full bg-muted text-textDim px-3 py-1 focus-ring" onClick={()=>onMutate('raise')}>Raise price +£10</button>
      <button type="button" className="rounded-full bg-muted text-textDim px-3 py-1 focus-ring" onClick={()=>onMutate('removeVibe')}>Remove a vibe</button>
      <button type="button" className="rounded-full bg-muted text-textDim px-3 py-1 focus-ring" onClick={()=>onMutate('expandArea')}>Expand area</button>
    </div>
  )
}

