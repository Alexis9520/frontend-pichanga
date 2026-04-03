import type { ReservaConLlegada, ReservasDiaResumen, ToleranciaConfig } from '../types'

// Configuración de tolerancia por defecto
export const defaultToleranciaConfig: ToleranciaConfig = {
  minutos: 15,
  politicaExceso: 'tiempo_restante',
  penalidadMonto: 20,
}

// Hora actual simulada (para demo)
const ahora = new Date()
const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`

// Reservas del día (mock)
export const reservasHoyMock: ReservaConLlegada[] = [
  {
    id: 'res-001',
    venueId: 'venue-001',
    venueNombre: 'Cancha Los Campeones - F5',
    date: new Date().toISOString().split('T')[0],
    startTime: '15:00',
    endTime: '16:00',
    duracionHoras: 1,
    precioBase: 100,
    totalPrice: 100,
    status: 'confirmed',
    source: 'app_mobile',
    clienteNombre: 'Carlos Mendoza',
    clienteTelefono: '999123456',
    clienteEmail: 'carlos@email.com',
    adelantoPagado: 100,
    saldoPendiente: 0,
    estadoPago: 'completed',
    productos: [],
    pagos: [
      {
        id: 'pago-001',
        tipoPago: 'completo',
        monto: 100,
        metodoPago: 'culqi',
        fecha: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    toleranciaConfig: defaultToleranciaConfig,
  },
  {
    id: 'res-002',
    venueId: 'venue-001',
    venueNombre: 'Cancha Los Campeones - F5',
    date: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '17:00',
    duracionHoras: 1,
    precioBase: 100,
    totalPrice: 100,
    status: 'confirmed',
    source: 'web_owner',
    clienteNombre: 'Juan Pérez',
    clienteTelefono: '999654321',
    adelantoPagado: 30,
    saldoPendiente: 70,
    estadoPago: 'partial',
    productos: [
      { id: 'prod-001', nombre: 'Agua mineral x6', cantidad: 1, precioUnitario: 15, subtotal: 15 },
    ],
    pagos: [
      {
        id: 'pago-002',
        tipoPago: 'adelanto',
        monto: 30,
        metodoPago: 'efectivo',
        fecha: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    toleranciaConfig: defaultToleranciaConfig,
  },
  {
    id: 'res-003',
    venueId: 'venue-002',
    venueNombre: 'Cancha Los Campeones - F7',
    date: new Date().toISOString().split('T')[0],
    startTime: '17:00',
    endTime: '19:00',
    duracionHoras: 2,
    precioBase: 280,
    totalPrice: 280,
    status: 'confirmed',
    source: 'phone_call',
    clienteNombre: 'Pedro García',
    clienteTelefono: '998765432',
    adelantoPagado: 0,
    saldoPendiente: 280,
    estadoPago: 'pending',
    productos: [],
    pagos: [],
    observaciones: 'Cliente habitual, trae su balón',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    toleranciaConfig: defaultToleranciaConfig,
  },
  {
    id: 'res-004',
    venueId: 'venue-001',
    venueNombre: 'Cancha Los Campeones - F5',
    date: new Date().toISOString().split('T')[0],
    startTime: '19:00',
    endTime: '20:00',
    duracionHoras: 1,
    precioBase: 120,
    totalPrice: 120,
    status: 'in_progress',
    source: 'walk_in',
    clienteNombre: 'Miguel Torres',
    clienteTelefono: '997123456',
    adelantoPagado: 120,
    saldoPendiente: 0,
    estadoPago: 'completed',
    productos: [
      { id: 'prod-002', nombre: 'Gaseosa x4', cantidad: 1, precioUnitario: 16, subtotal: 16 },
    ],
    pagos: [
      {
        id: 'pago-003',
        tipoPago: 'completo',
        monto: 120,
        metodoPago: 'yape',
        fecha: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    toleranciaConfig: defaultToleranciaConfig,
    llegada: {
      horaLlegada: '18:55',
      minutosRetraso: 0,
      dentroDeTolerancia: true,
      status: 'a_tiempo',
      metodoValidacion: 'manual',
      aplicoPenalidad: false,
    },
  },
  {
    id: 'res-005',
    venueId: 'venue-002',
    venueNombre: 'Cancha Los Campeones - F7',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:00',
    duracionHoras: 1,
    precioBase: 100,
    totalPrice: 100,
    status: 'completed',
    source: 'app_mobile',
    clienteNombre: 'Ana López',
    clienteTelefono: '996123456',
    adelantoPagado: 100,
    saldoPendiente: 0,
    estadoPago: 'completed',
    productos: [],
    pagos: [
      {
        id: 'pago-004',
        tipoPago: 'completo',
        monto: 100,
        metodoPago: 'culqi',
        fecha: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    toleranciaConfig: defaultToleranciaConfig,
    llegada: {
      horaLlegada: '13:58',
      minutosRetraso: 0,
      dentroDeTolerancia: true,
      status: 'a_tiempo',
      metodoValidacion: 'qr',
      aplicoPenalidad: false,
    },
  },
]

// Resumen del día
export const resumenHoyMock: ReservasDiaResumen = {
  fecha: new Date().toISOString().split('T')[0],
  total: 5,
  confirmadas: 3,
  pendientesLlegada: 3,
  enCurso: 1,
  completadas: 1,
  noShow: 0,
  ingresosTotales: 700,
  saldoPendienteTotal: 350,
}

// Función para calcular si una reserva está en horario actual
export function esHoraActual(startTime: string, endTime: string): boolean {
  const ahora = new Date()
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes()

  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)

  const inicioMinutos = startH * 60 + startM
  const finMinutos = endH * 60 + endM

  return horaActual >= inicioMinutos && horaActual < finMinutos
}

// Función para calcular minutos hasta/desde la reserva
export function calcularTiempoReserva(
  startTime: string,
  endTime: string
): {
  status: 'pasado' | 'actual' | 'proximo' | 'futuro'
  minutos: number
  texto: string
} {
  const ahora = new Date()
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes()

  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)

  const inicioMinutos = startH * 60 + startM
  const finMinutos = endH * 60 + endM

  if (horaActual >= finMinutos) {
    return { status: 'pasado', minutos: horaActual - finMinutos, texto: 'Finalizado' }
  }

  if (horaActual >= inicioMinutos && horaActual < finMinutos) {
    const restantes = finMinutos - horaActual
    return { status: 'actual', minutos: restantes, texto: `En curso - ${restantes} min restantes` }
  }

  const diferencia = inicioMinutos - horaActual
  if (diferencia <= 30) {
    return { status: 'proximo', minutos: diferencia, texto: `En ${diferencia} minutos` }
  }

  return { status: 'futuro', minutos: diferencia, texto: startTime }
}

// Función para calcular estado de llegada
export function calcularEstadoLlegada(
  horaInicio: string,
  horaLlegada: string,
  toleranciaMinutos: number
): {
  minutosRetraso: number
  dentroDeTolerancia: boolean
  tiempoRestante: number
} {
  const [startH, startM] = horaInicio.split(':').map(Number)
  const [llegadaH, llegadaM] = horaLlegada.split(':').map(Number)

  const inicioMinutos = startH * 60 + startM
  const llegadaMinutos = llegadaH * 60 + llegadaM

  const minutosRetraso = Math.max(0, llegadaMinutos - inicioMinutos)
  const dentroDeTolerancia = minutosRetraso <= toleranciaMinutos

  return {
    minutosRetraso,
    dentroDeTolerancia,
    tiempoRestante: 60 - minutosRetraso, // Asumiendo 1 hora de reserva
  }
}
