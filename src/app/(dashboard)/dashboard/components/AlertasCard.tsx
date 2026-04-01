'use client'

import * as React from 'react'
import { Bell, AlertTriangle, Tag, DollarSign, Calendar, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Alerta } from '../types'
import { TIPO_ALERTA_CONFIG, PRIORIDAD_CONFIG } from '../types'

interface AlertasCardProps {
  alertas: Alerta[]
  maxItems?: number
  onAlertaClick?: (alerta: Alerta) => void
}

const ICON_MAP: Record<string, React.ElementType> = {
  stock: AlertTriangle,
  promocion: Tag,
  saldo: DollarSign,
  reserva: Calendar,
  pago: DollarSign,
}

export function AlertasCard({ alertas, maxItems = 5, onAlertaClick }: AlertasCardProps) {
  const alertasVisibles = alertas.slice(0, maxItems)
  const alertasRestantes = alertas.length - maxItems

  // Contar por prioridad
  const altasCount = alertas.filter((a) => a.prioridad === 'alta').length
  const mediasCount = alertas.filter((a) => a.prioridad === 'media').length

  if (alertas.length === 0) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-5 w-5" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-4 text-center text-sm">
            <p className="text-success font-medium">✓ Todo en orden</p>
            <p className="mt-1 text-xs">No hay alertas pendientes</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="gradient">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base">
            <Bell className="h-5 w-5" />
            Alertas
          </span>
          <div className="flex gap-1">
            {altasCount > 0 && (
              <Badge variant="destructive" size="sm">
                {altasCount} {altasCount === 1 ? 'urgente' : 'urgentes'}
              </Badge>
            )}
            {mediasCount > 0 && (
              <Badge variant="warning" size="sm">
                {mediasCount}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4">
        {alertasVisibles.map((alerta) => {
          const tipoConfig = TIPO_ALERTA_CONFIG[alerta.tipo]
          const prioridadConfig = PRIORIDAD_CONFIG[alerta.prioridad]
          const Icon = ICON_MAP[alerta.tipo] || Bell

          return (
            <button
              key={alerta.id}
              onClick={() => onAlertaClick?.(alerta)}
              className="hover:bg-muted/50 w-full rounded-lg p-2 text-left transition-colors"
            >
              <div className="flex items-start gap-2.5">
                {/* Indicador de prioridad */}
                <div
                  className={cn('mt-1 h-2 w-2 flex-shrink-0 rounded-full', prioridadConfig.bg)}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{alerta.titulo}</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {alerta.descripcion}
                  </p>
                </div>

                {alerta.accion && (
                  <ChevronRight className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                )}
              </div>
            </button>
          )
        })}

        {alertasRestantes > 0 && (
          <div className="text-muted-foreground pt-2 text-center text-xs">
            +{alertasRestantes} {alertasRestantes === 1 ? 'alerta más' : 'alertas más'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
