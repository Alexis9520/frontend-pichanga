// ===========================================
// TIPOS ESPECÍFICOS PARA CANCHAS
// ===========================================

// Tipo de deporte
export type TipoDeporte = 'f5' | 'f7' | 'fulbito'

// Tipo de superficie
export type TipoSuperficie = 'grass_sintetico' | 'grass_natural' | 'losa' | 'concreto'

// Estado de la cancha
export type EstadoCancha = 'activa' | 'inactiva' | 'en_revision'

// Política de exceso de tolerancia
export type PoliticaExceso = 'perder_reserva' | 'penalidad' | 'tiempo_restante' | 'configurable'

// Servicios disponibles
export type ServicioCancha =
  | 'estacionamiento'
  | 'banos'
  | 'duchas'
  | 'iluminacion'
  | 'quincho'
  | 'tribuna'
  | 'camerinos'
  | 'wifi'
  | 'cantina'

// ===========================================
// CANCHA COMPLETA
// ===========================================
export interface Cancha {
  id: string
  // Datos básicos
  nombre: string
  direccion: string
  ciudad: string
  distrito: string
  descripcion?: string
  // Configuración deportiva
  tipoDeporte: TipoDeporte
  superficie: TipoSuperficie
  capacidad: number // Jugadores por equipo
  servicios: ServicioCancha[]
  fotos: string[]
  // Estado
  estado: EstadoCancha
  // Precios base
  precioHoraBase: number
  precioHoraNoche: number
  horaInicioDiurno: string
  horaInicioNoche: string
  horaCierre: string
  diasDescanso: number[] // 0-6 (domingo-sábado)
  // Políticas
  toleranciaMinutos: number
  politicaExceso: PoliticaExceso
  penalidadMonto?: number
  adelantoMinimo: number
  cancelacionHoras: number
  reembolsoPorcentaje: number
  // Estadísticas (calculadas)
  totalReservas?: number
  ingresosMes?: number
  ocupacionPromedio?: number
  // Auditoría
  createdAt: string
  updatedAt: string
}

// ===========================================
// HORARIO POR DÍA
// ===========================================
export interface HorarioDia {
  id: string
  canchaId: string
  diaSemana: number // 0-6 (domingo-sábado)
  horaApertura: string
  horaCierre: string
  activo: boolean
}

// ===========================================
// PRECIO POR SLOT
// ===========================================
export interface PrecioSlot {
  id: string
  canchaId: string
  diaSemana: number
  horaInicio: string
  precio: number
  esPremium: boolean
}

// ===========================================
// PLANTILLA DE HORARIOS
// ===========================================
export interface PlantillaHorario {
  id: string
  nombre: string
  descripcion?: string
  precios: {
    horaInicio: string
    precio: number
    esPremium: boolean
  }[]
}

// ===========================================
// BLOQUEO DE HORARIO
// ===========================================
export interface BloqueoHorario {
  id: string
  canchaId: string
  canchaNombre: string
  fecha: string
  horaInicio: string
  horaFin: string
  motivo: string
  esRecurrente: boolean
  diasRecurrencia?: number[] // Días de la semana si es recurrente
  createdAt: string
}

// ===========================================
// FORMULARIO DE CANCHA
// ===========================================
export interface CanchaFormData {
  // Datos básicos
  nombre: string
  direccion: string
  ciudad: string
  distrito: string
  descripcion?: string
  // Configuración deportiva
  tipoDeporte: TipoDeporte
  superficie: TipoSuperficie
  capacidad: number
  servicios: ServicioCancha[]
  // Precios base
  precioHoraBase: number
  precioHoraNoche: number
  horaInicioDiurno: string
  horaInicioNoche: string
  horaCierre: string
  diasDescanso: number[]
  // Políticas
  toleranciaMinutos: number
  politicaExceso: PoliticaExceso
  penalidadMonto?: number
  adelantoMinimo: number
  cancelacionHoras: number
  reembolsoPorcentaje: number
}

// ===========================================
// ESTADÍSTICAS DE CANCHAS
// ===========================================
export interface CanchasStats {
  total: number
  activas: number
  inactivas: number
  reservasHoy: number
  ingresosMes: number
  ocupacionPromedio: number
}

// ===========================================
// FILTROS DE CANCHAS
// ===========================================
export interface CanchasFilters {
  search: string
  estado: EstadoCancha | 'all'
  tipoDeporte: TipoDeporte | 'all'
  superficie: TipoSuperficie | 'all'
}

// ===========================================
// RESPUESTA DEL HOOK
// ===========================================
export interface UseCanchasReturn {
  // Estado
  canchas: Cancha[]
  filters: CanchasFilters
  loading: boolean
  stats: CanchasStats

  // Acciones CRUD
  crearCancha: (data: CanchaFormData) => Promise<Cancha>
  actualizarCancha: (id: string, data: Partial<CanchaFormData>) => Promise<Cancha>
  eliminarCancha: (id: string) => Promise<void>
  toggleEstado: (id: string) => Promise<void>

  // Horarios
  horarios: HorarioDia[]
  actualizarHorario: (canchaId: string, horarios: HorarioDia[]) => Promise<void>

  // Precios por slot
  preciosSlots: PrecioSlot[]
  actualizarPreciosSlots: (canchaId: string, precios: PrecioSlot[]) => Promise<void>

  // Bloqueos
  bloqueos: BloqueoHorario[]
  crearBloqueo: (bloqueo: Omit<BloqueoHorario, 'id' | 'createdAt'>) => Promise<void>
  eliminarBloqueo: (id: string) => Promise<void>

  // Plantillas
  plantillas: PlantillaHorario[]
  crearPlantilla: (plantilla: Omit<PlantillaHorario, 'id'>) => Promise<void>

  // Helpers
  getCanchaById: (id: string) => Cancha | undefined
  setFilters: (filters: Partial<CanchasFilters>) => void
}

// ===========================================
// CONFIGURACIÓN DE HORARIOS
// ===========================================
export const DIAS_SEMANA = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
]

export const HORARIOS_DISPONIBLES = [
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

export const SERVICIOS_LABELS: Record<ServicioCancha, string> = {
  estacionamiento: 'Estacionamiento',
  banos: 'Baños',
  duchas: 'Duchas',
  iluminacion: 'Iluminación',
  quincho: 'Quincho',
  tribuna: 'Tribuna',
  camerinos: 'Camerinos',
  wifi: 'WiFi',
  cantina: 'Cantina',
}

export const TIPO_DEPORTE_LABELS: Record<TipoDeporte, string> = {
  f5: 'Fútbol 5',
  f7: 'Fútbol 7',
  fulbito: 'Fulbito',
}

export const SUPERFICIE_LABELS: Record<TipoSuperficie, string> = {
  grass_sintetico: 'Grass Sintético',
  grass_natural: 'Grass Natural',
  losa: 'Losa',
  concreto: 'Concreto',
}

export const POLITICA_EXCESO_LABELS: Record<PoliticaExceso, string> = {
  perder_reserva: 'Pierde la reserva',
  penalidad: 'Cobra penalidad',
  tiempo_restante: 'Solo tiempo restante',
  configurable: 'Personalizado',
}
