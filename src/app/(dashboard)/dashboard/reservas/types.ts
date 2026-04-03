// ===========================================
// TIPOS ESPECÍFICOS PARA RESERVAS
// ===========================================

// Estados de reserva según PRD v2.2 - Sección 4.4.3
export type ReservationStatus =
  | 'pending' // Creada, esperando confirmación
  | 'confirmed' // Confirmada y calendarizada
  | 'in_progress' // En curso (hora de inicio llegó)
  | 'completed' // Finalizó exitosamente
  | 'cancelled' // Cancelada

// Estados de pago según PRD v2.2 - Sección 4.4.3
export type PaymentStatus =
  | 'pending' // Sin pago registrado
  | 'partial' // Adelanto pagado, saldo pendiente
  | 'completed' // Pago total realizado
  | 'refunded' // Reembolso total
  | 'partial_refund' // Reembolso parcial

// Origen de la reserva según PRD v2.2 - Sección 6.3.1
export type ReservationSource =
  | 'app_mobile' // Reserva desde aplicación móvil de jugador
  | 'web_owner' // Reserva creada por owner en Web Dashboard
  | 'web_admin' // Reserva creada por admin (override especial)
  | 'phone_call' // Reserva manual por llamada telefónica
  | 'walk_in' // Reserva manual por cliente que llegó al local

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

// ===========================================
// SISTEMA DE LLEGADA - PRD v2.2 Sección 4.10.5
// ===========================================

// Política de exceso de tolerancia
export type PoliticaExceso =
  | 'perder_reserva' // Si excede tolerancia, pierde la reserva sin reembolso
  | 'penalidad' // Se cobra una penalidad pero puede jugar el tiempo restante
  | 'tiempo_restante' // Solo puede jugar el tiempo que quede de la reserva
  | 'configurable' // El dueño define su propia política personalizada

// Configuración de tolerancia de la cancha
export interface ToleranciaConfig {
  minutos: number // Minutos de gracia (default: 15)
  politicaExceso: PoliticaExceso
  penalidadMonto?: number // Monto de penalidad si aplica
}

// Estado de llegada
export type LlegadaStatus =
  | 'pendiente' // Cliente aún no llega
  | 'a_tiempo' // Llegó dentro de tolerancia
  | 'tarde' // Llegó tarde pero puede jugar
  | 'no_show' // No se presentó

// Información de llegada
export interface LlegadaInfo {
  horaLlegada?: string // Hora real de llegada
  minutosRetraso: number // Minutos de retraso (0 si llegó temprano)
  dentroDeTolerancia: boolean
  status: LlegadaStatus
  metodoValidacion: 'qr' | 'manual'
  aplicoPenalidad: boolean
  montoPenalidad?: number
}

// Reserva extendida con información de llegada
export interface ReservaConLlegada extends Reserva {
  llegada?: LlegadaInfo
  toleranciaConfig: ToleranciaConfig
}

// Acciones disponibles para una reserva del día
export type ReservaDiaAccion =
  | 'marcar_llegada'
  | 'no_se_presento'
  | 'registrar_saldo'
  | 'cancelar'
  | 'completar'

// Resumen de reservas del día
export interface ReservasDiaResumen {
  fecha: string
  total: number
  confirmadas: number
  pendientesLlegada: number
  enCurso: number
  completadas: number
  noShow: number
  ingresosTotales: number
  saldoPendienteTotal: number
}

// Filtros para la vista de reservas del día
export interface ReservasDiaFiltros {
  canchaId: string
  estado: 'todas' | 'pendientes' | 'en_curso' | 'completadas' | 'no_show'
  pagoPendiente: boolean // Solo mostrar reservas con saldo pendiente
}
