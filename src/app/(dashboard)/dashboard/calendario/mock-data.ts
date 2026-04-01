import type { CanchaCalendario, CalendarEvent, DayStats, OccupancyLevel } from './types'

// ===========================================
// CANCHAS DISPONIBLES
// ===========================================
export const mockCanchas: CanchaCalendario[] = [
  { id: '1', nombre: 'Cancha 1 - Los Campeones', color: '#22c55e', activa: true },
  { id: '2', nombre: 'Cancha 2 - La Gloria', color: '#f59e0b', activa: true },
  { id: '3', nombre: 'Cancha 3 - El Triunfo', color: '#8b5cf6', activa: true },
]

// ===========================================
// GENERAR FECHAS RELATIVAS
// ===========================================
function getDate(daysFromToday: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split('T')[0]
}

// ===========================================
// RESERVAS MOCK (Distribuidas en el mes)
// ===========================================
export const mockReservas: CalendarEvent[] = [
  // HOY
  {
    id: 'r-today-1',
    type: 'reservation',
    clienteNombre: 'Carlos Mendoza',
    clienteTelefono: '999888777',
    canchaId: '1',
    canchaNombre: 'Cancha 1 - Los Campeones',
    date: getDate(0),
    startTime: '14:00',
    endTime: '16:00',
    duracionHoras: 2,
    totalPrice: 200,
    adelantoPagado: 50,
    saldoPendiente: 150,
    status: 'confirmed',
    estadoPago: 'partial',
    source: 'manual',
    productos: [{ nombre: 'Gaseosa', cantidad: 6 }],
  },
  {
    id: 'r-today-2',
    type: 'reservation',
    clienteNombre: 'Miguel Torres',
    clienteTelefono: '998765432',
    canchaId: '2',
    canchaNombre: 'Cancha 2 - La Gloria',
    date: getDate(0),
    startTime: '17:00',
    endTime: '18:00',
    duracionHoras: 1,
    totalPrice: 100,
    adelantoPagado: 100,
    saldoPendiente: 0,
    status: 'confirmed',
    estadoPago: 'completed',
    source: 'manual',
  },
  {
    id: 'r-today-3',
    type: 'reservation',
    clienteNombre: 'Ana García',
    clienteTelefono: '997654321',
    canchaId: '1',
    canchaNombre: 'Cancha 1 - Los Campeones',
    date: getDate(0),
    startTime: '18:00',
    endTime: '19:00',
    duracionHoras: 1,
    totalPrice: 120,
    adelantoPagado: 0,
    saldoPendiente: 120,
    status: 'pending_payment',
    estadoPago: 'pending',
    source: 'manual',
    observaciones: 'Reserva telefónica',
  },
  {
    id: 'r-today-4',
    type: 'reservation',
    clienteNombre: 'Pedro López',
    clienteTelefono: '996543210',
    canchaId: '3',
    canchaNombre: 'Cancha 3 - El Triunfo',
    date: getDate(0),
    startTime: '19:00',
    endTime: '21:00',
    duracionHoras: 2,
    totalPrice: 180,
    adelantoPagado: 180,
    saldoPendiente: 0,
    status: 'confirmed',
    estadoPago: 'completed',
    source: 'app',
  },
  {
    id: 'r-today-5',
    type: 'reservation',
    clienteNombre: 'Roberto Sánchez',
    clienteTelefono: '993210987',
    canchaId: '1',
    canchaNombre: 'Cancha 1 - Los Campeones',
    date: getDate(0),
    startTime: '08:00',
    endTime: '09:00',
    duracionHoras: 1,
    totalPrice: 64,
    adelantoPagado: 30,
    saldoPendiente: 34,
    status: 'confirmed',
    estadoPago: 'partial',
    source: 'manual',
    promocionNombre: 'Martes de Mañana',
    promocionDescuento: 16,
  },

  // MAÑANA
  {
    id: 'r-tomorrow-1',
    type: 'reservation',
    clienteNombre: 'Juan Rodríguez',
    clienteTelefono: '995432109',
    canchaId: '2',
    canchaNombre: 'Cancha 2 - La Gloria',
    date: getDate(1),
    startTime: '10:00',
    endTime: '12:00',
    duracionHoras: 2,
    totalPrice: 200,
    adelantoPagado: 200,
    saldoPendiente: 0,
    status: 'confirmed',
    estadoPago: 'completed',
    source: 'app',
  },
  {
    id: 'r-tomorrow-2',
    type: 'reservation',
    clienteNombre: 'Luis Martínez',
    clienteTelefono: '994321098',
    canchaId: '1',
    canchaNombre: 'Cancha 1 - Los Campeones',
    date: getDate(1),
    startTime: '15:00',
    endTime: '17:00',
    duracionHoras: 2,
    totalPrice: 200,
    adelantoPagado: 0,
    saldoPendiente: 200,
    status: 'pending_payment',
    estadoPago: 'pending',
    source: 'manual',
  },
  {
    id: 'r-tomorrow-3',
    type: 'reservation',
    clienteNombre: 'Diego Fernández',
    clienteTelefono: '992109876',
    canchaId: '3',
    canchaNombre: 'Cancha 3 - El Triunfo',
    date: getDate(1),
    startTime: '18:00',
    endTime: '20:00',
    duracionHoras: 2,
    totalPrice: 180,
    adelantoPagado: 50,
    saldoPendiente: 130,
    status: 'confirmed',
    estadoPago: 'partial',
    source: 'manual',
  },

  // PASADO MAÑANA
  {
    id: 'r-dayafter-1',
    type: 'reservation',
    clienteNombre: 'María López',
    clienteTelefono: '991098765',
    canchaId: '1',
    canchaNombre: 'Cancha 1 - Los Campeones',
    date: getDate(2),
    startTime: '16:00',
    endTime: '18:00',
    duracionHoras: 2,
    totalPrice: 240,
    adelantoPagado: 240,
    saldoPendiente: 0,
    status: 'confirmed',
    estadoPago: 'completed',
    source: 'app',
  },

  // HACE 2 DÍAS (COMPLETADAS)
  {
    id: 'r-past-1',
    type: 'reservation',
    clienteNombre: 'Jorge Ramírez',
    clienteTelefono: '990987654',
    canchaId: '2',
    canchaNombre: 'Cancha 2 - La Gloria',
    date: getDate(-2),
    startTime: '14:00',
    endTime: '16:00',
    duracionHoras: 2,
    totalPrice: 200,
    adelantoPagado: 200,
    saldoPendiente: 0,
    status: 'completed',
    estadoPago: 'completed',
    source: 'manual',
  },
  {
    id: 'r-past-2',
    type: 'reservation',
    clienteNombre: 'Carmen Ruiz',
    clienteTelefono: '989876543',
    canchaId: '1',
    canchaNombre: 'Cancha 1 - Los Campeones',
    date: getDate(-2),
    startTime: '18:00',
    endTime: '19:00',
    duracionHoras: 1,
    totalPrice: 120,
    adelantoPagado: 120,
    saldoPendiente: 0,
    status: 'completed',
    estadoPago: 'completed',
    source: 'app',
  },

  // HACE 1 DÍA (CANCELADA)
  {
    id: 'r-cancelled-1',
    type: 'reservation',
    clienteNombre: 'Pablo Sánchez',
    clienteTelefono: '988765432',
    canchaId: '3',
    canchaNombre: 'Cancha 3 - El Triunfo',
    date: getDate(-1),
    startTime: '10:00',
    endTime: '11:00',
    duracionHoras: 1,
    totalPrice: 60,
    adelantoPagado: 0,
    saldoPendiente: 0,
    status: 'cancelled',
    estadoPago: 'refunded',
    source: 'app',
    observaciones: 'Cancelado por el cliente',
  },

  // MÁS RESERVAS PARA ESTA SEMANA
  {
    id: 'r-week-1',
    type: 'reservation',
    clienteNombre: 'Andrés Torres',
    clienteTelefono: '987654321',
    canchaId: '1',
    canchaNombre: 'Cancha 1 - Los Campeones',
    date: getDate(3),
    startTime: '09:00',
    endTime: '10:00',
    duracionHoras: 1,
    totalPrice: 80,
    adelantoPagado: 80,
    saldoPendiente: 0,
    status: 'confirmed',
    estadoPago: 'completed',
    source: 'manual',
  },
  {
    id: 'r-week-2',
    type: 'reservation',
    clienteNombre: 'Fernando Díaz',
    clienteTelefono: '986543210',
    canchaId: '2',
    canchaNombre: 'Cancha 2 - La Gloria',
    date: getDate(4),
    startTime: '20:00',
    endTime: '22:00',
    duracionHoras: 2,
    totalPrice: 300,
    adelantoPagado: 100,
    saldoPendiente: 200,
    status: 'confirmed',
    estadoPago: 'partial',
    source: 'manual',
  },
  {
    id: 'r-week-3',
    type: 'reservation',
    clienteNombre: 'Ricardo Vargas',
    clienteTelefono: '985432109',
    canchaId: '3',
    canchaNombre: 'Cancha 3 - El Triunfo',
    date: getDate(5),
    startTime: '14:00',
    endTime: '16:00',
    duracionHoras: 2,
    totalPrice: 180,
    adelantoPagado: 180,
    saldoPendiente: 0,
    status: 'confirmed',
    estadoPago: 'completed',
    source: 'app',
  },

  // RESERVAS PARA LA SIGUIENTE SEMANA
  {
    id: 'r-nextweek-1',
    type: 'reservation',
    clienteNombre: 'Sergio Herrera',
    clienteTelefono: '984321098',
    canchaId: '1',
    canchaNombre: 'Cancha 1 - Los Campeones',
    date: getDate(7),
    startTime: '17:00',
    endTime: '19:00',
    duracionHoras: 2,
    totalPrice: 240,
    adelantoPagado: 240,
    saldoPendiente: 0,
    status: 'confirmed',
    estadoPago: 'completed',
    source: 'app',
  },
  {
    id: 'r-nextweek-2',
    type: 'reservation',
    clienteNombre: 'Gustavo Mendez',
    clienteTelefono: '983210987',
    canchaId: '2',
    canchaNombre: 'Cancha 2 - La Gloria',
    date: getDate(8),
    startTime: '10:00',
    endTime: '12:00',
    duracionHoras: 2,
    totalPrice: 200,
    adelantoPagado: 0,
    saldoPendiente: 200,
    status: 'pending_payment',
    estadoPago: 'pending',
    source: 'manual',
  },
]

