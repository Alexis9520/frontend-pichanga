'use client'

import * as React from 'react'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge, BorderGlow } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'

interface DiaData {
  dia: string
  fecha: string
  reservas: number
  ingresos: number
  esHoy?: boolean
}

interface AreaChartWidgetProps {
  datos: DiaData[]
  titulo?: string
  comparativa?: number // porcentaje vs período anterior
  totalReservas?: number
  totalIngresos?: number
}

export function AreaChartWidget({
  datos,
  titulo = 'Esta Semana',
  comparativa,
  totalReservas,
  totalIngresos,
}: AreaChartWidgetProps) {
  const maxValue = Math.max(...datos.map((d) => d.ingresos), 1)
  const comparativaPositiva = comparativa !== undefined && comparativa >= 0

  return (
    <BorderGlow variant="primary" borderRadius={12}>
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {titulo}
            </span>
            {comparativa !== undefined && (
              <Badge
                variant={comparativaPositiva ? 'success' : 'destructive'}
                className="flex items-center gap-1"
              >
                {comparativaPositiva ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(comparativa)}% vs anterior
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Gráfico de área SVG */}
          <div className="relative h-40 w-full">
            <svg
              className="h-full w-full overflow-visible"
              viewBox="0 0 400 140"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <line x1="0" y1="35" x2="400" y2="35" className="stroke-border/30" strokeWidth="1" />
              <line x1="0" y1="70" x2="400" y2="70" className="stroke-border/30" strokeWidth="1" />
              <line
                x1="0"
                y1="105"
                x2="400"
                y2="105"
                className="stroke-border/30"
                strokeWidth="1"
              />

              {/* Área gradient definition */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Área */}
              <AreaPath datos={datos} maxValue={maxValue} />

              {/* Línea superior */}
              <LinePath datos={datos} maxValue={maxValue} />

              {/* Puntos */}
              {datos.map((d, i) => {
                const x = (i / (datos.length - 1)) * 400
                const y = 140 - (d.ingresos / maxValue) * 120
                return (
                  <g key={d.fecha}>
                    <circle
                      cx={x}
                      cy={y}
                      r={d.esHoy ? 6 : 4}
                      className={cn(
                        'transition-all',
                        d.esHoy
                          ? 'fill-primary stroke-background'
                          : 'fill-primary/80 stroke-background'
                      )}
                      strokeWidth={d.esHoy ? 2 : 1}
                    />
                    {d.esHoy && (
                      <circle
                        cx={x}
                        cy={y}
                        r={10}
                        className="fill-primary/20 stroke-primary/30 animate-pulse"
                        strokeWidth="1"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Tooltip con valores del día */}
            <div className="absolute right-0 bottom-0 left-0 flex justify-between px-1">
              {datos.map((d) => (
                <div
                  key={d.fecha}
                  className={cn(
                    'flex flex-col items-center text-[10px]',
                    d.esHoy ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}
                >
                  <span className={cn(d.esHoy && 'font-bold')}>{d.dia}</span>
                  {d.ingresos > 0 && <span className="text-[9px]">S/{d.ingresos}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Stats resumen */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">
                {totalReservas || datos.reduce((acc, d) => acc + d.reservas, 0)}
              </p>
              <p className="text-muted-foreground text-xs">Reservas</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 text-center">
              <p className="text-primary text-xl font-bold">
                {formatCurrency(totalIngresos || datos.reduce((acc, d) => acc + d.ingresos, 0))}
              </p>
              <p className="text-muted-foreground text-xs">Ingresos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </BorderGlow>
  )
}

// Componente para el path del área
function AreaPath({ datos, maxValue }: { datos: DiaData[]; maxValue: number }) {
  if (datos.length < 2) return null

  const points = datos.map((d, i) => {
    const x = (i / (datos.length - 1)) * 400
    const y = 140 - (d.ingresos / maxValue) * 120
    return `${x},${y}`
  })

  // Cerrar el path hacia abajo
  const areaPath = `M 0,140 L ${points.join(' L ')} L 400,140 Z`

  return <path d={areaPath} fill="url(#areaGradient)" />
}

// Componente para la línea
function LinePath({ datos, maxValue }: { datos: DiaData[]; maxValue: number }) {
  if (datos.length < 2) return null

  const points = datos.map((d, i) => {
    const x = (i / (datos.length - 1)) * 400
    const y = 140 - (d.ingresos / maxValue) * 120
    return `${x},${y}`
  })

  return (
    <path
      d={`M ${points.join(' L ')}`}
      fill="none"
      stroke="hsl(142, 76%, 36%)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-sm"
    />
  )
}
