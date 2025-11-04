import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'field w-full px-3 py-2 text-sm',
        'placeholder:[color:var(--placeholder)]',
        'hover:border-borderHover',
        'focus-visible:[box-shadow:var(--ring),var(--ring-inset)]',
        'transition-colors',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
