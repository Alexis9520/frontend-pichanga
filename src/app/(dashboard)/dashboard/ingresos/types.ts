// ===========================================
// TIPOS ESPECÍFICOS PARA INGRESOS
// ===========================================

// Tipo de ingreso
export type TipoIngreso = 'reserva' | 'venta_extra' | 'promocion'

// Estado de pago
export type EstadoPago = 'pending' | 'partial' | 'completed' | 'refunded'

// Método de pago
export type MetodoPago = 'culqi' | 'efectivo' | 'tarjeta_local' | 'yape' | 'plin'

// Origen de reserva
export type OrigenReserva = 'manual' | 'app'

// Rango horario
export type RangoHorario = 'madrugada' | 'mañana' | 'tarde' | 'noche'

// Período de análisis
export type PeriodoAnalisis = 'hoy' | 'semana' | 'mes' | 'trimestre' | 'anio' | 'custom'

// ===========================================
// RESERVA CON DATOS DE INGRESO
// ===========================================
export interface ReservaIngreso {
  id: string
  canchaId: string
  canchaNombre: string
  fecha: string
  horaInicio: string
  horaFin: string
  duracionHoras: number
  precioTotal: number
  precioBase: number
  descuentoPromo?: number
  promocionNombre?: string
  adelantoPagado: number
  saldoPendiente: number
  estadoPago: EstadoPago
  metodoPago: MetodoPago
  origen: OrigenReserva
  extrasTotal?: number
  clienteNombre: string
  clienteTelefono?: string
  createdAt: string
}

// ===========================================
// VENTA EXTRA PARA REPORTES
// ===========================================
export interface VentaExtraReporte {
  id: string
  reservaId?: string
  productoId: string
  productoNombre: string
  categoria: 'bebida' | 'snack' | 'deportivo' | 'alquiler' | 'servicio'
  cantidad: number
  precioUnitario: number
  costoUnitario?: number
  subtotal: number
  metodoPago: MetodoPago
  fecha: string
  clienteNombre?: string
}

// ===========================================
// INGRESO POR CANCHA
// ===========================================
export interface IngresoPorCancha {
  canchaId: string
  canchaNombre: string
  totalReservas: number
  ingresosReservas: number
  ingresosExtras: number
  totalIngresos: number
  ocupacionPorcentaje: number
  ticketPromedio: number
  comparativaAnterior: number // %
}

// ===========================================
// INGRESO POR HORARIO
// ===========================================
export interface IngresoPorHorario {
  horaInicio: string
  horaFin: string
  rango: RangoHorario
  totalReservas: number
  ingresos: number
  porcentajeOcupacion: number
}

// ===========================================
// INGRESO POR DÍA
// ===========================================
export interface IngresoPorDia {
  fecha: string
  diaNombre: string // Lunes, Martes, etc.
  ingresosReservas: number
  ingresosExtras: number
  totalIngresos: number
  totalReservas: number
  totalVentas: number
}

// ===========================================
// INGRESO POR MÉTODO DE PAGO
// ===========================================
export interface IngresoPorMetodoPago {
  metodo: MetodoPago
  total: number
  cantidad: number
  porcentaje: number
}

// ===========================================
// INGRESO POR CATEGORIA EXTRA
// ===========================================
export interface IngresoPorCategoria {
  categoria: 'bebida' | 'snack' | 'deportivo' | 'alquiler' | 'servicio'
  totalVentas: number
  ingresos: number
  cantidadProductos: number
  margenPromedio: number
}

// ===========================================
// TOP PRODUCTO
// ===========================================
export interface TopProducto {
  productoId: string
  productoNombre: string
  categoria: 'bebida' | 'snack' | 'deportivo' | 'alquiler' | 'servicio'
  cantidadVendida: number
  ingresos: number
  margen: number
}

// ===========================================
// TOP HORARIO
// ===========================================
export interface TopHorario {
  horaInicio: string
  horaFin: string
  reservas: number
  ingresos: number
  porcentajePeak: number
}

// ===========================================
// TENDENCIA MENSUAL
// ===========================================
export interface TendenciaMensual {
  mes: string // '2024-01'
  mesNombre: string // 'Enero'
  ingresosReservas: number
  ingresosExtras: number
  totalIngresos: number
  comparativaAnterior: number // %
}

// ===========================================
// ESTADÍSTICAS RESUMEN
// ===========================================
export interface IngresosStats {
  // Totales
  ingresosTotales: number
  ingresosReservas: number
  ingresosExtras: number
  ingresosPromociones: number // descuentos otorgados

  // Comparativas
  comparativaPorcentaje: number
  comparativaReservas: number
  comparativaExtras: number

  // Conteo
  totalReservas: number
  reservasCompletadas: number
  reservasCanceladas: number
  reservasPartial: number
  totalVentasExtras: number

