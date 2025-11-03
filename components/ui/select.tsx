import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn('h-11 w-full rounded-xl bg-card text-text border border-border px-3 text-sm focus-ring', className)}
      {...props}
    >
      {children}
    </select>
  )
}
