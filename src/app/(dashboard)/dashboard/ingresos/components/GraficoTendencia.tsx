'use client'

import * as React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { TendenciaMensual } from '../types'

interface GraficoTendenciaProps {
  datos: TendenciaMensual[]
  titulo?: string
  colorLinea?: string
}

export function GraficoTendencia({
  datos,
  titulo = 'Tendencia mensual',
  colorLinea = 'stroke-primary',
}: GraficoTendenciaProps) {
  // Calcular escala - siempre calcular aunque datos esté vacío
  const maxValue = React.useMemo(() => {
    if (datos.length === 0) return 0
    return Math.max(...datos.map((d) => d.totalIngresos))
  }, [datos])

  const minValue = React.useMemo(() => {
    if (datos.length === 0) return 0
    return Math.min(...datos.map((d) => d.totalIngresos))
  }, [datos])

  const range = maxValue - minValue || 1

  // Generar puntos SVG
  const points = React.useMemo(() => {
    if (datos.length === 0) return []

    const width = 100 // porcentaje
    const height = 100 // porcentaje
    const padding = 5

    return datos.map((d, i) => {
      const x = padding + (i / (datos.length - 1 || 1)) * (width - 2 * padding)
      const y = padding + ((maxValue - d.totalIngresos) / range) * (height - 2 * padding)
      return { x, y, data: d }
    })
  }, [datos, maxValue, range])

  // Path para la línea
  const linePath = React.useMemo(() => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  }, [points])

  // Path para el área
  const areaPath = React.useMemo(() => {
    if (points.length === 0) return ''
    return `${linePath} L ${points[points.length - 1]?.x || 100} 100 L ${points[0]?.x || 0} 100 Z`
  }, [linePath, points])

  // Early return después de los hooks
  if (datos.length === 0) {
    return (
      <div className="border-border rounded-lg border-2 border-dashed p-8 text-center">
        <p className="text-muted-foreground">No hay datos históricos</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {titulo && <h3 className="text-sm font-semibold">{titulo}</h3>}

      {/* SVG Gráfico */}
      <div className="relative h-48">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          {/* Área */}
          <path d={areaPath} fill="hsl(142 76% 36% / 0.1)" className="fill-primary/10" />

          {/* Línea */}
          <path
            d={linePath}
            fill="none"
            className={cn(colorLinea, 'stroke-2')}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Puntos */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="hsl(142 76% 36%)"
              className="fill-primary"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Labels mes */}
        <div className="absolute right-0 bottom-0 left-0 flex justify-between px-2">
          {datos.map((d) => (
            <span key={d.mes} className="text-muted-foreground text-xs">
              {d.mesNombre.slice(0, 3)}
            </span>
          ))}
        </div>

        {/* Valores en puntos */}
        <div className="absolute top-0 right-0 left-0 flex justify-between px-2">
          {points.slice(0, 3).map((p, i) => (
            <span key={i} className="text-xs font-medium">
              {formatCurrency(p.data.totalIngresos)}
            </span>
          ))}
        </div>
      </div>

      {/* Indicadores de tendencia */}
      <div className="grid grid-cols-3 gap-2">
        {datos.slice(-3).map((d) => (
          <div key={d.mes} className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-muted-foreground text-xs">{d.mesNombre}</p>
            <p className="text-sm font-bold">{formatCurrency(d.totalIngresos)}</p>
            <div className="mt-1 flex items-center justify-center gap-1">
              {d.comparativaAnterior > 0 ? (
                <TrendingUp className="text-success h-3 w-3" />
              ) : d.comparativaAnterior < 0 ? (
                <TrendingDown className="text-destructive h-3 w-3" />
              ) : (
                <Minus className="text-muted-foreground h-3 w-3" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  d.comparativaAnterior > 0
                    ? 'text-success'
                    : d.comparativaAnterior < 0
                      ? 'text-destructive'
                      : ''
                )}
              >
                {d.comparativaAnterior > 0 ? '+' : ''}
                {d.comparativaAnterior}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
