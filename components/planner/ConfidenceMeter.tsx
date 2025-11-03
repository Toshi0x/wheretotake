import * as React from 'react'

export default function ConfidenceMeter({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="w-full">
      <div className="mb-1 text-xs text-textDim">Confidence {v}%</div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-2 bg-accent" style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}

