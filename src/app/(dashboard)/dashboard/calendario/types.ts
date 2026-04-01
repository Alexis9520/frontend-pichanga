// ===========================================
// TIPOS ESPECÍFICOS PARA CALENDARIO
// ===========================================

// Vista del calendario
export type CalendarView = 'month' | 'week' | 'day'

// Nivel de ocupación de un día
export type OccupancyLevel = 'low' | 'medium' | 'high' | 'full'

// ===========================================
// EVENTO DEL CALENDARIO (RESERVA O BLOQUEO)
// ===========================================
export type CalendarEventType = 'reservation' | 'blocking' | 'promotion'

export interface CalendarEvent {
  id: string
  type: CalendarEventType
  // Datos del cliente
  clienteNombre?: string
  clienteTelefono?: string
  // Cancha
  canchaId: string
  canchaNombre: string
  // Horario
  date: string
  startTime: string
  endTime: string
  duracionHoras: number
  // Financiero
  totalPrice?: number
  adelantoPagado?: number
  saldoPendiente?: number
  // Estado
  status?:
    | 'pending_payment'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'cancelled_with_refund'
  estadoPago?: 'pending' | 'partial' | 'completed' | 'refunded' | 'partial_refund'
  source?: 'manual' | 'app'
  // Para bloqueos
  motivoBloqueo?: string
  esRecurrente?: boolean
  // Para promociones
  promocionNombre?: string
  promocionDescuento?: number
  // Extras
  productos?: { nombre: string; cantidad: number }[]
  observaciones?: string
}

// ===========================================
// ESTADÍSTICAS DEL DÍA
// ===========================================
export interface DayStats {
  date: string
  totalReservas: number
  reservasConfirmadas: number
  reservasPendientes: number
  reservasCompletadas: number
  reservasCanceladas: number
  ingresos: number
  ocupacion: number // Porcentaje 0-100
  nivelOcupacion: OccupancyLevel
  bloqueos: number
}

// ===========================================
// SLOT DE HORARIO
// ===========================================
export interface TimeSlot {
  hora: string // "06:00", "06:30", "07:00"...
  esMediaHora: boolean // false para horas en punto, true para :30
  disponible: boolean
  precio?: number
  evento?: CalendarEvent
}

// ===========================================
// DÍA DEL CALENDARIO (VISTA MENSUAL)
// ===========================================
export interface CalendarDay {
  date: string
  dayNumber: number
  isToday: boolean
  isCurrentMonth: boolean
  dayOfWeek: number // 0-6
  stats: DayStats
  events: CalendarEvent[]
}

// ===========================================
// SEMANA DEL CALENDARIO
// ===========================================
export interface CalendarWeek {
  startDate: string
  endDate: string
  days: CalendarDay[]
  totalReservas: number
  totalIngresos: number
}

// ===========================================
// FILTROS DEL CALENDARIO
// ===========================================
export interface CalendarFilters {
  view: CalendarView
  canchas: string[] // IDs de canchas seleccionadas
  showBlockings: boolean
  showPromotions: boolean
  estados: ('pending_payment' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled')[]
}

// ===========================================
// CONFIGURACIÓN DE HORARIOS
// ===========================================
export interface ScheduleConfig {
  horaApertura: string
  horaCierre: string
  intervaloMinutos: number // 30 o 60
}

// ===========================================
// CANCHA PARA FILTRO
// ===========================================
export interface CanchaCalendario {
  id: string
  nombre: string
  color: string // Color para identificar en el calendario
  activa: boolean
}

// ===========================================
// RESPUESTA DEL HOOK
// ===========================================
export interface UseCalendarioReturn {
  // Estado
  currentDate: Date
  currentView: CalendarView
  filters: CalendarFilters
  loading: boolean

  // Datos calculados
  monthDays: CalendarDay[]
  currentWeek: CalendarWeek
  todayEvents: CalendarEvent[]

  // Estadísticas
  stats: {
    mesActual: {
      totalReservas: number
      ingresos: number
      ocupacionPromedio: number
    }
    semanaActual: {
      totalReservas: number
      ingresos: number
    }
    hoy: {
      totalReservas: number
      confirmadas: number
      pendientes: number
    }
  }

  // Canchas
  canchas: CanchaCalendario[]

  // Acciones
  setView: (view: CalendarView) => void
  goToToday: () => void
  goToPrevious: () => void
  goToNext: () => void
  goToDate: (date: Date) => void
  setFilters: (filters: Partial<CalendarFilters>) => void

  // Helpers
  getDayEvents: (date: string) => CalendarEvent[]
  getSlotEvents: (date: string, hora: string, canchaId: string) => CalendarEvent[]
  getOccupancyColor: (level: OccupancyLevel) => string
  calculateOccupancy: (date: string) => number
}
