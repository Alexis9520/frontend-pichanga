'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { CalendarDay, OccupancyLevel } from '../types'

interface CalendarMonthProps {
  days: CalendarDay[]
  onDayClick: (day: CalendarDay) => void
  selectedDate?: string
  getOccupancyColor: (level: OccupancyLevel) => string
}

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function CalendarMonth({
  days,
  onDayClick,
  selectedDate,
  getOccupancyColor,
}: CalendarMonthProps) {
  return (
    <div className="p-4">
      {/* Header con días de la semana */}
      <div className="mb-3 grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-muted-foreground py-2 text-center text-xs font-medium tracking-wider uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <CalendarDayCell
            key={`${day.date}-${index}`}
            day={day}
            isSelected={selectedDate === day.date}
            onClick={() => onDayClick(day)}
            getOccupancyColor={getOccupancyColor}
          />
        ))}
      </div>
    </div>
  )
}

// ===========================================
// COMPONENTE: Día individual
// ===========================================
interface CalendarDayCellProps {
  day: CalendarDay
  isSelected: boolean
  onClick: () => void
  getOccupancyColor: (level: OccupancyLevel) => string
}

function CalendarDayCell({ day, isSelected, onClick, getOccupancyColor }: CalendarDayCellProps) {
  const hasEvents = day.events.length > 0
  const hasReservas = day.stats.totalReservas > 0
  const hasPendientes = day.stats.reservasPendientes > 0

  // Calcular cantidad de puntos (indicador visual de cantidad de reservas)
  const getIndicatorDots = () => {
    const count = day.stats.totalReservas
    if (count === 0) return null
    if (count <= 2) return 1
    if (count <= 4) return 2
    return 3
  }

  const dots = getIndicatorDots()

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex min-h-[72px] flex-col rounded-xl p-2 text-left transition-all duration-200',
        'hover:bg-muted/50 focus:ring-primary focus:ring-2 focus:outline-none',
        !day.isCurrentMonth && 'opacity-30',
        day.isToday && 'ring-primary ring-2',
        isSelected && 'bg-primary/10 ring-primary ring-2',
        hasPendientes && day.isCurrentMonth && !isSelected && 'border-l-4 border-l-amber-500'
      )}
    >
      {/* Número del día */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
            day.isToday && 'bg-primary text-primary-foreground',
            isSelected && !day.isToday && 'bg-primary/20 text-primary'
          )}
        >
          {day.dayNumber}
        </span>

        {/* Indicador de ocupación con color */}
        {hasReservas && day.isCurrentMonth && (
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
              getOccupancyColor(day.stats.nivelOcupacion)
            )}
          >
            {day.stats.ocupacion}%
          </span>
        )}
      </div>

      {/* Indicadores de cantidad (puntos) */}
      {hasReservas && day.isCurrentMonth && (
        <div className="mt-2 flex items-center justify-center gap-1">
          {dots &&
            Array.from({ length: dots }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  hasPendientes ? 'bg-amber-500' : 'bg-primary'
                )}
              />
            ))}
        </div>
      )}

      {/* Mini badge de ingresos */}
      {hasReservas && day.isCurrentMonth && day.stats.ingresos > 0 && (
        <div className="mt-auto pt-1">
          <p className="text-muted-foreground text-center text-[10px] font-medium">
            S/{day.stats.ingresos.toFixed(0)}
          </p>
        </div>
      )}

      {/* Hover con más info */}
      {hasEvents && day.isCurrentMonth && (
        <div
          className={cn(
            'border-border bg-popover pointer-events-none absolute top-full left-1/2 z-50 mt-2 w-44 -translate-x-1/2 rounded-lg border p-3 shadow-lg',
            'opacity-0 transition-opacity group-hover:opacity-100'
          )}
        >
          <div className="space-y-2">
            {/* Total reservas */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{day.stats.totalReservas} reservas</span>
              {hasPendientes && (
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                  {day.stats.reservasPendientes} pend.
                </span>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-1 text-[10px]">
              {day.stats.reservasConfirmadas > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">
                    {day.stats.reservasConfirmadas} confirmada
                    {day.stats.reservasConfirmadas !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {day.stats.reservasPendientes > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">
                    {day.stats.reservasPendientes} pendiente
                    {day.stats.reservasPendientes !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {day.stats.bloqueos > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">
                    {day.stats.bloqueos} bloqueo{day.stats.bloqueos !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Ingresos */}
            {day.stats.ingresos > 0 && (
              <div className="border-border border-t pt-2">
                <span className="text-primary text-sm font-bold">
                  S/ {day.stats.ingresos.toFixed(0)}
                </span>
                <span className="text-muted-foreground ml-1 text-[10px]">estimado</span>
              </div>
            )}
          </div>
        </div>
      )}
    </button>
  )
}
