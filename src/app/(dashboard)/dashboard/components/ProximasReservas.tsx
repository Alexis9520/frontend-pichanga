'use client'

import * as React from 'react'
import { Clock, MapPin, Phone, Eye, CreditCard, ExternalLink, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { ProximaReserva } from '../types'
import { ESTADO_RESERVA_CONFIG } from '../types'

interface ProximasReservasProps {
  reservas: ProximaReserva[]
  onVerTodas?: () => void
  onLlamar?: (reserva: ProximaReserva) => void
  onVerDetalle?: (reserva: ProximaReserva) => void
  onRegistrarPago?: (reserva: ProximaReserva) => void
}

// Helper para obtener iniciales
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function ProximasReservas({
  reservas,
  onVerTodas,
  onLlamar,
  onVerDetalle,
  onRegistrarPago,
}: ProximasReservasProps) {
  if (reservas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5" />
            Próximas Reservas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            <Clock className="mx-auto h-10 w-10 opacity-50" />
            <p className="mt-2 text-sm">No hay reservas próximas</p>
            <p className="text-xs">Las nuevas reservas aparecerán aquí</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximas Reservas
          </span>
          <Button variant="ghost" size="sm" onClick={onVerTodas}>
            Ver todas
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {reservas.map((reserva, index) => {
          const estadoConfig = ESTADO_RESERVA_CONFIG[reserva.estado]
          const isNext = index === 0
          const isPendiente = reserva.estado === 'pending' || reserva.estado === 'partial'

          return (
            <div
              key={reserva.id}
              className={cn(
                'group relative rounded-xl border-2 p-3 transition-all',
                isNext ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-primary/20'
              )}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold',
                      isNext
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {getInitials(reserva.clienteNombre)}
                  </div>
                  {index < reservas.length - 1 && <div className="bg-border mt-2 h-6 w-0.5" />}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {reserva.hora} - {reserva.horaFin}
                      </span>
                      {isNext && (
                        <Badge variant="success" size="sm">
                          Próxima
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(reserva.monto)}</span>
                  </div>

                  {/* Cliente */}
                  <p className="mt-0.5 font-medium">{reserva.clienteNombre}</p>

                  {/* Info row */}
                  <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {reserva.canchaNombre}
                    </span>
                    {reserva.clienteTelefono && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {reserva.clienteTelefono}
                      </span>
                    )}
                  </div>

                  {/* Estado y acciones */}
                  <div className="mt-2 flex items-center justify-between">
                    <Badge
                      variant={
                        reserva.estado === 'confirmed'
                          ? 'success'
                          : reserva.estado === 'partial'
                            ? 'warning'
                            : 'outline'
                      }
                      size="sm"
                      dot
                    >
                      {estadoConfig.label}
                    </Badge>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Llamar"
                        onClick={() => onLlamar?.(reserva)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Ver detalle"
                        onClick={() => onVerDetalle?.(reserva)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isPendiente && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Registrar pago"
                          onClick={() => onRegistrarPago?.(reserva)}
                          className="text-primary"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
