'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3 } from 'lucide-react'
import type { DailyRevenue, FinancePeriod } from '../../types'

interface RevenueChartProps {
  data: DailyRevenue[]
  period: FinancePeriod
}

// Format date based on period
function formatDateLabel(dateStr: string, period: FinancePeriod): string {
  const date = new Date(dateStr)

  if (period === 'today') {
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  }
  if (period === 'week') {
    return date.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' })
  }
  if (period === 'month') {
    return date.toLocaleDateString('es-PE', { day: 'numeric' })
  }
  return date.toLocaleDateString('es-PE', { month: 'short' })
}

// Simple bar chart using CSS (no external chart library)
function SimpleBarChart({ data, period }: { data: DailyRevenue[]; period: FinancePeriod }) {
  const maxValue = Math.max(...data.map((d) => d.total))
  const chartHeight = 200

  // Aggregate data if too many points
  const displayData = React.useMemo(() => {
    if (period === 'year' && data.length > 12) {
      // Aggregate by month
      const monthly: { [key: string]: DailyRevenue } = {}
      data.forEach((d) => {
        const month = d.date.substring(0, 7) // YYYY-MM
        if (!monthly[month]) {
          monthly[month] = { ...d, date: month + '-01' }
        } else {
          monthly[month].reservations += d.reservations
          monthly[month].extras += d.extras
          monthly[month].total += d.total
          monthly[month].commission += d.commission
          monthly[month].reservationCount += d.reservationCount
        }
      })
      return Object.values(monthly)
    }
    if (period === 'month' && data.length > 15) {
      // Show every other day
      return data.filter((_, i) => i % 2 === 0)
    }
    return data
  }, [data, period])

  return (
    <div className="relative">
      {/* Y-axis labels */}
      <div className="text-muted-foreground absolute top-0 left-0 flex h-[200px] flex-col justify-between text-xs">
        <span>S/{(maxValue / 1000).toFixed(0)}k</span>
        <span>S/{(maxValue / 2000).toFixed(0)}k</span>
        <span>S/0</span>
      </div>

      {/* Chart area */}
      <div className="ml-12 flex h-[200px] items-end gap-1 overflow-x-auto pb-4">
        {displayData.map((day, i) => {
          const height = (day.total / maxValue) * chartHeight
          const reservationsHeight = (day.reservations / day.total) * height
          const extrasHeight = (day.extras / day.total) * height

          return (
            <div
              key={day.date}
              className="group relative flex flex-col items-center"
              style={{ minWidth: period === 'today' ? '60px' : '30px' }}
            >
              {/* Stacked bar */}
              <div
                className="relative w-full rounded-t-sm transition-all group-hover:opacity-80"
                style={{ height: `${height}px`, minWidth: period === 'today' ? '50px' : '24px' }}
              >
                {/* Reservations portion */}
                <div
                  className="absolute right-0 bottom-0 left-0 rounded-t-sm bg-green-500"
                  style={{ height: `${reservationsHeight}px` }}
                />
                {/* Extras portion */}
                <div
                  className="absolute right-0 left-0 rounded-t-sm bg-blue-400"
                  style={{ height: `${extrasHeight}px`, bottom: `${reservationsHeight}px` }}
                />
              </div>

              {/* X-axis label */}
              <span className="text-muted-foreground mt-2 text-[10px]">
                {formatDateLabel(day.date, period)}
              </span>

              {/* Tooltip */}
              <div className="bg-card absolute -top-16 left-1/2 z-10 hidden -translate-x-1/2 rounded-lg border p-2 shadow-lg group-hover:block">
                <p className="text-xs font-medium">{formatDateLabel(day.date, period)}</p>
                <p className="text-xs text-green-600">
                  Reservas: S/{day.reservations.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600">Extras: S/{day.extras.toLocaleString()}</p>
                <p className="text-xs font-medium">Total: S/{day.total.toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function RevenueChart({ data, period }: RevenueChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.total, 0)
  const avgDaily = totalRevenue / data.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Ingresos por Día
          </CardTitle>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Total período</p>
            <p className="font-bold text-green-600">S/{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <SimpleBarChart data={data} period={period} />

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-green-500" />
                <span className="text-muted-foreground text-xs">Reservas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-blue-400" />
                <span className="text-muted-foreground text-xs">Extras</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Promedio diario</p>
                <p className="text-sm font-medium">S/{Math.round(avgDaily).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Día más alto</p>
                <p className="text-sm font-medium">
                  S/{Math.max(...data.map((d) => d.total)).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Día más bajo</p>
                <p className="text-sm font-medium">
                  S/{Math.min(...data.map((d) => d.total)).toLocaleString()}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <TrendingUp className="text-muted-foreground mx-auto h-8 w-8" />
              <p className="text-muted-foreground mt-2 text-sm">Sin datos para mostrar</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
