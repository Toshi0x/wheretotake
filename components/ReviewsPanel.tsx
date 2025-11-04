"use client"
import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ReviewsPanel({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (o:boolean)=>void; title: string; children: React.ReactNode }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[var(--overlay-strong)]" />
        <Dialog.Content className={cn('fixed inset-x-0 bottom-0 h-[85vh] md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[88vw] md:max-w-lg bg-card border border-border p-5 shadow-soft focus:outline-none')}> 
          <div className="flex items-center justify-between mb-3">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Close aria-label="Close" className="rounded-full p-2 text-textDim hover:bg-muted focus-ring"><X size={18} /></Dialog.Close>
          </div>
          <div className="overflow-y-auto max-h-[calc(85vh-3rem)] md:max-h-[calc(100vh-3rem)] pr-1">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

