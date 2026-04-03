'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`text-primary animate-spin ${sizeClasses[size]}`} />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )
}

// Full page loading
export function PageLoading({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

// Inline loading for tables/cards
export function InlineLoading({ text }: { text?: string }) {
  return <LoadingSpinner size="sm" text={text} />
}

// Skeleton loading for cards
export function CardSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="space-y-3">
        <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
        <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
        <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
      </div>
    </div>
  )
}

// Skeleton for table rows
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="bg-muted h-4 w-full animate-pulse rounded" />
        </td>
      ))}
    </tr>
  )
}

// Skeleton for KPI cards
export function KPISkeleton() {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="space-y-3">
        <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
        <div className="bg-muted h-8 w-3/4 animate-pulse rounded" />
        <div className="bg-muted h-2 w-1/3 animate-pulse rounded" />
      </div>
    </div>
  )
}
