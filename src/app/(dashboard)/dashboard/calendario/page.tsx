'use client'

import * as React from 'react'
import { Plus, ChevronLeft, ChevronRight, Calendar, List, Grid3X3 } from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import { useCalendario } from './hooks/useCalendario'
import { CalendarMonth, CalendarWeek, CalendarDayView, DayDetailPanel } from './components'
import type { CalendarDay, CalendarEvent } from './types'

export default function CalendarioPage() {
  // Hook principal
  const {
    currentDate,
    currentView,
    filters,
    monthDays,
    currentWeek,
    todayEvents,
    stats,
    canchas,
    setView,
    goToToday,
    goToPrevious,
    goToNext,
    getSlotEvents,
    getOccupancyColor,
  } = useCalendario()

  // Estado del día seleccionado (para el panel lateral)
  const [selectedDay, setSelectedDay] = React.useState<CalendarDay | null>(null)

  // Formatear mes/año actual
  const monthYear = currentDate.toLocaleDateString('es-PE', {
    month: 'long',
    year: 'numeric',
  })

  // Handlers
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day)
  }

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event)
    // TODO: Abrir modal de detalle de reserva
  }

  const handleSlotClick = (date: string, hora: string, canchaId: string) => {
    console.log('Slot clicked:', { date, hora, canchaId })
    // TODO: Abrir modal de nueva reserva con fecha/hora pre-llenada
  }

  const handleNewReservation = (date?: string, hora?: string, canchaId?: string) => {
    console.log('New reservation for:', { date, hora, canchaId })
    // TODO: Abrir modal de nueva reserva
  }

  const handleRegisterPayment = (event: CalendarEvent) => {
    console.log('Register payment for:', event)
    // TODO: Abrir modal de registrar pago
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Calendario</h1>
          <p className="text-muted-foreground">Visualización y gestión de reservas</p>
        </div>
        <Button onClick={() => handleNewReservation()}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva reserva
        </Button>
      </div>

      {/* Stats Cards compactos */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Reservas hoy"
          value={stats.hoy.totalReservas.toString()}
          subValue={`${stats.hoy.confirmadas} confirmadas`}
          variant="success"
        />
        <StatCard
          label="Esta semana"
          value={stats.semanaActual.totalReservas.toString()}
          subValue={formatCurrency(stats.semanaActual.ingresos)}
          variant="info"
        />
        <StatCard
          label="Este mes"
          value={stats.mesActual.totalReservas.toString()}
          subValue={`${stats.mesActual.ocupacionPromedio}% ocupación`}
          variant="warning"
        />
        <StatCard
          label="Ingresos mes"
          value={formatCurrency(stats.mesActual.ingresos)}
          subValue="Total estimado"
          variant="primary"
        />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Panel del calendario */}
        <Card className={cn('flex-1 overflow-hidden', selectedDay && 'hidden lg:block')}>
          <CardContent className="flex h-full flex-col p-0">
            {/* Navegación y filtros */}
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon-sm" onClick={goToPrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hoy
                </Button>
                <Button variant="outline" size="icon-sm" onClick={goToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="ml-2 font-semibold capitalize">{monthYear}</h2>
              </div>

              {/* Toggle de vista */}
              <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('month')}
                  className={cn(
                    'gap-2 rounded-md',
                    currentView === 'month' && 'bg-background shadow-sm'
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Mes</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('week')}
                  className={cn(
                    'gap-2 rounded-md',
                    currentView === 'week' && 'bg-background shadow-sm'
                  )}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Semana</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('day')}
                  className={cn(
                    'gap-2 rounded-md',
                    currentView === 'day' && 'bg-background shadow-sm'
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Día</span>
                </Button>
              </div>
            </div>

            {/* Vista del calendario */}
            <div className="flex-1 overflow-auto">
              {currentView === 'month' && (
                <CalendarMonth
                  days={monthDays}
                  onDayClick={handleDayClick}
                  selectedDate={selectedDay?.date}
                  getOccupancyColor={getOccupancyColor}
                />
              )}

              {currentView === 'week' && (
                <CalendarWeek
                  week={currentWeek}
                  canchas={canchas}
                  getSlotEvents={getSlotEvents}
                  onEventClick={handleEventClick}
                  onSlotClick={handleSlotClick}
                  selectedDate={selectedDay?.date}
                />
              )}

              {currentView === 'day' && (
                <CalendarDayView
                  date={currentDate}
                  events={todayEvents}
                  canchas={canchas}
                  getSlotEvents={getSlotEvents}
                  onEventClick={handleEventClick}
                  onSlotClick={handleSlotClick}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Panel de detalle del día (lateral derecho) */}
        {selectedDay && (
          <>
            {/* Overlay en móvil */}
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSelectedDay(null)}
            />

            {/* Panel */}
            <div className="bg-background fixed inset-y-0 right-0 z-50 w-full max-w-md shadow-xl lg:static lg:z-auto lg:w-96 lg:max-w-none lg:shadow-none">
              <DayDetailPanel
                day={selectedDay}
                canchas={canchas}
                onClose={() => setSelectedDay(null)}
                onEventClick={handleEventClick}
                onNewReservation={handleNewReservation}
                onRegisterPayment={handleRegisterPayment}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ===========================================
// COMPONENTE: Stat Card compacto
// ===========================================
interface StatCardProps {
  label: string
  value: string
  subValue: string
  variant: 'success' | 'info' | 'warning' | 'primary'
}

function StatCard({ label, value, subValue, variant }: StatCardProps) {
  const variantStyles = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-amber-600',
    primary: 'text-primary',
  }

  return (
    <Card>
      <CardContent className="p-3">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <p className={cn('mt-0.5 text-xl font-bold', variantStyles[variant])}>{value}</p>
        <p className="text-muted-foreground text-xs">{subValue}</p>
      </CardContent>
    </Card>
  )
}
