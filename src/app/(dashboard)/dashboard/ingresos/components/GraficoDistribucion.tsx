'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { IngresoPorMetodoPago, IngresoPorCategoria } from '../types'

interface ItemDistribucion {
  label: string
  value: number
  cantidad?: number
  color?: string
  icon?: string
}

interface GraficoDistribucionProps {
  datos: ItemDistribucion[]
  titulo?: string
  tipo?: 'donut' | 'pie' | 'barra'
  showCantidad?: boolean
  colores?: string[]
}

const COLORES_DEFAULT = [
  'bg-primary',
  'bg-secondary',
  'bg-success',
  'bg-warning',
  'bg-info',
  'bg-destructive',
]

export function GraficoDistribucion({
  datos,
  titulo,
  tipo = 'donut',
  showCantidad = false,
  colores = COLORES_DEFAULT,
}: GraficoDistribucionProps) {
  // Calcular total
  const total = React.useMemo(() => {
    return datos.reduce((acc, d) => acc + d.value, 0)
  }, [datos])

  // Asignar colores
  const datosConColor = React.useMemo(() => {
    return datos.map((d, i) => ({
      ...d,
      color: d.color || colores[i % colores.length],
      porcentaje: total > 0 ? (d.value / total) * 100 : 0,
    }))
  }, [datos, colores, total])

  if (datos.length === 0) {
    return (
      <div className="border-border rounded-lg border-2 border-dashed p-8 text-center">
        <p className="text-muted-foreground">No hay datos para mostrar</p>
      </div>
    )
  }

  // Gráfico tipo barra horizontal
  if (tipo === 'barra') {
    return (
      <div className="space-y-4">
        {titulo && <h3 className="text-sm font-semibold">{titulo}</h3>}

        <div className="space-y-3">
          {datosConColor.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              {/* Barra */}
              <div className="bg-muted h-6 flex-1 overflow-hidden rounded">
                <div
                  className={cn('h-full rounded transition-all', item.color)}
                  style={{ width: `${item.porcentaje}%`, minWidth: '4px' }}
                />
              </div>

              {/* Info */}
              <div className="flex min-w-[100px] items-center gap-2">
                <span className="text-xs font-medium">{item.porcentaje.toFixed(1)}%</span>
                {showCantidad && item.cantidad && (
                  <span className="text-muted-foreground text-xs">({item.cantidad})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Gráfico tipo donut/pie (simulado con CSS)
  const gradientStops = datosConColor
    .map((item, i) => {
      const start =
        i === 0 ? 0 : datosConColor.slice(0, i).reduce((acc, d) => acc + d.porcentaje, 0)
      const end = start + item.porcentaje
      return `${item.color.replace('bg-', '')} ${start}% ${end}%`
    })
    .join(', ')

  return (
    <div className="space-y-4">
      {titulo && <h3 className="text-sm font-semibold">{titulo}</h3>}

      <div className="flex items-center gap-6">
        {/* Donut visual */}
        <div className="relative h-24 w-24 flex-shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${datosConColor
                .map((item) => {
                  // Convert bg-primary to actual color
                  const colorMap: Record<string, string> = {
                    'bg-primary': 'hsl(142 76% 36%)',
                    'bg-secondary': 'hsl(15 100% 63%)',
                    'bg-success': 'hsl(142 76% 36%)',
                    'bg-warning': 'hsl(45 93% 47%)',
                    'bg-info': 'hsl(200 80% 50%)',
                    'bg-destructive': 'hsl(0 84% 60%)',
                    'bg-muted': 'hsl(240 5% 26%)',
                  }
                  const color = colorMap[item.color] || 'hsl(240 5% 26%)'
                  const start =
                    datosConColor.indexOf(item) === 0
                      ? 0
                      : datosConColor
                          .slice(0, datosConColor.indexOf(item))
                          .reduce((acc, d) => acc + d.porcentaje, 0)
                  return `${color} ${start}% ${start + item.porcentaje}%`
                })
                .join(', ')})`,
            }}
          />
          {/* Centro blanco para donut */}
          {tipo === 'donut' && (
            <div className="bg-card absolute inset-4 flex items-center justify-center rounded-full">
              <span className="text-xs font-bold">{datos.length}</span>
            </div>
          )}
        </div>

        {/* Lista */}
        <div className="flex-1 space-y-2">
          {datosConColor.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn('h-3 w-3 rounded', item.color)} />
              <span className="flex-1 truncate text-xs">
                {item.icon && `${item.icon} `}
                {item.label}
              </span>
              <span className="text-xs font-medium">{item.porcentaje.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
