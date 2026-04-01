// ===========================================
// TIPOS ESPECÍFICOS PARA RESERVAS
// ===========================================

// Estados de reserva según PRD 4.4.3
export type ReservationStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'cancelled_with_refund'

// Estados de pago según PRD 4.13.2
export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'refunded' | 'partial_refund'

// Origen de la reserva según PRD 4.14.1
export type ReservationSource = 'manual' | 'app'

// Tipos de pago según PRD 4.13.5
export type PaymentType = 'adelanto' | 'saldo' | 'completo'

// Métodos de pago según PRD 4.13.5
export type PaymentMethod = 'culqi' | 'efectivo' | 'tarjeta_local' | 'yape' | 'plin'

// Métodos de pago para reservas manuales (sin culqi)
export type ManualPaymentMethod = 'efectivo' | 'tarjeta_local' | 'yape' | 'plin'

// ===========================================
// PRODUCTO EXTRA EN RESERVA
// ===========================================
export interface ReservaProducto {
  id: string
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

// ===========================================
// PAGO DE RESERVA
// ===========================================
export interface ReservaPago {
  id: string
  tipoPago: PaymentType
  monto: number
  metodoPago: PaymentMethod
  fecha: string
  registradoPor?: string
  observaciones?: string
}

// ===========================================
// PROMOCIÓN APLICADA
// ===========================================
export interface PromocionAplicada {
  id: string
  nombre: string
  tipo: 'descuento_porcentual' | 'precio_fijo' | 'combo_horas' | 'combo_productos'
  valor: number
  descuentoAplicado: number
}

// ===========================================
// RESERVA COMPLETA
// ===========================================
export interface Reserva {
  id: string
  venueId: string
  venueNombre: string
  date: string
  startTime: string
  endTime: string
  duracionHoras: number
  precioBase: number
  totalPrice: number
  status: ReservationStatus
  source: ReservationSource
  // Cliente
  clienteNombre: string
  clienteTelefono: string
  clienteEmail?: string
  // Pagos
  adelantoPagado: number
  saldoPendiente: number
  estadoPago: PaymentStatus
  // Extras
  promocion?: PromocionAplicada
  productos: ReservaProducto[]
  pagos: ReservaPago[]
  observaciones?: string
  // Auditoría
  createdAt: string
  updatedAt: string
  registradoPor?: string
  // Llegada
  horaLlegada?: string
  dentroDeTolerancia?: boolean
}

// ===========================================
// FORMULARIO NUEVA RESERVA
// ===========================================
export interface NuevaReservaFormData {
  // Paso 1: Cliente
  clienteNombre: string
  clienteTelefono: string
  clienteEmail?: string
  // Paso 2: Cancha y horario
  canchaId: string
  fecha: string
  horaInicio: string
  duracion: '1' | '2' | '3'
  // Paso 3: Extras
  promocionId?: string
  productos: { id: string; cantidad: number }[]
  // Paso 4: Pago
  adelanto: number
  metodoAdelanto?: ManualPaymentMethod
  observaciones?: string
}

// ===========================================
// FILTROS DE RESERVAS
// ===========================================
export interface ReservaFilters {
  search: string
  fechaDesde: string
  fechaHasta: string
  canchaId: string
  estado: ReservationStatus | 'all'
  estadoPago: PaymentStatus | 'all'
  source: ReservationSource | 'all'
  metodoPago: PaymentMethod | 'all'
}

// ===========================================
// ESTADÍSTICAS DE RESERVAS
// ===========================================
export interface ReservaStats {
  hoy: {
    total: number
    pendientes: number
    ingresos: number
  }
  pendientes: {
    total: number
    saldoPendiente: number
  }
  semana: {
    total: number
    ingresos: number
  }
}

// ===========================================
// CONFIGURACIÓN DE CANCHA PARA RESERVA
// ===========================================
export interface CanchaConfig {
  id: string
  nombre: string
  precioHoraBase: number
  precioHoraNoche: number
  horaInicioDiurno: string
  horaInicioNoche: string
  horaCierre: string
  adelantoMinimo: number
  toleranciaMinutos: number
  servicios: string[]
  disponible: boolean
}

// ===========================================
// PRODUCTO INVENTARIO
// ===========================================
export interface ProductoInventario {
  id: string
  nombre: string
  categoria: 'bebida' | 'snack' | 'deportivo' | 'alquiler' | 'servicio'
  precio: number
  stock?: number
  activo: boolean
}

// ===========================================
// PROMOCIÓN DISPONIBLE
// ===========================================
export interface PromocionDisponible {
  id: string
  nombre: string
  tipo: 'descuento_porcentual' | 'precio_fijo' | 'combo_horas' | 'combo_productos'
  valor: number
  descripcion: string
  diasAplicables: string[]
  horarios: { inicio: string; fin: string }[]
  cuposDisponibles: number
  vigente: boolean
}