// ===========================================
// BLOQUEOS DE HORARIO
// ===========================================
export const mockBloqueos: CalendarEvent[] = [
  {
    id: 'b-1',
    type: 'blocking',
    canchaId: '1',
    canchaNombre: 'Cancha 1 - Los Campeones',
    date: getDate(3),
    startTime: '12:00',
    endTime: '14:00',
    duracionHoras: 2,
    motivoBloqueo: 'Mantenimiento del césped',
    esRecurrente: false,
  },
  {
    id: 'b-2',
    type: 'blocking',
    canchaId: '2',
    canchaNombre: 'Cancha 2 - La Gloria',
    date: getDate(6),
    startTime: '08:00',
    endTime: '10:00',
    duracionHoras: 2,
    motivoBloqueo: 'Evento privado',
    esRecurrente: true,
  },
  {
    id: 'b-3',
    type: 'blocking',
    canchaId: '3',
    canchaNombre: 'Cancha 3 - El Triunfo',
    date: getDate(-3),
    startTime: '16:00',
    endTime: '18:00',
    duracionHoras: 2,
    motivoBloqueo: 'Torneo interno',
    esRecurrente: false,
  },
]

// ===========================================
// TODOS LOS EVENTOS
// ===========================================
export const mockAllEvents: CalendarEvent[] = [...mockReservas, ...mockBloqueos]

