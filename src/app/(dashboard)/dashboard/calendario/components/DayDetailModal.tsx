'use client'

import * as React from 'react'
import { X, Phone, Eye, CreditCard, Lock, Clock } from 'lucide-react'
import { Dialog, DialogContent, Button, Badge, Card } from '@/components/ui'
import { cn, formatCurrency, formatDate, getDayName, getMonthName } from '@/lib/utils'
import type { CalendarDay, CalendarEvent, CanchaCalendario } from '../types'

interface DayDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  day: CalendarDay | null
  canchas: CanchaCalendario[]
  onEventClick: (event: CalendarEvent) => void
  onNewReservation: (date: string) => void
}

export function DayDetailModal({
  open,
  onOpenChange,
  day,
  canchas,
  onEventClick,
  onNewReservation,
}: DayDetailModalProps) {
  if (!day) return null

  // Agrupar eventos por cancha
  const eventsByCancha = canchas.map((cancha) => ({
    ...cancha,
    events: day.events.filter((e) => e.canchaId === cancha.id),
  }))

  const dateObj = new Date(day.date + 'T12:00:00')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-border flex items-start justify-between border-b pb-4">
          <div>
            <p className="text-muted-foreground text-sm">{getDayName(dateObj.getDay())}</p>
            <h2 className="text-xl font-bold">
              {dateObj.getDate()} de {getMonthName(dateObj.getMonth())}
            </h2>
          </div>

          {/* Resumen del día */}
          <div className="flex gap-4 text-center">
            <div>
              <p className="text-primary text-2xl font-bold">{day.stats.totalReservas}</p>
              <p className="text-muted-foreground text-xs">Reservas</p>
            </div>
            <div>
              <p className="text-success text-2xl font-bold">
                {formatCurrency(day.stats.ingresos)}
              </p>
              <p className="text-muted-foreground text-xs">Ingresos</p>
            </div>
          </div>
        </div>

        {/* Contenido por cancha */}
        <div className="space-y-4">
          {eventsByCancha.map((cancha) => (
            <Card key={cancha.id} className="p-4">
              {/* Header de cancha */}
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cancha.color }} />
                <h3 className="font-semibold">{cancha.nombre}</h3>
                <Badge variant="outline" size="sm">
                  {cancha.events.length} evento{cancha.events.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Lista de eventos */}
              {cancha.events.length === 0 ? (
                <p className="text-muted-foreground text-sm">Sin eventos para este día</p>
              ) : (
                <div className="space-y-2">
                  {cancha.events
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((event) => (
                      <EventRow key={event.id} event={event} onClick={() => onEventClick(event)} />
                    ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Acciones */}
        <div className="border-border mt-4 flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={() => onNewReservation(day.date)}>Nueva reserva</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ===========================================
// COMPONENTE: Fila de evento
// ===========================================
interface EventRowProps {
  event: CalendarEvent
  onClick: () => void
}

function EventRow({ event, onClick }: EventRowProps) {
  const getStatusBadge = () => {
    if (event.type === 'blocking') {
      return (
        <Badge variant="destructive" size="sm">
          Bloqueo
        </Badge>
      )
    }
    if (event.status === 'pending_payment') {
      return (
        <Badge variant="pending" size="sm">
          Pendiente
        </Badge>
      )
    }
    if (event.status === 'confirmed') {
      return (
        <Badge variant="success" size="sm">
          Confirmada
        </Badge>
      )
    }
    if (event.status === 'completed') {
      return (
        <Badge variant="success" size="sm">
          Completada
        </Badge>
      )
    }
    if (event.status === 'cancelled') {
      return (
        <Badge variant="outline" size="sm">
          Cancelada
        </Badge>
      )
    }
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3 transition-colors',
        'hover:bg-muted/50 cursor-pointer',
        event.type === 'blocking' && 'border-destructive/30 bg-destructive/5',
        event.status === 'cancelled' && 'opacity-50'
      )}
      onClick={onClick}
    >
      {/* Hora */}
      <div className="flex w-20 flex-col items-center">
        <Clock className="text-muted-foreground h-4 w-4" />
        <span className="text-sm font-medium">{event.startTime}</span>
        <span className="text-muted-foreground text-xs">{event.endTime}</span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        {event.type === 'blocking' ? (
          <>
            <div className="flex items-center gap-2">
              <Lock className="text-destructive h-4 w-4" />
              <span className="text-destructive font-medium">Horario bloqueado</span>
            </div>
            <p className="text-muted-foreground truncate text-sm">{event.motivoBloqueo}</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="font-medium">{event.clienteNombre}</span>
              {getStatusBadge()}
              {event.source === 'app' ? (
                <Badge variant="info" size="sm">
                  App
                </Badge>
              ) : (
                <Badge variant="outline" size="sm">
                  Manual
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{event.clienteTelefono}</p>
          </>
        )}
      </div>

      {/* Financiero */}
      {event.type === 'reservation' && event.totalPrice && (
        <div className="text-right">
          <p className="text-primary font-bold">{formatCurrency(event.totalPrice)}</p>
          {event.estadoPago === 'partial' && (
            <p className="text-warning text-xs">
              Saldo: {formatCurrency(event.saldoPendiente || 0)}
            </p>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
        {event.clienteTelefono && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation()
              window.open(`tel:+51${event.clienteTelefono}`)
            }}
          >
            <Phone className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
