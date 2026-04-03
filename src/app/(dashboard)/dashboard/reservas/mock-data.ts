import type {
  Reserva,
  CanchaConfig,
  ProductoInventario,
  PromocionDisponible,
  ReservaStats,
} from './types'

// ===========================================
// CANCHAS DISPONIBLES
// ===========================================
export const mockCanchas: CanchaConfig[] = [
  {
    id: '1',
    nombre: 'Cancha 1 - Los Campeones',
    precioHoraBase: 80,
    precioHoraNoche: 120,
    horaInicioDiurno: '06:00',
    horaInicioNoche: '18:00',
    horaCierre: '22:00',
    adelantoMinimo: 30,
    toleranciaMinutos: 15,
    servicios: ['Estacionamiento', 'Baños', 'Duchas', 'Iluminación'],
    disponible: true,
  },
  {
    id: '2',
    nombre: 'Cancha 2 - La Gloria',
    precioHoraBase: 100,
    precioHoraNoche: 150,
    horaInicioDiurno: '06:00',
    horaInicioNoche: '18:00',
    horaCierre: '23:00',
    adelantoMinimo: 40,
    toleranciaMinutos: 10,
    servicios: ['Estacionamiento', 'Baños', 'Quincho'],
    disponible: true,
  },
  {
    id: '3',
    nombre: 'Cancha 3 - El Triunfo',
    precioHoraBase: 60,
    precioHoraNoche: 90,
    horaInicioDiurno: '07:00',
    horaInicioNoche: '18:00',
    horaCierre: '21:00',
    adelantoMinimo: 25,
    toleranciaMinutos: 15,
    servicios: ['Baños'],
    disponible: true,
  },
]

// ===========================================
// PRODUCTOS INVENTARIO
// ===========================================
export const mockProductos: ProductoInventario[] = [
  { id: 'p1', nombre: 'Agua mineral', categoria: 'bebida', precio: 3.0, stock: 48, activo: true },
  { id: 'p2', nombre: 'Gaseosa', categoria: 'bebida', precio: 4.0, stock: 36, activo: true },
  { id: 'p3', nombre: 'Cerveza', categoria: 'bebida', precio: 8.0, stock: 24, activo: true },
  { id: 'p4', nombre: 'Jugo natural', categoria: 'bebida', precio: 5.0, stock: 20, activo: true },
  { id: 'p5', nombre: 'Papas fritas', categoria: 'snack', precio: 5.0, stock: 30, activo: true },
  { id: 'p6', nombre: 'Maní', categoria: 'snack', precio: 3.0, stock: 40, activo: true },
  { id: 'p7', nombre: 'Alquiler de balón', categoria: 'alquiler', precio: 10.0, activo: true },
  { id: 'p8', nombre: 'Árbitro', categoria: 'servicio', precio: 50.0, activo: true },
  { id: 'p9', nombre: 'Camerinos', categoria: 'servicio', precio: 20.0, activo: true },
  { id: 'p10', nombre: 'Estacionamiento', categoria: 'servicio', precio: 5.0, activo: true },
]

// ===========================================
// PROMOCIONES DISPONIBLES
// ===========================================
export const mockPromociones: PromocionDisponible[] = [
  {
    id: 'promo1',
    nombre: 'Martes de Mañana',
    tipo: 'descuento_porcentual',
    valor: 20,
    descripcion: '20% OFF en horarios de mañana los martes',
    diasAplicables: ['Martes'],
    horarios: [{ inicio: '06:00', fin: '12:00' }],
    cuposDisponibles: 5,
    vigente: true,
  },
  {
    id: 'promo2',
    nombre: 'Miércoles 2x1',
    tipo: 'combo_horas',
    valor: 50,
    descripcion: '2 horas al precio de 1.5 horas los miércoles',
    diasAplicables: ['Miércoles'],
    horarios: [{ inicio: '08:00', fin: '18:00' }],
    cuposDisponibles: 3,
    vigente: true,
  },
  {
    id: 'promo3',
    nombre: 'Noche de Jueves',
    tipo: 'precio_fijo',
    valor: 70,
    descripcion: 'Precio especial S/70 los jueves de noche',
    diasAplicables: ['Jueves'],
    horarios: [{ inicio: '19:00', fin: '22:00' }],
    cuposDisponibles: 4,
    vigente: true,
  },
]

