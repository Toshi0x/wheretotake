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
      <Dialog.Overlay className="fixed inset-0 bg-[var(--overlay-strong)]" />
      <Dialog.Content
        className={cn(
          'fixed inset-0 h-screen w-screen md:top-0 md:inset-y-0 md:h-full md:w-[88vw] md:max-w-sm bg-card border border-border p-5 shadow-soft focus:outline-none',
          side === 'left' ? 'md:left-0' : 'md:right-0',
          className
        )}
        {...props}
      >
        {props.children}
        <Dialog.Close aria-label="Close" className="absolute right-3 top-3 rounded-full p-2 text-textDim hover:bg-muted focus-ring">
          <X size={18} />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
