'use client'

import * as React from 'react'
import { Phone, CreditCard, Eye } from 'lucide-react'
import { cn, formatCurrency, getMonthName, getDayName } from '@/lib/utils'
import { Badge, Button } from '@/components/ui'
import type { CalendarEvent, CanchaCalendario } from '../types'

interface CalendarDayProps {
  date: Date
  events: CalendarEvent[]
  canchas: CanchaCalendario[]
  getSlotEvents: (date: string, hora: string, canchaId: string) => CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onSlotClick: (date: string, hora: string, canchaId: string) => void
}

// Horas del día (6:00 - 23:00, cada 30 min)
const TIME_SLOTS: string[] = []
for (let h = 6; h <= 22; h++) {
  TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:00`)
  TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:30`)
}

export function CalendarDayView({
  date,
  events,
  canchas,
  getSlotEvents,
  onEventClick,
  onSlotClick,
}: CalendarDayProps) {
  const dateStr = date.toISOString().split('T')[0]
  const isToday = dateStr === new Date().toISOString().split('T')[0]

  // Hora actual para indicador
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimeOffset = ((currentHour - 6) * 60 + currentMinute) * 1.5 // 1.5px por minuto

  return (
    <div className="flex flex-col">
      {/* Header con fecha */}
      <div className="border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{getDayName(date.getDay())}</p>
            <h2 className={cn('text-2xl font-bold', isToday && 'text-primary')}>
              {date.getDate()} de {getMonthName(date.getMonth())}
            </h2>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <p className="text-primary text-2xl font-bold">{events.length}</p>
              <p className="text-muted-foreground text-xs">Reservas</p>
            </div>
            <div>
              <p className="text-success text-2xl font-bold">
                {formatCurrency(
                  events
                    .filter((e) => e.type === 'reservation' && e.status !== 'cancelled')
                    .reduce((acc, e) => acc + (e.totalPrice || 0), 0)
                )}
              </p>
              <p className="text-muted-foreground text-xs">Ingresos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline con columnas por cancha */}
      <div className="flex-1 overflow-x-auto">
        <div
          className="relative min-w-[600px]"
          style={{
            display: 'grid',
            gridTemplateColumns: `60px repeat(${canchas.length}, 1fr)`,
          }}
        >
          {/* Header de canchas */}
          <div className="border-border bg-card sticky top-0 z-20 border-b p-2" />
          {canchas.map((cancha) => (
            <div
              key={cancha.id}
              className="border-border bg-card sticky top-0 z-20 border-r border-b p-2 text-center"
            >
              <div
                className="mx-auto mb-1 h-2 w-12 rounded-full"
                style={{ backgroundColor: cancha.color }}
              />
              <p className="truncate text-xs font-medium">{cancha.nombre}</p>
            </div>
          ))}

          {/* Timeline */}
          <div className="relative" style={{ height: `${TIME_SLOTS.length * 45}px` }}>
            {/* Línea de hora actual */}
            {isToday && currentTimeOffset > 0 && (
              <div
                className="absolute right-0 left-0 z-10 flex items-center"
                style={{ top: `${currentTimeOffset}px` }}
              >
                <div className="bg-destructive h-3 w-3 rounded-full" />
                <div className="bg-destructive h-0.5 flex-1" />
              </div>
            )}

            {/* Labels de hora */}
            {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((time) => (
              <div
                key={time}
                className="text-muted-foreground absolute right-0 left-0 flex h-[90px] items-start justify-end pr-2 text-xs"
                style={{ top: `${TIME_SLOTS.indexOf(time) * 45}px` }}
              >
                {time}
              </div>
            ))}
          </div>

          {/* Columnas de canchas con eventos */}
          {canchas.map((cancha) => (
            <div
              key={cancha.id}
              className="border-border relative border-r"
              style={{ height: `${TIME_SLOTS.length * 45}px` }}
            >
              {/* Grid lines */}
              {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((time, i) => (
                <div
                  key={time}
                  className={cn(
                    'border-border/50 absolute right-0 left-0 border-t',
                    i === 0 && 'border-transparent'
                  )}
                  style={{ top: `${i * 90}px`, height: '90px' }}
                  onClick={() => onSlotClick(dateStr, time, cancha.id)}
                />
              ))}

              {/* Eventos */}
              {events
                .filter((e) => e.canchaId === cancha.id)
                .map((event) => (
                  <DayEventCard
                    key={event.id}
                    event={event}
                    cancha={cancha}
                    onClick={() => onEventClick(event)}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===========================================
// COMPONENTE: Card de evento en vista día
// ===========================================
interface DayEventCardProps {
  event: CalendarEvent
  cancha: CanchaCalendario
  onClick: () => void
}

function DayEventCard({ event, cancha, onClick }: DayEventCardProps) {
  // Calcular posición y altura
  const [startHour, startMin] = event.startTime.split(':').map(Number)
  const [endHour, endMin] = event.endTime.split(':').map(Number)

  const startOffset = ((startHour - 6) * 60 + startMin) * 1.5 // 1.5px por minuto
  const duration = ((endHour - startHour) * 60 + (endMin - startMin)) * 1.5
  const height = Math.max(duration, 40) // Mínimo 40px

  const getStatusStyles = () => {
    if (event.type === 'blocking') {
      return 'bg-destructive/10 border-l-4 border-l-destructive'
    }
    if (event.status === 'pending_payment') {
      return 'bg-warning/10 border-l-4 border-l-warning'
    }
    if (event.status === 'confirmed') {
      return 'bg-primary/10 border-l-4 border-l-primary'
    }
    if (event.status === 'completed') {
      return 'bg-success/10 border-l-4 border-l-success'
    }
    if (event.status === 'cancelled') {
      return 'bg-muted/50 border-l-4 border-l-muted-foreground opacity-50'
    }
    return 'bg-muted border-l-4 border-l-border'
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute right-1 left-1 rounded-lg p-2 text-left transition-all hover:opacity-80',
        getStatusStyles()
      )}
      style={{ top: `${startOffset}px`, height: `${height}px` }}
    >
      {event.type === 'blocking' ? (
        <>
          <p className="text-destructive text-xs font-medium">Bloqueo</p>
          <p className="text-muted-foreground truncate text-[10px]">{event.motivoBloqueo}</p>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-1">
            <p className="truncate text-sm font-medium">{event.clienteNombre}</p>
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

          <p className="text-muted-foreground text-xs">
            {event.startTime} - {event.endTime}
          </p>

          {event.totalPrice && (
            <p className="text-primary mt-1 text-sm font-bold">
              {formatCurrency(event.totalPrice)}
            </p>
          )}

          {event.estadoPago === 'partial' && (
            <p className="text-warning text-[10px]">
              Saldo: {formatCurrency(event.saldoPendiente || 0)}
            </p>
          )}

          {/* Acciones rápidas */}
          {height > 70 && (
            <div className="mt-1 flex gap-1">
              <Button variant="ghost" size="icon-sm" className="h-5 w-5">
                <Eye className="h-3 w-3" />
              </Button>
              {event.clienteTelefono && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`tel:+51${event.clienteTelefono}`)
                  }}
                >
                  <Phone className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </button>
  )
}
