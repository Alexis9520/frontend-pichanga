'use client'

import { useState, useMemo, useCallback } from 'react'
import type {
  CalendarView,
  CalendarFilters,
  CalendarDay,
  CalendarWeek,
  CalendarEvent,
  OccupancyLevel,
  UseCalendarioReturn,
} from '../types'
import { mockAllEvents, mockCanchas, calculateDayStats } from '../mock-data'

// Filtros por defecto
const defaultFilters: CalendarFilters = {
  view: 'month',
  canchas: [], // Vacío = todas
  showBlockings: true,
  showPromotions: true,
  estados: ['pending_payment', 'confirmed', 'in_progress', 'completed'],
}

export function useCalendario(): UseCalendarioReturn {
  // Estado
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<CalendarView>('month')
  const [filters, setFiltersState] = useState<CalendarFilters>(defaultFilters)

  // Obtener fecha de hoy en formato string
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Filtrar eventos según filtros activos
  const filteredEvents = useMemo(() => {
    return mockAllEvents.filter((event) => {
      // Filtro por cancha
      if (filters.canchas.length > 0 && !filters.canchas.includes(event.canchaId)) {
        return false
      }

      // Filtro por tipo
      if (event.type === 'blocking' && !filters.showBlockings) {
        return false
      }

      // Filtro por estado (solo para reservas)
      if (event.type === 'reservation' && event.status) {
        if (!filters.estados.includes(event.status as (typeof filters.estados)[number])) {
          return false
        }
      }

      return true
    })
  }, [filters])

  // Obtener eventos de un día específico
  const getDayEvents = useCallback(
    (date: string): CalendarEvent[] => {
      return filteredEvents.filter((event) => event.date === date)
    },
    [filteredEvents]
  )

  // Obtener eventos para un slot específico
  const getSlotEvents = useCallback(
    (date: string, hora: string, canchaId: string): CalendarEvent[] => {
      return filteredEvents.filter((event) => {
        if (event.date !== date || event.canchaId !== canchaId) return false

        const [eventStartHour, eventStartMin] = event.startTime.split(':').map(Number)
        const [eventEndHour, eventEndMin] = event.endTime.split(':').map(Number)
        const [slotHour, slotMin] = hora.split(':').map(Number)

        const eventStart = eventStartHour * 60 + eventStartMin
        const eventEnd = eventEndHour * 60 + eventEndMin
        const slot = slotHour * 60 + slotMin

        return slot >= eventStart && slot < eventEnd
      })
    },
    [filteredEvents]
  )

  // Calcular días del mes actual
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay() // 0-6, domingo = 0

    const days: CalendarDay[] = []

    // Días del mes anterior (padding)
    for (let i = startPadding - 1; i >= 0; i--) {
      const prevDay = new Date(year, month, -i)
      const dateStr = prevDay.toISOString().split('T')[0]
      const events = getDayEvents(dateStr)

      days.push({
        date: dateStr,
        dayNumber: prevDay.getDate(),
        isToday: dateStr === today,
        isCurrentMonth: false,
        dayOfWeek: prevDay.getDay(),
        stats: calculateDayStats(dateStr, events),
        events,
      })
    }

    // Días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split('T')[0]
      const events = getDayEvents(dateStr)

      days.push({
        date: dateStr,
        dayNumber: day,
        isToday: dateStr === today,
        isCurrentMonth: true,
        dayOfWeek: date.getDay(),
        stats: calculateDayStats(dateStr, events),
        events,
      })
    }

    // Días del siguiente mes (padding hasta completar 6 semanas)
    const totalCells = 42 // 6 semanas x 7 días
    const remainingCells = totalCells - days.length
    for (let i = 1; i <= remainingCells; i++) {
      const nextDay = new Date(year, month + 1, i)
      const dateStr = nextDay.toISOString().split('T')[0]
      const events = getDayEvents(dateStr)

      days.push({
        date: dateStr,
        dayNumber: i,
        isToday: dateStr === today,
        isCurrentMonth: false,
        dayOfWeek: nextDay.getDay(),
        stats: calculateDayStats(dateStr, events),
        events,
      })
    }

    return days
  }, [currentDate, getDayEvents, today])

  // Calcular semana actual
  const currentWeek = useMemo((): CalendarWeek => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const days: CalendarDay[] = []
    let totalReservas = 0
    let totalIngresos = 0

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      const dateStr = day.toISOString().split('T')[0]
      const events = getDayEvents(dateStr)
      const stats = calculateDayStats(dateStr, events)

      days.push({
        date: dateStr,
        dayNumber: day.getDate(),
        isToday: dateStr === today,
        isCurrentMonth: true,
        dayOfWeek: day.getDay(),
        stats,
        events,
      })

      totalReservas += stats.totalReservas
      totalIngresos += stats.ingresos
    }

    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
      days,
      totalReservas,
      totalIngresos,
    }
  }, [currentDate, getDayEvents, today])

  // Eventos de hoy
  const todayEvents = useMemo(() => {
    return getDayEvents(today)
  }, [getDayEvents, today])

  // Estadísticas
  const stats = useMemo(() => {
    // Mes actual
    const mesActual = monthDays.filter((d) => d.isCurrentMonth)
    const mesStats = {
      totalReservas: mesActual.reduce((acc, d) => acc + d.stats.totalReservas, 0),
      ingresos: mesActual.reduce((acc, d) => acc + d.stats.ingresos, 0),
      ocupacionPromedio: Math.round(
        mesActual.reduce((acc, d) => acc + d.stats.ocupacion, 0) / mesActual.length
      ),
    }

    // Semana actual
    const semanaStats = {
      totalReservas: currentWeek.totalReservas,
      ingresos: currentWeek.totalIngresos,
    }

    // Hoy
    const hoyStats = {
      totalReservas: todayEvents.filter((e) => e.type === 'reservation').length,
      confirmadas: todayEvents.filter(
        (e) => e.type === 'reservation' && (e.status === 'confirmed' || e.status === 'in_progress')
      ).length,
      pendientes: todayEvents.filter(
        (e) => e.type === 'reservation' && e.status === 'pending_payment'
      ).length,
    }

    return {
      mesActual: mesStats,
      semanaActual: semanaStats,
      hoy: hoyStats,
    }
  }, [monthDays, currentWeek, todayEvents])

  // Acciones
  const setView = useCallback((view: CalendarView) => {
    setCurrentView(view)
  }, [])

  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (currentView === 'month') {
        newDate.setMonth(prev.getMonth() - 1)
      } else if (currentView === 'week') {
        newDate.setDate(prev.getDate() - 7)
      } else {
        newDate.setDate(prev.getDate() - 1)
      }
      return newDate
    })
  }, [currentView])

  const goToNext = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (currentView === 'month') {
        newDate.setMonth(prev.getMonth() + 1)
      } else if (currentView === 'week') {
        newDate.setDate(prev.getDate() + 7)
      } else {
        newDate.setDate(prev.getDate() + 1)
      }
      return newDate
    })
  }, [currentView])

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  const setFilters = useCallback((newFilters: Partial<CalendarFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Helpers
  const getOccupancyColor = useCallback((level: OccupancyLevel): string => {
    const colors = {
      low: 'bg-success/20 text-success',
      medium: 'bg-warning/20 text-warning',
      high: 'bg-orange-500/20 text-orange-500',
      full: 'bg-destructive/20 text-destructive',
    }
    return colors[level]
  }, [])

  const calculateOccupancy = useCallback(
    (date: string): number => {
      const events = getDayEvents(date)
      const stats = calculateDayStats(date, events)
      return stats.ocupacion
    },
    [getDayEvents]
  )

  return {
    currentDate,
    currentView,
    filters,
    loading: false,
    monthDays,
    currentWeek,
    todayEvents,
    stats,
    canchas: mockCanchas,
    setView,
    goToToday,
    goToPrevious,
    goToNext,
    goToDate,
    setFilters,
    getDayEvents,
    getSlotEvents,
    getOccupancyColor,
    calculateOccupancy,
  }
}
