'use client'

import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    type: 'up' | 'down' | 'neutral'
  }
  icon?: LucideIcon
  className?: string
}

export function KPICard({ title, value, subtitle, trend, icon: Icon, className }: KPICardProps) {
  const TrendIcon =
    trend?.type === 'up' ? TrendingUp : trend?.type === 'down' ? TrendingDown : Minus

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="bg-primary/10 rounded-lg p-2.5">
              <Icon className="text-primary h-5 w-5" />
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1.5">
            <TrendIcon
              className={cn(
                'h-4 w-4',
                trend.type === 'up' && 'text-green-500',
                trend.type === 'down' && 'text-red-500',
                trend.type === 'neutral' && 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-xs font-medium',
                trend.type === 'up' && 'text-green-500',
                trend.type === 'down' && 'text-red-500',
                trend.type === 'neutral' && 'text-muted-foreground'
              )}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}% vs ayer
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