// ===========================================
// CONFIGURACIÓN DE HORARIOS
// ===========================================
export const scheduleConfig = {
  horaApertura: '06:00',
  horaCierre: '23:00',
  intervaloMinutos: 30,
}

// ===========================================
// HELPERS
// ===========================================
export function calculateOccupancyLevel(ocupacion: number): OccupancyLevel {
  if (ocupacion >= 91) return 'full'
  if (ocupacion >= 67) return 'high'
  if (ocupacion >= 34) return 'medium'
  return 'low'
}

export function calculateDayStats(date: string, events: CalendarEvent[]): DayStats {
  const reservas = events.filter((e) => e.type === 'reservation')
  const bloqueos = events.filter((e) => e.type === 'blocking')

  const totalReservas = reservas.length
  const reservasConfirmadas = reservas.filter(
    (r) => r.status === 'confirmed' || r.status === 'in_progress'
  ).length
  const reservasPendientes = reservas.filter((r) => r.status === 'pending_payment').length
  const reservasCompletadas = reservas.filter((r) => r.status === 'completed').length
  const reservasCanceladas = reservas.filter(
    (r) => r.status === 'cancelled' || r.status === 'cancelled_with_refund'
  ).length

  const ingresos = reservas
    .filter((r) => r.status !== 'cancelled' && r.status !== 'cancelled_with_refund')
    .reduce((acc, r) => acc + (r.totalPrice || 0), 0)

  // Calcular ocupación (simplificado: reservas / 15 slots máximos por día)
  const totalSlots = 15 // Aproximadamente 15 horas disponibles
  const slotsOcupados = reservas.reduce((acc, r) => acc + r.duracionHoras, 0)
  const ocupacion = Math.min(Math.round((slotsOcupados / totalSlots) * 100), 100)

  return {
    date,
    totalReservas,
    reservasConfirmadas,
    reservasPendientes,
    reservasCompletadas,
    reservasCanceladas,
    ingresos,
    ocupacion,
    nivelOcupacion: calculateOccupancyLevel(ocupacion),
    bloqueos: bloqueos.length,
  }
}

// Generar horarios del día
export function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 6; h <= 22; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`)
    slots.push(`${h.toString().padStart(2, '0')}:30`)
  }
  return slots
}
