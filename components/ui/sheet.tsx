"use client"
import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close

export function SheetContent({ side = 'left', className, ...props }: { side?: 'left'|'right'; className?: string } & React.ComponentPropsWithoutRef<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/70" />
      <Dialog.Content
        className={cn('fixed top-0 h-full w-[88vw] max-w-sm bg-[hsl(var(--card))] p-5 focus:outline-none', side === 'left' ? 'left-0' : 'right-0', className)}
        {...props}
      >
        {props.children}
        <Dialog.Close aria-label="Close" className="absolute right-3 top-3 rounded-full p-2 text-white/70 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[rgba(62,243,182,.28)]">
          <X size={18} />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

