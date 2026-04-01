'use client'

import * as React from 'react'
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  BarChart3,
} from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { IngresoPorCancha, ReservaIngreso } from '../types'

interface CanchasTabProps {
  ingresosPorCancha: IngresoPorCancha[]
  topCanchas: IngresoPorCancha[]
  reservas: ReservaIngreso[]
}

export function CanchasTab({ ingresosPorCancha, topCanchas, reservas }: CanchasTabProps) {
  const [selectedCancha, setSelectedCancha] = React.useState<string | null>(null)

  // Totales
  const totalIngresos = ingresosPorCancha.reduce((acc, c) => acc + c.totalIngresos, 0)
  const totalReservas = ingresosPorCancha.reduce((acc, c) => acc + c.totalReservas, 0)

  // Cancha seleccionada detalle
  const canchaDetalle = React.useMemo(() => {
    if (!selectedCancha) return null
    return ingresosPorCancha.find((c) => c.canchaId === selectedCancha)
  }, [selectedCancha, ingresosPorCancha])

  // Reservas de la cancha seleccionada
  const reservasCancha = React.useMemo(() => {
    if (!selectedCancha) return []
    return reservas.filter((r) => r.canchaId === selectedCancha)
  }, [selectedCancha, reservas])

  // Horarios más reservados de la cancha
  const horariosCancha = React.useMemo(() => {
    if (!selectedCancha) return []
    const grupos: Record<string, number> = {}
    reservasCancha.forEach((r) => {
      const key = `${r.horaInicio}-${r.horaFin}`
      grupos[key] = (grupos[key] || 0) + 1
    })
    return Object.entries(grupos)
      .map(([horario, count]) => ({ horario, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [selectedCancha, reservasCancha])

  return (
    <div className="space-y-6">
      {/* Ranking de canchas */}
      <div className="grid gap-4 sm:grid-cols-3">
        {ingresosPorCancha.map((cancha, index) => {
          const isSelected = selectedCancha === cancha.canchaId
          const porcentajeTotal =
            totalIngresos > 0 ? (cancha.totalIngresos / totalIngresos) * 100 : 0

          return (
            <Card
              key={cancha.canchaId}
              className={cn(
                'cursor-pointer p-4 transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 ring-primary ring-2'
                  : 'hover:border-primary/50'
              )}
              onClick={() => setSelectedCancha(isSelected ? null : cancha.canchaId)}
            >
              {/* Header */}
              <div className="mb-3 flex items-center gap-2">
                {index === 0 && (
                  <div className="bg-warning/20 flex h-6 w-6 items-center justify-center rounded-full">
                    <Trophy className="text-warning h-3 w-3" />
                  </div>
                )}
                <h4 className="flex-1 font-medium">{cancha.canchaNombre}</h4>
                <Badge variant={index === 0 ? 'warning' : 'outline'} size="sm">
                  #{index + 1}
                </Badge>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Ingresos</span>
                  <span className="text-primary font-bold">
                    {formatCurrency(cancha.totalIngresos)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Reservas</span>
                  <span className="font-medium">{cancha.totalReservas}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Ticket prom.</span>
                  <span className="font-medium">{formatCurrency(cancha.ticketPromedio)}</span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Participación</span>
                  <span className="font-medium">{porcentajeTotal.toFixed(1)}%</span>
                </div>
                <div className="bg-muted mt-1 h-2 overflow-hidden rounded-full">
                  <div
                    className={cn('h-full rounded-full', index === 0 ? 'bg-warning' : 'bg-primary')}
                    style={{ width: `${porcentajeTotal}%` }}
                  />
                </div>
              </div>

              {/* Comparativa */}
              <div className="mt-3 flex items-center gap-1">
                {cancha.comparativaAnterior >= 0 ? (
                  <>
                    <TrendingUp className="text-success h-3 w-3" />
                    <span className="text-success text-xs font-medium">
                      +{cancha.comparativaAnterior}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="text-destructive h-3 w-3" />
                    <span className="text-destructive text-xs font-medium">
                      {cancha.comparativaAnterior}%
                    </span>
                  </>
                )}
                <span className="text-muted-foreground text-xs">vs anterior</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Detalle de cancha seleccionada */}
      {canchaDetalle && (
        <Card className="bg-muted/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg">
                <MapPin className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{canchaDetalle.canchaNombre}</h3>
                <p className="text-muted-foreground text-sm">Detalle de rendimiento</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedCancha(null)}>
              Cerrar
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Ingresos */}
            <div className="space-y-3">
              <h4 className="text-muted-foreground text-xs font-medium uppercase">Ingresos</h4>
              <div className="bg-card rounded-lg p-3">
                <p className="text-primary text-2xl font-bold">
                  {formatCurrency(canchaDetalle.totalIngresos)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">Reservas:</span>
                  <span className="text-xs font-medium">
                    {formatCurrency(canchaDetalle.ingresosReservas)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">Extras:</span>
                  <span className="text-xs font-medium">
                    {formatCurrency(canchaDetalle.ingresosExtras)}
                  </span>
                </div>
              </div>
            </div>

            {/* Reservas */}
            <div className="space-y-3">
              <h4 className="text-muted-foreground text-xs font-medium uppercase">Reservas</h4>
              <div className="bg-card rounded-lg p-3">
                <p className="text-2xl font-bold">{canchaDetalle.totalReservas}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  Ticket promedio: {formatCurrency(canchaDetalle.ticketPromedio)}
                </p>
              </div>
            </div>

            {/* Ocupación */}
            <div className="space-y-3">
              <h4 className="text-muted-foreground text-xs font-medium uppercase">Ocupación</h4>
              <div className="bg-card rounded-lg p-3">
                <p className="text-2xl font-bold">
                  {canchaDetalle.ocupacionPorcentaje.toFixed(1)}%
                </p>
                <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      canchaDetalle.ocupacionPorcentaje >= 80
                        ? 'bg-success'
                        : canchaDetalle.ocupacionPorcentaje >= 50
                          ? 'bg-warning'
                          : 'bg-destructive'
                    )}
                    style={{ width: `${canchaDetalle.ocupacionPorcentaje}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Comparativa */}
            <div className="space-y-3">
              <h4 className="text-muted-foreground text-xs font-medium uppercase">Tendencia</h4>
              <div className="bg-card rounded-lg p-3">
                <div className="flex items-center gap-2">
                  {canchaDetalle.comparativaAnterior >= 0 ? (
                    <>
                      <TrendingUp className="text-success h-6 w-6" />
                      <span className="text-success text-2xl font-bold">
                        +{canchaDetalle.comparativaAnterior}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="text-destructive h-6 w-6" />
                      <span className="text-destructive text-2xl font-bold">
                        {canchaDetalle.comparativaAnterior}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-muted-foreground mt-2 text-xs">vs período anterior</p>
              </div>
            </div>
          </div>

          {/* Horarios más reservados */}
          {horariosCancha.length > 0 && (
            <div className="mt-6">
              <h4 className="text-muted-foreground mb-3 text-xs font-medium uppercase">
                Horarios más reservados
              </h4>
              <div className="flex flex-wrap gap-2">
                {horariosCancha.map((h) => (
                  <Badge key={h.horario} variant="outline">
                    🕐 {h.horario} ({h.count})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Resumen general */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold">Resumen de todas las canchas</h4>
            <p className="text-muted-foreground text-sm">
              {ingresosPorCancha.length} canchas activas
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-primary text-xl font-bold">{formatCurrency(totalIngresos)}</p>
              <p className="text-muted-foreground text-xs">Total ingresos</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{totalReservas}</p>
              <p className="text-muted-foreground text-xs">Total reservas</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">
                {formatCurrency(totalIngresos / (totalReservas || 1))}
              </p>
              <p className="text-muted-foreground text-xs">Ticket promedio</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
