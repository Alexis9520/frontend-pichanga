'use client'

import * as React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: number // porcentaje
  trendLabel?: string
  color?: 'primary' | 'success' | 'warning' | 'info' | 'destructive'
  prefix?: string
  suffix?: string
  onClick?: () => void
}

const COLOR_CONFIG = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
  },
  info: {
    bg: 'bg-info/10',
    text: 'text-info',
  },
  destructive: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
  },
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  color = 'primary',
  prefix,
  suffix,
  onClick,
}: MetricCardProps) {
  const colorConfig = COLOR_CONFIG[color]

  return (
    <Card
      className={cn('transition-shadow hover:shadow-md', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold">
              {prefix}
              {typeof value === 'number' ? value.toLocaleString('es-PE') : value}
              {suffix}
            </p>
            {(trend !== undefined || description) && (
              <div className="mt-1 flex items-center gap-1.5 text-xs">
                {trend !== undefined && (
                  <span
                    className={cn(
                      'flex items-center gap-0.5 font-medium',
                      trend > 0
                        ? 'text-success'
                        : trend < 0
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                    )}
                  >
                    {trend > 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : trend < 0 ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {Math.abs(trend)}%
                  </span>
                )}
                {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
                {description && !trendLabel && (
                  <span className="text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn('rounded-lg p-2.5', colorConfig.bg)}>
            <Icon className={cn('h-5 w-5', colorConfig.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
