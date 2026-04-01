'use client'

import * as React from 'react'
import { MapPin, Users, Clock, Phone, ChevronRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  BorderGlow,
} from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'

interface CanchaEstado {
  id: string
  nombre: string
  estado: 'libre' | 'ocupada' | 'proxima' | 'en_curso'
  clienteActual?: {
    nombre: string
    telefono?: string
  }
  horarioActual?: {
    inicio: string
    fin: string
  }
  proximaReserva?: {
    clienteNombre: string
    horaInicio: string
  }
  precioHora: number
  color: string
}

interface CanchasStatusMapProps {
  canchas: CanchaEstado[]
  onCanchaClick?: (canchaId: string) => void
}

const ESTADO_CONFIG = {
  libre: {
    label: 'Libre',
    bgClass: 'bg-green-500/10',
    barClass: 'bg-green-500',
    textColor: 'text-green-600',
    dotColor: 'bg-green-500',
    glowVariant: 'success' as const,
  },
  ocupada: {
    label: 'Ocupada',
    bgClass: 'bg-red-500/10',
    barClass: 'bg-red-500',
    textColor: 'text-red-600',
    dotColor: 'bg-red-500',
    glowVariant: 'default' as const,
  },
  en_curso: {
    label: 'En curso',
    bgClass: 'bg-blue-500/10',
    barClass: 'bg-blue-500',
    textColor: 'text-blue-600',
    dotColor: 'bg-blue-500',
    glowVariant: 'info' as const,
  },
  proxima: {
    label: 'Próxima',
    bgClass: 'bg-amber-500/10',
    barClass: 'bg-amber-500',
    textColor: 'text-amber-600',
    dotColor: 'bg-amber-500',
    glowVariant: 'warning' as const,
  },
}

export function CanchasStatusMap({ canchas, onCanchaClick }: CanchasStatusMapProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Estado de Canchas
          </span>
          <div className="flex items-center gap-3 text-xs font-normal">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Libre
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Ocupada
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Próxima
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {canchas.map((cancha) => {
            const config = ESTADO_CONFIG[cancha.estado]
            const isLibre = cancha.estado === 'libre'
            const isOcupada = cancha.estado === 'ocupada' || cancha.estado === 'en_curso'

            return (
              <BorderGlow
                key={cancha.id}
                variant={config.glowVariant}
                borderRadius={12}
                className="cursor-pointer"
              >
                <button
                  onClick={() => onCanchaClick?.(cancha.id)}
                  className={cn(
                    'group w-full rounded-xl p-3 text-left transition-all',
                    config.bgClass
                  )}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn('h-2.5 w-2.5 animate-pulse rounded-full', config.dotColor)}
                      />
                      <span className="text-sm font-semibold">{cancha.nombre}</span>
                    </div>
                    <Badge
                      variant={isLibre ? 'success' : isOcupada ? 'destructive' : 'warning'}
                      size="sm"
                    >
                      {config.label}
                    </Badge>
                  </div>

                  {/* Barra de progreso animada */}
                  <div className="bg-muted/50 mt-3 h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className={cn('h-full rounded-full transition-all', config.barClass, {
                        'animate-pulse': isOcupada,
                      })}
                      style={{
                        width: isLibre ? '0%' : cancha.estado === 'en_curso' ? '60%' : '100%',
                      }}
                    />
                  </div>

                  {/* Info según estado */}
                  <div className="mt-3 space-y-1">
                    {isLibre ? (
                      <div className="text-muted-foreground text-xs">
                        <p className="font-medium text-green-600">Disponible ahora</p>
                        <p>{formatCurrency(cancha.precioHora)}/hora</p>
                      </div>
                    ) : cancha.estado === 'en_curso' && cancha.horarioActual ? (
                      <>
                        <div className="flex items-center gap-1 text-xs">
                          <Users className="h-3 w-3" />
                          <span className="truncate font-medium">
                            {cancha.clienteActual?.nombre}
                          </span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Termina {cancha.horarioActual.fin}</span>
                        </div>
                      </>
                    ) : cancha.estado === 'ocupada' && cancha.horarioActual ? (
                      <>
                        <div className="flex items-center gap-1 text-xs">
                          <Users className="h-3 w-3" />
                          <span className="truncate font-medium">
                            {cancha.clienteActual?.nombre}
                          </span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>
                            {cancha.horarioActual.inicio} - {cancha.horarioActual.fin}
                          </span>
                        </div>
                      </>
                    ) : cancha.estado === 'proxima' && cancha.proximaReserva ? (
                      <>
                        <div className="flex items-center gap-1 text-xs">
                          <Users className="h-3 w-3" />
                          <span className="truncate font-medium">
                            {cancha.proximaReserva.clienteNombre}
                          </span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Empieza {cancha.proximaReserva.horaInicio}</span>
                        </div>
                      </>
                    ) : null}
                  </div>

                  {/* Hover action */}
                  <div
                    className={cn(
                      'mt-2 flex items-center justify-end text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100',
                      config.textColor
                    )}
                  >
                    Ver detalle
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </div>
                </button>
              </BorderGlow>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