  // Promedios
  ticketPromedioReserva: number
  ticketPromedioExtra: number

  // Saldo pendiente
  saldoPendienteTotal: number

  // Ratio
  ratioReservasExtras: number // % reservas vs extras

  // Top cancha
  canchaTopNombre: string
  canchaTopIngresos: number

  // Horario peak
  horarioPeak: string
  horarioPeakIngresos: number
}

// ===========================================
// FILTROS DE INGRESOS
// ===========================================
export interface IngresosFilters {
  periodo: PeriodoAnalisis
  fechaDesde?: string
  fechaHasta?: string
  canchaId?: string
  tipoIngreso?: TipoIngreso | 'all'
  metodoPago?: MetodoPago | 'all'
}

// ===========================================
// RESPUESTA DEL HOOK
// ===========================================
export interface UseIngresosReturn {
  // Data
  reservas: ReservaIngreso[]
  ventasExtras: VentaExtraReporte[]
  filters: IngresosFilters
  loading: boolean

  // Stats resumen
  stats: IngresosStats

  // Análisis agrupados
  ingresosPorDia: IngresoPorDia[]
  ingresosPorCancha: IngresoPorCancha[]
  ingresosPorHorario: IngresoPorHorario[]
  ingresosPorMetodoPago: IngresoPorMetodoPago[]
  ingresosPorCategoria: IngresoPorCategoria[]
  tendenciaMensual: TendenciaMensual[]

  // Top rankings
  topProductos: TopProducto[]
  topHorarios: TopHorario[]
  topCanchas: IngresoPorCancha[]

  // Helpers
  setFilters: (filters: Partial<IngresosFilters>) => void
  getReservasByCancha: (canchaId: string) => ReservaIngreso[]
  getVentasByCategoria: (categoria: string) => VentaExtraReporte[]
  exportarReporte: (formato: 'pdf' | 'excel') => Promise<void>
}

// ===========================================
// CONSTANTES
// ===========================================
export const METODOS_PAGO_CONFIG: Record<
  MetodoPago,
  { label: string; icon: string; color: string }
> = {
  culqi: { label: 'Culqi (Online)', icon: '💳', color: 'bg-blue-500/20 text-blue-500' },
  efectivo: { label: 'Efectivo', icon: '💵', color: 'bg-green-500/20 text-green-500' },
  tarjeta_local: {
    label: 'Tarjeta (Local)',
    icon: '💳',
    color: 'bg-purple-500/20 text-purple-500',
  },
  yape: { label: 'Yape', icon: '📱', color: 'bg-pink-500/20 text-pink-500' },
  plin: { label: 'Plin', icon: '📱', color: 'bg-cyan-500/20 text-cyan-500' },
}

export const ESTADO_PAGO_CONFIG: Record<EstadoPago, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'text-warning' },
  partial: { label: 'Adelanto', color: 'text-info' },
  completed: { label: 'Completado', color: 'text-success' },
  refunded: { label: 'Reembolsado', color: 'text-destructive' },
}

export const RANGO_HORARIO_CONFIG: Record<
  RangoHorario,
  { label: string; horaInicio: string; horaFin: string }
> = {
  madrugada: { label: 'Madrugada', horaInicio: '06:00', horaFin: '08:00' },
  mañana: { label: 'Mañana', horaInicio: '08:00', horaFin: '12:00' },
  tarde: { label: 'Tarde', horaInicio: '12:00', horaFin: '18:00' },
  noche: { label: 'Noche', horaInicio: '18:00', horaFin: '23:00' },
}

export const PERIODO_CONFIG: Record<PeriodoAnalisis, { label: string; dias?: number }> = {
  hoy: { label: 'Hoy' },
  semana: { label: 'Esta semana', dias: 7 },
  mes: { label: 'Este mes', dias: 30 },
  trimestre: { label: 'Este trimestre', dias: 90 },
  anio: { label: 'Este año', dias: 365 },
  custom: { label: 'Personalizado' },
}

export const CATEGORIA_EXTRA_CONFIG: Record<
  'bebida' | 'snack' | 'deportivo' | 'alquiler' | 'servicio',
  { label: string; icon: string; color: string }
> = {
  bebida: { label: 'Bebidas', icon: '🍺', color: 'bg-blue-500/20 text-blue-500' },
  snack: { label: 'Snacks', icon: '🍿', color: 'bg-amber-500/20 text-amber-500' },
  deportivo: { label: 'Deportivo', icon: '⚽', color: 'bg-green-500/20 text-green-500' },
  alquiler: { label: 'Alquiler', icon: '📋', color: 'bg-purple-500/20 text-purple-500' },
  servicio: { label: 'Servicios', icon: '🛠️', color: 'bg-cyan-500/20 text-cyan-500' },
}
