import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        success:
          'border-transparent bg-primary/10 text-primary border-primary/20',
        warning:
          'border-transparent bg-secondary/10 text-secondary border-secondary/20',
        info: 'border-transparent bg-blue-500/10 text-blue-600 border-blue-500/20',
        pending: 'border-transparent bg-amber-500/10 text-amber-600 border-amber-500/20',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'mr-1.5 h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-primary',
            variant === 'warning' && 'bg-secondary',
            variant === 'destructive' && 'bg-destructive',
            variant === 'pending' && 'bg-amber-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'default' && 'bg-primary-foreground'
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }