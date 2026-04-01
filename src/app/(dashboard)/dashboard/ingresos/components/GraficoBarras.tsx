'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { IngresoPorDia } from '../types'

interface GraficoBarrasProps {
  datos: IngresoPorDia[]
  titulo?: string
  colorReservas?: string
  colorExtras?: string
  maxItems?: number
}

export function GraficoBarras({
  datos,
  titulo = 'Ingresos por día',
  colorReservas = 'bg-primary',
  colorExtras = 'bg-secondary',
  maxItems = 14,
}: GraficoBarrasProps) {
  // Limitar datos y ordenar
  const datosLimitados = React.useMemo(() => {
    return [...datos].reverse().slice(0, maxItems)
  }, [datos, maxItems])

  // Calcular máximo para escala
  const maxValue = React.useMemo(() => {
    return Math.max(...datosLimitados.map((d) => d.totalIngresos), 1)
  }, [datosLimitados])

  // Formatear valores
  const formatValue = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
    return v.toString()
  }

  if (datosLimitados.length === 0) {
    return (
      <div className="border-border rounded-lg border-2 border-dashed p-8 text-center">
        <p className="text-muted-foreground">No hay datos para mostrar</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {titulo && <h3 className="text-sm font-semibold">{titulo}</h3>}

      {/* Gráfico */}
      <div className="flex h-64 items-end justify-between gap-2 px-2">
        {datosLimitados.map((item) => {
          const heightTotal = (item.totalIngresos / maxValue) * 100
          const heightReservas = (item.ingresosReservas / item.totalIngresos) * 100
          const heightExtras = (item.ingresosExtras / item.totalIngresos) * 100

          return (
            <div key={item.fecha} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              {/* Tooltip info */}
              <div className="bg-popover pointer-events-none absolute -top-8 z-10 rounded border px-2 py-1 text-center text-xs opacity-0 transition-opacity hover:opacity-100">
                <p className="font-medium">{item.totalIngresos}</p>
              </div>

              {/* Barra */}
              <div
                className="flex w-full flex-col gap-0.5 rounded-t transition-all hover:opacity-80"
                style={{ height: `${Math.max(heightTotal, 2)}%` }}
              >
                {/* Reservas */}
                <div
                  className={cn('w-full rounded-t', colorReservas)}
                  style={{ height: `${heightReservas}%`, minHeight: '2px' }}
                />
                {/* Extras */}
                <div
                  className={cn('w-full rounded-b', colorExtras)}
                  style={{ height: `${heightExtras}%`, minHeight: '2px' }}
                />
              </div>

              {/* Label día */}
              <span className="text-muted-foreground w-full truncate text-center text-xs">
                {item.diaNombre.slice(0, 3)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded', colorReservas)} />
          <span className="text-muted-foreground text-xs">Reservas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded', colorExtras)} />
          <span className="text-muted-foreground text-xs">Extras</span>
        </div>
      </div>
    </div>
  )
}
