// ===========================================
// TIPOS ESPECÍFICOS PARA PROMOCIONES
// ===========================================

// Tipo de promoción
export type TipoPromocion =
  | 'descuento_porcentual'
  | 'precio_fijo'
  | 'combo_horas'
  | 'combo_productos'
  | 'recurrencia'

// Estado de la promoción
export type EstadoPromocion = 'activa' | 'inactiva' | 'agotada' | 'vencida'

// ===========================================
// PROMOCIÓN COMPLETA
// ===========================================
export interface Promocion {
  id: string
  nombre: string
  descripcion?: string
  tipo: TipoPromocion
  valor: number
  // Para combo_horas
  horasBase?: number // Ej: 2 horas reservadas
  horasCobradas?: number // Ej: 1.5 horas cobradas
  // Para combo_productos
  productosIncluidos?: ProductoIncluido[]
  // Para recurrencia
  numeroReserva?: number // Ej: 3ra reserva
  // Aplicabilidad
  canchasAplicables: string[]
  diasAplicables: number[] // 0-6 (domingo-sábado)
  horarios: RangoHorario[]
  // Vigencia
  fechaInicio: string
  fechaFin: string
  // Restricciones
  cuposMaximos: number // Por día
  cuposPorUsuario: number
  anticipacionMinima: number // Días
  combinable: boolean
  // Estado calculado
  estado: EstadoPromocion
  activa: boolean
  // Stats
  usosTotales: number
  usosSemana: number
  cuposUsadosHoy: number
  ahorroGenerado: number
  ingresosGenerados: number
  // Auditoría
  createdAt: string
  updatedAt: string
}

// ===========================================
// RANGO HORARIO
// ===========================================
export interface RangoHorario {
  inicio: string // "06:00"
  fin: string // "12:00"
}

// ===========================================
// PRODUCTO INCLUIDO EN COMBO
// ===========================================
export interface ProductoIncluido {
  productoId: string
  productoNombre: string
  cantidad: number
}

// ===========================================
// USO DE PROMOCIÓN
// ===========================================
export interface UsoPromocion {
  id: string
  promocionId: string
  promocionNombre: string
  reservaId: string
  clienteNombre: string
  clienteTelefono: string
  canchaNombre: string
  fecha: string
  hora: string
  precioOriginal: number
  descuentoAplicado: number
  precioFinal: number
  createdAt: string
}

// ===========================================
// SUGERENCIA DE BAJA DEMANDA
// ===========================================
export interface SugerenciaBajaDemanda {
  id: string
  canchaId: string
  canchaNombre: string
  diaSemana: number
  diaNombre: string
  horaInicio: string
  horaFin: string
  ocupacionActual: number
  reservasActuales: number
  promocionSugerida: {
    tipo: TipoPromocion
    valor: number
    nombre: string
  }
  descartada: boolean
}

// ===========================================
// FORMULARIO DE PROMOCIÓN
// ===========================================
export interface PromocionFormData {
  nombre: string
  descripcion?: string
  tipo: TipoPromocion
  valor: number
  horasBase?: number
  horasCobradas?: number
  productosIncluidos?: ProductoIncluido[]
  numeroReserva?: number
  canchasAplicables: string[]
  diasAplicables: number[]
  horarios: RangoHorario[]
  fechaInicio: string
  fechaFin: string
  cuposMaximos: number
  cuposPorUsuario: number
  anticipacionMinima: number
  combinable: boolean
}

// ===========================================
// FILTROS DE PROMOCIONES
// ===========================================
export interface PromocionesFilters {
  search: string
  estado: EstadoPromocion | 'all'
  tipo: TipoPromocion | 'all'
  cancha: string // ID de cancha o 'all'
}

// ===========================================
// ESTADÍSTICAS DE PROMOCIONES
// ===========================================
export interface PromocionesStats {
  total: number
  activas: number
  inactivas: number
  usosSemana: number
  usosMes: number
  ahorroClientes: number
  ingresosGenerados: number
}

// ===========================================
// RESPUESTA DEL HOOK
// ===========================================
export interface UsePromocionesReturn {
  // Estado
  promociones: Promocion[]
  filters: PromocionesFilters
  loading: boolean
  stats: PromocionesStats

  // CRUD
  crearPromocion: (data: PromocionFormData) => Promise<Promocion>
  actualizarPromocion: (id: string, data: Partial<PromocionFormData>) => Promise<Promocion>
  eliminarPromocion: (id: string) => Promise<void>
  toggleActiva: (id: string) => Promise<void>
  duplicarPromocion: (id: string) => Promise<Promocion>

  // Usos
  usos: UsoPromocion[]
  getUsosByPromocion: (promocionId: string) => UsoPromocion[]

  // Sugerencias
  sugerencias: SugerenciaBajaDemanda[]
  descartarSugerencia: (id: string) => void
  crearPromocionDesdeSugerencia: (sugerencia: SugerenciaBajaDemanda) => Promise<Promocion>

  // Helpers
  getPromocionById: (id: string) => Promocion | undefined
  setFilters: (filters: Partial<PromocionesFilters>) => void
  calcularDescuento: (promocion: Promocion, precioBase: number) => number
}

// ===========================================
// CONSTANTES
// ===========================================
export const TIPO_PROMOCION_CONFIG: Record<
  TipoPromocion,
  {
    label: string
    descripcion: string
    icon: string
    color: string
  }
> = {
  descuento_porcentual: {
    label: 'Descuento Porcentual',
    descripcion: 'Aplica un % de descuento sobre el precio base',
    icon: '%',
    color: 'bg-primary/20 text-primary',
  },
  precio_fijo: {
    label: 'Precio Fijo',
    descripcion: 'Establece un precio especial fijo',
    icon: 'S/',
    color: 'bg-secondary/20 text-secondary',
  },
  combo_horas: {
    label: 'Combo de Horas',
    descripcion: 'Reserva más horas por menos dinero',
    icon: '⏱️',
    color: 'bg-success/20 text-success',
  },
  combo_productos: {
    label: 'Combo con Productos',
    descripcion: 'Reserva + productos incluidos',
    icon: '📦',
    color: 'bg-info/20 text-info',
  },
  recurrencia: {
    label: 'Descuento por Recurrencia',
    descripcion: 'Premia a clientes frecuentes',
    icon: '🔄',
    color: 'bg-warning/20 text-warning',
  },
}

export const DIAS_SEMANA_PROMO = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
]

export const HORAS_PROMO = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]
