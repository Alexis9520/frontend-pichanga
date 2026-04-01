// ===========================================
// TIPOS ESPECÍFICOS PARA DASHBOARD
// ===========================================

// Estado de reserva
export type EstadoReservaDashboard = 'confirmed' | 'partial' | 'pending'

// Tipo de alerta
export type TipoAlerta = 'stock' | 'promocion' | 'saldo' | 'reserva' | 'pago'

// Prioridad de alerta
export type PrioridadAlerta = 'alta' | 'media' | 'baja'

// ===========================================
// MÉTRICAS DEL DÍA
// ===========================================
export interface MetricasDia {
  // Reservas
  reservasHoy: number
  reservasPendientesConfirmar: number
  reservasConfirmadas: number
  reservasConAdelanto: number
  // Ingresos
  ingresosHoy: number
  ingresosAyer: number
  ingresosComparativa: number // %
  // Ocupación
  ocupacionActual: number // %
  ocupacionAyer: number
  // Extras
  ventasExtrasHoy: number
  cantidadVentasExtras: number
  // Pendientes
  adelantosPendientes: number
  montoPendienteCobrar: number
}

// ===========================================
// RESUMEN SEMANAL
// ===========================================
export interface IngresoPorDia {
  dia: string // 'Lun', 'Mar', etc.
  fecha: string
  reservas: number
  ingresos: number
}

export interface TopHorario {
  hora: string
  reservas: number
  ingresos: number
}

export interface ResumenSemanal {
  reservasSemana: number
  ingresosSemana: number
  comparativaSemanaAnterior: number // %
  porDia: IngresoPorDia[]
  topHorarios: TopHorario[]
}

// ===========================================
// RESUMEN DEL MES
// ===========================================
export interface ResumenMes {
  totalIngresos: number
  comparativaMesAnterior: number // %
  ingresosReservas: number
  ingresosExtras: number
  porcentajeReservas: number
  porcentajeExtras: number
  tendencia: { mes: string; total: number }[]
}

// ===========================================
// PRÓXIMA RESERVA
// ===========================================
export interface ProximaReserva {
  id: string
  hora: string
  horaFin: string
  clienteNombre: string
  clienteTelefono?: string
  canchaNombre: string
  canchaId: string
  estado: EstadoReservaDashboard
  monto: number
  adelanto: number
  saldoPendiente: number
  origen: 'manual' | 'app'
}

// ===========================================
// ALERTA
// ===========================================
export interface Alerta {
  id: string
  tipo: TipoAlerta
  titulo: string
  descripcion: string
  prioridad: PrioridadAlerta
  accion?: string
  link?: string
  datos?: Record<string, any>
}

// ===========================================
// STOCK BAJO
// ===========================================
export interface ProductoStockBajo {
  id: string
  nombre: string
  categoria: string
  stockActual: number
  stockMinimo: number
}

// ===========================================
// PROMOCIÓN ACTIVA
// ===========================================
export interface PromocionActiva {
  id: string
  nombre: string
  tipo: string
  diasRestantes: number
  usosHoy: number
}

// ===========================================
// ACCIÓN RÁPIDA
// ===========================================
export interface AccionRapida {
  id: string
  label: string
  icon: string
  href?: string
  onClick?: () => void
  variant: 'default' | 'outline' | 'ghost'
}

// ===========================================
// RESPUESTA DEL HOOK
// ===========================================
export interface UseDashboardReturn {
  // Métricas
  metricasDia: MetricasDia
  resumenSemanal: ResumenSemanal
  resumenMes: ResumenMes

  // Datos
  proximasReservas: ProximaReserva[]
  alertas: Alerta[]
  productosStockBajo: ProductoStockBajo[]
  promocionesActivas: PromocionActiva[]

  // Estado
  loading: boolean
  fechaActual: string
  saludo: string

  // Helpers
  refrescar: () => Promise<void>
}

// ===========================================
// CONSTANTES
// ===========================================
export const ESTADO_RESERVA_CONFIG: Record<
  EstadoReservaDashboard,
  { label: string; color: string; bg: string }
> = {
  confirmed: {
    label: 'Confirmada',
    color: 'text-success',
    bg: 'bg-success',
  },
  partial: {
    label: 'Adelanto',
    color: 'text-warning',
    bg: 'bg-warning',
  },
  pending: {
    label: 'Pendiente',
    color: 'text-muted-foreground',
    bg: 'bg-muted-foreground',
  },
}

export const TIPO_ALERTA_CONFIG: Record<
  TipoAlerta,
  { label: string; icon: string; color: string }
> = {
  stock: {
    label: 'Stock',
    icon: '📦',
    color: 'text-destructive',
  },
  promocion: {
    label: 'Promoción',
    icon: '🎉',
    color: 'text-warning',
  },
  saldo: {
    label: 'Saldo',
    icon: '💰',
    color: 'text-warning',
  },
  reserva: {
    label: 'Reserva',
    icon: '📅',
    color: 'text-info',
  },
  pago: {
    label: 'Pago',
    icon: '💳',
    color: 'text-success',
  },
}

export const PRIORIDAD_CONFIG: Record<PrioridadAlerta, { color: string; bg: string }> = {
  alta: {
    color: 'text-destructive',
    bg: 'bg-destructive',
  },
  media: {
    color: 'text-warning',
    bg: 'bg-warning',
  },
  baja: {
    color: 'text-info',
    bg: 'bg-info',
  },
}