// ===========================================
// RESERVAS MOCK
// ===========================================
export const mockReservas: Reserva[] = [
  {
    id: 'r1',
    venueId: '1',
    venueNombre: 'Cancha 1 - Los Campeones',
    date: '2026-03-27',
    startTime: '14:00',
    endTime: '16:00',
    duracionHoras: 2,
    precioBase: 160,
    totalPrice: 184,
    status: 'confirmed',
    source: 'web_owner',
    clienteNombre: 'Carlos Mendoza',
    clienteTelefono: '999888777',
    clienteEmail: 'carlos@email.com',
    adelantoPagado: 50,
    saldoPendiente: 134,
    estadoPago: 'partial',
    promocion: {
      id: 'promo1',
      nombre: 'Martes de Mañana',
      tipo: 'descuento_porcentual',
      valor: 20,
      descuentoAplicado: 32,
    },
    productos: [{ id: 'ep1', nombre: 'Gaseosa', cantidad: 6, precioUnitario: 4, subtotal: 24 }],
    pagos: [
      {
        id: 'pago1',
        tipoPago: 'adelanto',
        monto: 50,
        metodoPago: 'yape',
        fecha: '2026-03-25T10:30:00Z',
        registradoPor: 'Pedro Ramos',
      },
    ],
    observaciones: 'Cliente frecuente, solicita balón',
    createdAt: '2026-03-25T10:00:00Z',
    updatedAt: '2026-03-25T10:30:00Z',
    registradoPor: 'Pedro Ramos',
  },
  {
    id: 'r2',
    venueId: '2',
    venueNombre: 'Cancha 2 - La Gloria',
    date: '2026-03-27',
    startTime: '17:00',
    endTime: '18:00',
    duracionHoras: 1,
    precioBase: 100,
    totalPrice: 100,
    status: 'confirmed',
    source: 'web_owner',
    clienteNombre: 'Miguel Torres',
    clienteTelefono: '998765432',
    clienteEmail: 'miguel.t@email.com',
    adelantoPagado: 100,
    saldoPendiente: 0,
    estadoPago: 'completed',
    productos: [],
    pagos: [
      {
        id: 'pago2',
        tipoPago: 'completo',
        monto: 100,
        metodoPago: 'efectivo',
        fecha: '2026-03-26T15:00:00Z',
        registradoPor: 'Pedro Ramos',
      },
    ],
    createdAt: '2026-03-26T14:30:00Z',
    updatedAt: '2026-03-26T15:00:00Z',
    registradoPor: 'Pedro Ramos',
  },
  {
    id: 'r3',
    venueId: '1',
    venueNombre: 'Cancha 1 - Los Campeones',
    date: '2026-03-28',
    startTime: '10:00',
    endTime: '11:00',
    duracionHoras: 1,
    precioBase: 80,
    totalPrice: 80,
    status: 'pending',
    source: 'web_owner',
    clienteNombre: 'Ana García',
    clienteTelefono: '997654321',
    adelantoPagado: 0,
    saldoPendiente: 80,
    estadoPago: 'pending',
    productos: [],
    pagos: [],
    observaciones: 'Reserva telefónica',
    createdAt: '2026-03-26T16:00:00Z',
    updatedAt: '2026-03-26T16:00:00Z',
    registradoPor: 'Pedro Ramos',
  },
  {
    id: 'r4',
    venueId: '3',
    venueNombre: 'Cancha 3 - El Triunfo',
    date: '2026-03-27',
    startTime: '19:00',
    endTime: '21:00',
    duracionHoras: 2,
    precioBase: 180,
    totalPrice: 180,
    status: 'confirmed',
    source: 'app_mobile',
    clienteNombre: 'Pedro López',
    clienteTelefono: '996543210',
    clienteEmail: 'pedro.lopez@email.com',
    adelantoPagado: 180,
    saldoPendiente: 0,
    estadoPago: 'completed',
    productos: [
      { id: 'ep2', nombre: 'Agua mineral', cantidad: 4, precioUnitario: 3, subtotal: 12 },
      { id: 'ep3', nombre: 'Alquiler de balón', cantidad: 1, precioUnitario: 10, subtotal: 10 },
    ],
    pagos: [
      {
        id: 'pago3',
        tipoPago: 'completo',
        monto: 180,
        metodoPago: 'culqi',
        fecha: '2026-03-25T20:00:00Z',
      },
    ],
    createdAt: '2026-03-25T19:30:00Z',
    updatedAt: '2026-03-25T20:00:00Z',
  },
  {
    id: 'r5',
    venueId: '1',
    venueNombre: 'Cancha 1 - Los Campeones',
    date: '2026-03-26',
    startTime: '15:00',
    endTime: '16:00',
    duracionHoras: 1,
    precioBase: 80,
    totalPrice: 80,
    status: 'completed',
    source: 'web_owner',
    clienteNombre: 'Juan Rodríguez',
    clienteTelefono: '995432109',
    adelantoPagado: 80,
    saldoPendiente: 0,
    estadoPago: 'completed',
    productos: [],
    pagos: [
      {
        id: 'pago4',
        tipoPago: 'completo',
        monto: 80,
        metodoPago: 'plin',
        fecha: '2026-03-26T14:30:00Z',
        registradoPor: 'Pedro Ramos',
      },
    ],
    horaLlegada: '14:55',
    dentroDeTolerancia: true,
    createdAt: '2026-03-25T12:00:00Z',
    updatedAt: '2026-03-26T16:00:00Z',
    registradoPor: 'Pedro Ramos',
  },
  {
    id: 'r6',
    venueId: '2',
    venueNombre: 'Cancha 2 - La Gloria',
    date: '2026-03-25',
    startTime: '18:00',
    endTime: '19:00',
    duracionHoras: 1,
    precioBase: 150,
    totalPrice: 150,
    status: 'cancelled',
    source: 'app_mobile',
    clienteNombre: 'Luis Martínez',
    clienteTelefono: '994321098',
    clienteEmail: 'luis.m@email.com',
    adelantoPagado: 40,
    saldoPendiente: 0,
    estadoPago: 'refunded',
    productos: [],
    pagos: [
      {
        id: 'pago5',
        tipoPago: 'adelanto',
        monto: 40,
        metodoPago: 'culqi',
        fecha: '2026-03-24T10:00:00Z',
      },
    ],
    observaciones: 'Cancelado por el cliente con reembolso',
    createdAt: '2026-03-24T09:30:00Z',
    updatedAt: '2026-03-25T08:00:00Z',
  },
  {
    id: 'r7',
    venueId: '1',
    venueNombre: 'Cancha 1 - Los Campeones',
    date: '2026-03-27',
    startTime: '08:00',
    endTime: '09:00',
    duracionHoras: 1,
    precioBase: 80,
    totalPrice: 64,
    status: 'confirmed',
    source: 'web_owner',
    clienteNombre: 'Roberto Sánchez',
    clienteTelefono: '993210987',
    adelantoPagado: 30,
    saldoPendiente: 34,
    estadoPago: 'partial',
    promocion: {
      id: 'promo1',
      nombre: 'Martes de Mañana',
      tipo: 'descuento_porcentual',
      valor: 20,
      descuentoAplicado: 16,
    },
    productos: [],
    pagos: [
      {
        id: 'pago6',
        tipoPago: 'adelanto',
        monto: 30,
        metodoPago: 'efectivo',
        fecha: '2026-03-26T17:00:00Z',
        registradoPor: 'Pedro Ramos',
      },
    ],
    createdAt: '2026-03-26T16:30:00Z',
    updatedAt: '2026-03-26T17:00:00Z',
    registradoPor: 'Pedro Ramos',
  },
]

