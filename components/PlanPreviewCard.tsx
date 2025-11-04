"use client"
import * as React from 'react'
import { Button } from '@/components/ui/button'

export default function PlanPreviewCard({ plan, onUse, onShuffle }: { plan: { steps: any[]; note?: string }; onUse: ()=>void; onShuffle: ()=>void }) {
  const s = plan.steps || []
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="space-y-2">
        {s.map((st:any,idx:number)=> (
          <div key={idx} className="text-sm">
            <div className="font-medium">{st.start} {st.place?.name} ({st.place?.area})</div>
            {idx < s.length-1 && <div className="text-textDim">{Math.max(5, st.travel||8)}m hop</div>}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Button onClick={onUse}>Use this plan</Button>
        <Button variant="secondary" onClick={onShuffle}>Shuffle</Button>
      </div>
    </div>
  )
}

