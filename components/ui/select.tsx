import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn('h-11 w-full rounded-xl bg-white/5 border border-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(62,243,182,.28)]', className)}
      {...props}
    >
      {children}
    </select>
  )
}

