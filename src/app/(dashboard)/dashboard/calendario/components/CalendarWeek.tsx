'use client'

import * as React from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui'
import type { CalendarDay, CalendarEvent, CanchaCalendario } from '../types'

interface CalendarWeekProps {
  week: {
    startDate: string
    endDate: string
    days: CalendarDay[]
    totalReservas: number
    totalIngresos: number
  }
  canchas: CanchaCalendario[]
  getSlotEvents: (date: string, hora: string, canchaId: string) => CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onSlotClick: (date: string, hora: string, canchaId: string) => void
  selectedDate?: string
}

// Horas del día (6:00 - 23:00)
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6)

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function CalendarWeek({
  week,
  canchas,
  getSlotEvents,
  onEventClick,
  onSlotClick,
  selectedDate,
}: CalendarWeekProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header con días */}
        <div
          className="border-border bg-card sticky top-0 z-20 grid border-b"
          style={{ gridTemplateColumns: `60px repeat(7, 1fr)` }}
        >
          {/* Esquina superior izquierda */}
          <div className="border-border border-b p-2" />

          {/* Días de la semana */}
          {week.days.map((day) => (
            <div
              key={day.date}
              className={cn(
                'border-border border-b p-2 text-center',
                day.isToday && 'bg-primary/5',
                selectedDate === day.date && 'bg-primary/10'
              )}
            >
              <p className="text-muted-foreground text-xs font-medium uppercase">
                {DAY_NAMES[day.dayOfWeek]}
              </p>
              <p className={cn('mt-1 text-lg font-bold', day.isToday && 'text-primary')}>
                {day.dayNumber}
              </p>
              {day.stats.totalReservas > 0 && (
                <Badge variant="outline" size="sm" className="mt-1">
                  {day.stats.totalReservas}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Grid de horarios */}
        <div className="relative">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="border-border/50 grid border-b"
              style={{ gridTemplateColumns: `60px repeat(7, 1fr)` }}
            >
              {/* Hora */}
              <div className="border-border text-muted-foreground border-r p-2 text-right text-xs">
                {hour.toString().padStart(2, '0')}:00
              </div>

              {/* Celdas por día */}
              {week.days.map((day) => (
                <WeekCell
                  key={`${day.date}-${hour}`}
                  day={day}
                  hour={hour}
                  canchas={canchas}
                  getSlotEvents={getSlotEvents}
                  onEventClick={onEventClick}
                  onSlotClick={onSlotClick}
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
// COMPONENTE: Celda de la semana
// ===========================================
interface WeekCellProps {
  day: CalendarDay
  hour: number
  canchas: CanchaCalendario[]
  getSlotEvents: (date: string, hora: string, canchaId: string) => CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onSlotClick: (date: string, hora: string, canchaId: string) => void
}

function WeekCell({ day, hour, canchas, getSlotEvents, onEventClick, onSlotClick }: WeekCellProps) {
  const horaStr = `${hour.toString().padStart(2, '0')}:00`

  // Obtener eventos para este slot
  const events = canchas.flatMap((cancha) =>
    getSlotEvents(day.date, horaStr, cancha.id).map((event) => ({
      ...event,
      canchaColor: cancha.color,
    }))
  )

  if (events.length === 0) {
    // Celda vacía - clickeable para crear reserva
    return (
      <div
        className={cn(
          'group border-border/50 relative cursor-pointer border-r p-1 transition-colors',
          'hover:bg-primary/5',
          day.isToday && 'bg-primary/5'
        )}
        onClick={() => onSlotClick(day.date, horaStr, canchas[0]?.id || '')}
      >
        <span className="text-muted-foreground text-[10px] opacity-0 group-hover:opacity-100">
          +
        </span>
      </div>
    )
  }

  // Celda con eventos
  return (
    <div className={cn('border-border/50 relative border-r p-1', day.isToday && 'bg-primary/5')}>
      {events.map((event) => (
        <EventChip
          key={event.id}
          event={event}
          canchaColor={event.canchaColor}
          onClick={() => onEventClick(event)}
        />
      ))}
    </div>
  )
}

// ===========================================
// COMPONENTE: Chip de evento
// ===========================================
interface EventChipProps {
  event: CalendarEvent & { canchaColor: string }
  canchaColor: string
  onClick: () => void
}

function EventChip({ event, canchaColor, onClick }: EventChipProps) {
  const getStatusColor = () => {
    if (event.type === 'blocking') return 'bg-destructive/20 border-destructive'
    if (event.status === 'pending_payment') return 'bg-warning/20 border-warning'
    if (event.status === 'confirmed') return 'bg-primary/20 border-primary'
    if (event.status === 'completed') return 'bg-success/20 border-success'
    if (event.status === 'cancelled') return 'bg-muted border-muted-foreground'
    return 'bg-muted border-border'
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'mb-1 w-full rounded border p-1 text-left transition-all hover:opacity-80',
        getStatusColor()
      )}
    >
      {/* Indicador de cancha */}
      <div className="mb-0.5 h-1 w-full rounded-full" style={{ backgroundColor: canchaColor }} />

      {/* Info del evento */}
      <p className="truncate text-[10px] font-medium">
        {event.type === 'blocking' ? 'Bloqueo' : event.clienteNombre}
      </p>

      {event.type === 'reservation' && (
        <>
          <p className="text-muted-foreground text-[9px]">
            {event.startTime} - {event.endTime}
          </p>
          {event.totalPrice && (
            <p className="text-primary text-[9px] font-medium">
              {formatCurrency(event.totalPrice)}
            </p>
          )}
        </>
      )}

      {event.type === 'blocking' && (
        <p className="text-muted-foreground truncate text-[9px]">{event.motivoBloqueo}</p>
      )}
    </button>
  )
}
