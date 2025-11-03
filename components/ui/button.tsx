import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[rgba(62,243,182,.28)] disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-[hsl(var(--accent))] text-black hover:brightness-105 shadow-glow',
        secondary: 'bg-[hsl(var(--muted))] text-[hsl(var(--text))] hover:bg-white/10',
        ghost: 'hover:bg-white/5',
        outline: 'border border-white/20 hover:bg-white/5'
      },
      size: {
        default: 'h-11 px-5',
        lg: 'h-12 px-6 text-base',
        sm: 'h-9 px-4 text-sm',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { asChild?: boolean }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }

