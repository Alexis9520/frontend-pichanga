'use client'

import * as React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, BorderGlow } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'

interface HeroIngresosProps {
  ingresosHoy: number
  ingresosAyer: number
  ingresosCanchas: number
  ingresosExtras: number
  reservasHoy: number
  ocupacionActual: number
  slotsOcupados: number
  slotsTotales: number
}

export function HeroIngresos({
  ingresosHoy,
  ingresosAyer,
  ingresosCanchas,
  ingresosExtras,
  reservasHoy,
  ocupacionActual,
  slotsOcupados,
  slotsTotales,
}: HeroIngresosProps) {
  // Calcular tendencia
  const tendencia =
    ingresosAyer > 0 ? Math.round(((ingresosHoy - ingresosAyer) / ingresosAyer) * 100) : 0
  const tendenciaPositiva = tendencia >= 0

  // Calcular porcentajes para el donut
  const total = ingresosCanchas + ingresosExtras
  const porcentajeCanchas = total > 0 ? Math.round((ingresosCanchas / total) * 100) : 0
  const porcentajeExtras = 100 - porcentajeCanchas

  // Ángulos para el donut chart
  const canchasAngle = (porcentajeCanchas / 100) * 360
  const extrasAngle = (porcentajeExtras / 100) * 360

  return (
    <BorderGlow
      variant="primary"
      borderRadius={16}
      glowRadius={25}
      glowIntensity={0.6}
      className="p-0"
    >
      <div className="grid md:grid-cols-2">
        {/* Sección de ingresos */}
        <div className="from-primary/10 via-primary/5 bg-gradient-to-br to-transparent p-6">
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Ingresos de Hoy
          </p>

          <div className="mt-2">
            <span className="text-4xl font-bold tracking-tight">{formatCurrency(ingresosHoy)}</span>
          </div>

          {/* Tendencia */}
          <div className="mt-3 flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium',
                tendenciaPositiva
                  ? 'bg-green-500/10 text-green-600'
                  : tendencia < 0
                    ? 'bg-red-500/10 text-red-600'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {tendenciaPositiva ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : tendencia < 0 ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
              {Math.abs(tendencia)}%
            </div>
            <span className="text-muted-foreground text-sm">vs ayer</span>
          </div>

          {/* Stats rápidos */}
          <div className="mt-6 flex gap-4">
            <div>
              <p className="text-2xl font-bold">{reservasHoy}</p>
              <p className="text-muted-foreground text-xs">Reservas</p>
            </div>
            <div className="border-border border-l pl-4">
              <p className="text-2xl font-bold">{ocupacionActual}%</p>
              <p className="text-muted-foreground text-xs">Ocupación</p>
            </div>
          </div>
        </div>

        {/* Sección de donut + ocupación */}
        <div className="flex flex-col justify-between p-6">
          {/* Donut Chart */}
          <div className="flex items-center gap-6">
            <div className="relative h-28 w-28 shrink-0">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted/30"
                />
                {/* Canchas segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(canchasAngle / 360) * 251.2} 251.2`}
                  className="text-primary"
                />
                {/* Extras segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(extrasAngle / 360) * 251.2} 251.2`}
                  strokeDashoffset={`${-((canchasAngle / 360) * 251.2)}`}
                  className="text-secondary"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold">{porcentajeCanchas}%</span>
                <span className="text-muted-foreground text-[10px]">Canchas</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary h-3 w-3 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Canchas</p>
                  <p className="text-muted-foreground text-xs">{formatCurrency(ingresosCanchas)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-secondary h-3 w-3 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Extras</p>
                  <p className="text-muted-foreground text-xs">{formatCurrency(ingresosExtras)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de ocupación */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Slots ocupados</span>
              <span className="text-sm font-medium">
                {slotsOcupados}/{slotsTotales}
              </span>
            </div>
            <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${ocupacionActual}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </BorderGlow>
  )
}
