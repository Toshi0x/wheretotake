import * as React from 'react'
import { cn } from '@/lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'field min-h-[90px] w-full px-3 py-2 text-sm',
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
Textarea.displayName = 'Textarea'

export { Textarea }
