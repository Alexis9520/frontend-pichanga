'use client'

import * as React from 'react'
import {
  Lightbulb,
  TrendingDown,
  X,
  Calendar,
  Clock,
  MapPin,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { SugerenciaBajaDemanda } from '../types'

interface SugerenciasImpactoPanelProps {
  sugerencias: SugerenciaBajaDemanda[]
  onCrearPromocion: (sugerencia: SugerenciaBajaDemanda) => void
  onDescartar: (id: string) => void
}

export function SugerenciasImpactoPanel({
  sugerencias,
  onCrearPromocion,
  onDescartar,
}: SugerenciasImpactoPanelProps) {
  if (sugerencias.length === 0) return null

  return (
    <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
            <Lightbulb className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <span>Sugerencias para aumentar reservas</span>
            <p className="text-muted-foreground text-xs font-normal">
              Detectamos {sugerencias.length} horario{sugerencias.length !== 1 ? 's' : ''} con baja
              ocupación
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sugerencias.map((sugerencia) => (
            <SugerenciaCard
              key={sugerencia.id}
              sugerencia={sugerencia}
              onCrear={() => onCrearPromocion(sugerencia)}
              onDescartar={() => onDescartar(sugerencia.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface SugerenciaCardProps {
  sugerencia: SugerenciaBajaDemanda
  onCrear: () => void
  onDescartar: () => void
}

function SugerenciaCard({ sugerencia, onCrear, onDescartar }: SugerenciaCardProps) {
  // Calcular impacto estimado (mock)
  const reservasActuales = sugerencia.reservasActuales || 1
  const impactoEstimado = Math.round(reservasActuales * 2.5)

  // Determinar severidad de la ocupación
  const ocupacion = sugerencia.ocupacionActual
  const ocupacionColor =
    ocupacion < 30
      ? 'text-red-600 bg-red-500/10'
      : ocupacion < 50
        ? 'text-amber-600 bg-amber-500/10'
        : 'text-blue-600 bg-blue-500/10'

  // Tipo de descuento
  const valorDescuento =
    sugerencia.promocionSugerida.tipo === 'descuento_porcentual'
      ? `${sugerencia.promocionSugerida.valor}% OFF`
      : formatCurrency(sugerencia.promocionSugerida.valor)

  return (
    <div className="border-border bg-background group relative rounded-xl border p-4 transition-all hover:shadow-md">
      {/* Botón descartar */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={onDescartar}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Header con día y hora */}
      <div className="mb-3 flex items-center gap-2">
        <Badge variant="outline" className="gap-1">
          <Calendar className="h-3 w-3" />
          {sugerencia.diaNombre}
        </Badge>
        <Badge variant="secondary" size="sm" className="gap-1">
          <Clock className="h-3 w-3" />
          {sugerencia.horaInicio} - {sugerencia.horaFin}
        </Badge>
      </div>

      {/* Cancha */}
      <div className="mb-3 flex items-center gap-1.5 text-sm">
        <MapPin className="text-muted-foreground h-3.5 w-3.5" />
        <span className="font-medium">{sugerencia.canchaNombre}</span>
      </div>

      {/* Ocupación visual */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Ocupación actual</span>
          <span className={cn('text-sm font-bold', ocupacionColor.split(' ')[0])}>
            {ocupacion}%
          </span>
        </div>
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className={cn('h-full rounded-full transition-all', ocupacionColor.split(' ')[1])}
            style={{ width: `${ocupacion}%` }}
          />
        </div>
      </div>

      {/* Sugerencia de promoción */}
      <div className="bg-primary/5 mb-3 rounded-lg p-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-4 w-4" />
          <span className="text-sm font-medium">{valorDescuento}</span>
        </div>
        <p className="text-muted-foreground mt-1 text-xs">{sugerencia.promocionSugerida.nombre}</p>
      </div>

      {/* Impacto estimado */}
      <div className="mb-3 flex items-center justify-between rounded-lg bg-green-500/10 p-2">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-green-600" />
          <span className="text-xs font-medium text-green-600">Impacto estimado</span>
        </div>
        <span className="text-sm font-bold text-green-600">+{impactoEstimado} reservas/sem</span>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={onCrear}>
          Crear promoción
        </Button>
        <Button variant="ghost" size="sm" onClick={onDescartar}>
          Descartar
        </Button>
      </div>
    </div>
  )
}
