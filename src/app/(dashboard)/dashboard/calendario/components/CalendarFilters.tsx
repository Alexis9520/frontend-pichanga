'use client'

import * as React from 'react'
import { Calendar, Clock, Grid3X3, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Button, Select } from '@/components/ui'
import { cn, getMonthName, getDayName } from '@/lib/utils'
import type { CalendarView, CalendarFilters, CanchaCalendario } from '../types'

interface CalendarFiltersProps {
  currentDate: Date
  currentView: CalendarView
  filters: CalendarFilters
  canchas: CanchaCalendario[]
  onViewChange: (view: CalendarView) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onFiltersChange: (filters: Partial<CalendarFilters>) => void
}

export function CalendarFiltersBar({
  currentDate,
  currentView,
  filters,
  canchas,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onFiltersChange,
}: CalendarFiltersProps) {
  // Texto del período actual
  const getPeriodText = () => {
    if (currentView === 'month') {
      return `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`
    }
    if (currentView === 'week') {
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${getMonthName(endOfWeek.getMonth())}`
    }
    // Day view
    return `${getDayName(currentDate.getDay())} ${currentDate.getDate()} de ${getMonthName(currentDate.getMonth())}`
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Navegación de fecha */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-[180px] text-center">
          <h2 className="text-lg font-semibold">{getPeriodText()}</h2>
        </div>

        <Button variant="ghost" size="icon-sm" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={onToday} className="ml-2">
          Hoy
        </Button>
      </div>

      {/* Selector de vista y filtros */}
      <div className="flex items-center gap-2">
        {/* Selector de vista */}
        <div className="border-border flex rounded-lg border p-1">
          <button
            onClick={() => onViewChange('month')}
            className={cn(
              'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              currentView === 'month'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Mes</span>
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={cn(
              'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              currentView === 'week'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Semana</span>
          </button>
          <button
            onClick={() => onViewChange('day')}
            className={cn(
              'flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              currentView === 'day'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Día</span>
          </button>
        </div>

        {/* Filtro de canchas */}
        <Select
          options={[
            { value: '', label: 'Todas las canchas' },
            ...canchas.map((c) => ({ value: c.id, label: c.nombre })),
          ]}
          placeholder="Canchas"
          selectSize="default"
        />
      </div>
    </div>
  )
}

// ===========================================
// LEYENDA DEL CALENDARIO
// ===========================================
interface CalendarLegendProps {
  showBlockings?: boolean
}

export function CalendarLegend({ showBlockings = true }: CalendarLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs">
      {/* Estados de reserva */}
      <div className="flex items-center gap-1.5">
        <span className="bg-primary/20 border-primary h-3 w-3 rounded border-l-2" />
        <span className="text-muted-foreground">Confirmada</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="bg-warning/20 border-warning h-3 w-3 rounded border-l-2" />
        <span className="text-muted-foreground">Pendiente de pago</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="bg-success/20 border-success h-3 w-3 rounded border-l-2" />
        <span className="text-muted-foreground">Completada</span>
      </div>

      {showBlockings && (
        <div className="flex items-center gap-1.5">
          <span className="bg-destructive/20 border-destructive h-3 w-3 rounded border-l-2" />
          <span className="text-muted-foreground">Bloqueo</span>
        </div>
      )}

      {/* Niveles de ocupación */}
      <div className="border-border ml-2 flex items-center gap-2 border-l pl-4">
        <span className="text-muted-foreground">Ocupación:</span>
        <div className="flex items-center gap-1">
          <span className="bg-success h-2 w-2 rounded-full" />
          <span className="text-muted-foreground">Bajo</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-warning h-2 w-2 rounded-full" />
          <span className="text-muted-foreground">Medio</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          <span className="text-muted-foreground">Alto</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-destructive h-2 w-2 rounded-full" />
          <span className="text-muted-foreground">Full</span>
        </div>
      </div>
    </div>
  )
}
