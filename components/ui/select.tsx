import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'field w-full h-11 px-3 text-sm',
        'placeholder:[color:var(--placeholder)]',
        'hover:border-borderHover',
        'focus-visible:[box-shadow:var(--ring),var(--ring-inset)]',
        'transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}