// ===========================================
// ESTADÍSTICAS
// ===========================================
export const mockReservaStats: ReservaStats = {
  hoy: {
    total: 8,
    pendientes: 2,
    ingresos: 580,
  },
  pendientes: {
    total: 3,
    saldoPendiente: 248,
  },
  semana: {
    total: 45,
    ingresos: 3250,
  },
}

// ===========================================
// HELPERS
// ===========================================
export function calcularPrecioReserva(
  cancha: {
    precioHoraBase: number
    precioHoraNoche: number
    horaInicioNoche: string
  },
  fecha: string,
  horaInicio: string,
  duracion: number
): { precioBase: number; precioPorHora: number[] } {
  const precios: number[] = []
  const [hora] = horaInicio.split(':').map(Number)

  for (let i = 0; i < duracion; i++) {
    const horaActual = hora + i
    const [horaNoche] = cancha.horaInicioNoche.split(':').map(Number)

    if (horaActual >= horaNoche) {
      precios.push(cancha.precioHoraNoche)
    } else {
      precios.push(cancha.precioHoraBase)
    }
  }

  return {
    precioBase: precios.reduce((a, b) => a + b, 0),
    precioPorHora: precios,
  }
}

export function aplicarPromocion(
  precioBase: number,
  promocion: PromocionDisponible | undefined
): { precioFinal: number; descuento: number } {
  if (!promocion) {
    return { precioFinal: precioBase, descuento: 0 }
  }

  let descuento = 0

  switch (promocion.tipo) {
    case 'descuento_porcentual':
      descuento = precioBase * (promocion.valor / 100)
      break
    case 'precio_fijo':
      descuento = precioBase - promocion.valor
      break
    case 'combo_horas':
      // 2 horas al precio de 1.5 (50% de descuento en la segunda hora)
      descuento = precioBase * (promocion.valor / 100)
      break
    default:
      descuento = 0
  }

  return {
    precioFinal: Math.max(precioBase - descuento, 0),
    descuento,
  }
}
