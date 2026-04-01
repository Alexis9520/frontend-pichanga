'use client'

import * as React from 'react'
import { AlertTriangle, CreditCard, Package, Tag, ChevronRight, CheckCircle } from 'lucide-react'
import { Card, CardContent, Button, BorderGlow } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'

export interface ActionItem {
  id: string
  tipo: 'pago_pendiente' | 'stock_bajo' | 'promocion' | 'reserva_hoy'
  titulo: string
  descripcion: string
  cantidad?: number
  monto?: number
  urgente?: boolean
  link?: string
}

interface ActionCardsProps {
  acciones: ActionItem[]
  onActionClick?: (accion: ActionItem) => void
}

const TIPO_CONFIG = {
  pago_pendiente: {
    icon: CreditCard,
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    buttonVariant: 'warning' as const,
    glowVariant: 'warning' as const,
  },
  stock_bajo: {
    icon: Package,
    color: 'text-red-600',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    buttonVariant: 'destructive' as const,
    glowVariant: 'default' as const,
  },
  promocion: {
    icon: Tag,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    buttonVariant: 'outline' as const,
    glowVariant: 'info' as const,
  },
  reserva_hoy: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    buttonVariant: 'success' as const,
    glowVariant: 'success' as const,
  },
}

export function ActionCards({ acciones, onActionClick }: ActionCardsProps) {
  if (acciones.length === 0) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-600">Todo al día</p>
            <p className="text-muted-foreground text-sm">No hay acciones pendientes</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {acciones.map((accion) => {
        const config = TIPO_CONFIG[accion.tipo]
        const Icon = config.icon

        return (
          <BorderGlow
            key={accion.id}
            variant={config.glowVariant}
            borderRadius={12}
            className={accion.urgente ? 'animate-pulse' : ''}
          >
            <Card
              className={cn(
                'transition-all hover:shadow-md',
                config.border,
                'border-0 bg-transparent shadow-none'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      config.bg
                    )}
                  >
                    <Icon className={cn('h-5 w-5', config.color)} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{accion.titulo}</p>
                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                      {accion.descripcion}
                    </p>

                    {/* Cantidad/Monto */}
                    {(accion.cantidad !== undefined || accion.monto !== undefined) && (
                      <div className="mt-2 flex items-center gap-2">
                        {accion.cantidad !== undefined && (
                          <span className={cn('text-lg font-bold', config.color)}>
                            {accion.cantidad}
                          </span>
                        )}
                        {accion.monto !== undefined && (
                          <span className={cn('text-lg font-bold', config.color)}>
                            {formatCurrency(accion.monto)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      variant={config.buttonVariant}
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => onActionClick?.(accion)}
                    >
                      Resolver ahora
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BorderGlow>
        )
      })}
    </div>
  )
}
