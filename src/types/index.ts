// ===========================================
// CORE DOMAIN TYPES - PICHANGA DASHBOARD
// ===========================================

// ===========================================
// USER & AUTHENTICATION
// ===========================================

export type UserRole = 'user' | 'owner' | 'admin'

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

export interface User {
  id: string
  email: string
  fullName: string
  phone: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// ===========================================
// VENUE (CANCHAS)
// ===========================================

export type VenueStatus = 'activa' | 'inactiva' | 'en_revision'

export type DeporteTipo = 'f5' | 'f7' | 'fulbito'

export type SuperficieTipo = 'grass_sintetico' | 'grass_natural' | 'losa' | 'concreto'

export interface VenueService {
  id: string
  name: string
  icon?: string
}

export interface VenueSchedule {
  id: string
  venueId: string
  dayOfWeek: number // 0-6 (domingo-sábado)
  openTime: string // "06:00"
  closeTime: string // "22:00"
  isClosed: boolean
}

export interface Venue {
  id: string
  ownerId: string
  nombre: string
  direccion: string
  latitud: number
  longitud: number
  ciudad: string
  distrito: string
  tipoDeporte: DeporteTipo
  superficie: SuperficieTipo
  capacidad: number
  servicios: VenueService[]
  fotos: string[]
  descripcion?: string
  precioHoraBase: number
  precioHoraNoche: number
  horaInicioDiurno: string
  horaInicioNoche: string
  horaCierre: string
  diasDescanso: number[]
  estado: VenueStatus
  rating: number
  totalReviews: number
  createdAt: string
  updatedAt: string
}

// ===========================================
// TIME SLOTS (HORARIOS FLEXIBLES)
// ===========================================

export interface TimeSlot {
  id: string
  venueId: string
  dayOfWeek: number
  startTime: string // "14:00"
  endTime: string // "15:00"
  slotDuration: number // in minutes, default 60
  price: number
  isPremium: boolean
  isActive: boolean
}

export interface SlotTemplate {
  id: string
  venueId: string
  nombre: string
  descripcion?: string
  configHorarios: Record<string, unknown>
  configPrecios: Record<string, unknown>
  isActive: boolean
  createdAt: string
}

// ===========================================
// VENUE POLICIES
// ===========================================

export type PoliticaExceso = 'perder_reserva' | 'penalidad' | 'tiempo_restante' | 'configurable'

export interface VenuePolicy {
  id: string
  venueId: string
  toleranciaMinutos: number
  politicaExceso: PoliticaExceso
  adelantoMinimo: number
  penalidadMonto?: number
  cancelacionHoras: number
  reembolsoPorcentaje: number
  createdAt: string
}

// ===========================================
// RESERVATIONS
// ===========================================

export type ReservationStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'cancelled_with_refund'

export type ReservationSource = 'manual' | 'app'

export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'refunded' | 'partial_refund'

export interface Reservation {
  id: string
  venueId: string
  userId?: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: ReservationStatus
  source: ReservationSource
  // Manual reservation fields
  clienteNombre?: string
  clienteTelefono?: string
  clienteEmail?: string
  // Payment fields
  adelantoPagado?: number
  saldoPendiente?: number
  estadoPago: PaymentStatus
  promotionId?: string
  observaciones?: string
  createdAt: string
  updatedAt: string
  // Relations
  venue?: Venue
  user?: User
}

// ===========================================
// PAYMENTS
// ===========================================

export type PaymentType = 'adelanto' | 'saldo' | 'completo'

export type PaymentMethod = 'culqi' | 'efectivo' | 'tarjeta_local' | 'yape' | 'plin'

export interface Payment {
  id: string
  reservationId: string
  tipoPago: PaymentType
  monto: number
  metodoPago: PaymentMethod
  culqiId?: string
  registradoPor?: string
  createdAt: string
}

// ===========================================
// PROMOTIONS
// ===========================================

export type PromotionType =
  | 'descuento_porcentual'
  | 'precio_fijo'
  | 'combo_horas'
  | 'combo_productos'
  | 'recurrencia'

export interface Promotion {
  id: string
  venueId: string
  nombre: string
  tipo: PromotionType
  valor: number
  diasAplicables: string[]
  horarios: { inicio: string; fin: string }[]
  fechaInicio: string
  fechaFin: string
  cuposMaximos: number
  cuposPorUsuario: number
  activa: boolean
  canchasAplicables: string[]
  createdAt: string
}

export interface PromotionUsage {
  id: string
  promotionId: string
  reservationId: string
  userId?: string
  descuentoAplicado: number
  createdAt: string
}

// ===========================================
// INVENTORY & SALES
// ===========================================

export type ProductCategory = 'bebida' | 'snack' | 'deportivo' | 'alquiler' | 'servicio'

export type SalePaymentMethod = 'efectivo' | 'tarjeta' | 'yape' | 'plin'

export interface InventoryItem {
  id: string
  venueId: string
  nombre: string
  categoria: ProductCategory
  precio: number
  costo?: number
  controlStock: boolean
  stockActual?: number
  stockMinimo?: number
  activo: boolean
  imagenUrl?: string
  createdAt: string
}

export interface Sale {
  id: string
  venueId: string
  reservationId?: string
  clienteNombre?: string
  clienteTelefono?: string
  productos: SaleProduct[]
  total: number
  metodoPago: SalePaymentMethod
  fecha: string
  vendedorId: string
  createdAt: string
}

export interface SaleProduct {
  itemId: string
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

// ===========================================
// VENUE BLOCKINGS
// ===========================================

export interface VenueBlocking {
  id: string
  venueId: string
  date: string
  startTime: string
  endTime: string
  reason: string
  isRecurring: boolean
  status: 'active' | 'cancelled'
  createdAt: string
}

// ===========================================
// REVIEWS
// ===========================================

export interface Review {
  id: string
  venueId: string
  userId: string
  rating: number
  comment?: string
  fotos?: string[]
  ownerResponse?: string
  ownerResponseAt?: string
  createdAt: string
  user?: User
}

// ===========================================
// FAVORITES
// ===========================================

export interface Favorite {
  id: string
  userId: string
  venueId: string
  createdAt: string
}

// ===========================================
// USER CONNECTIONS
// ===========================================

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected'

export interface UserConnection {
  id: string
  fromUserId: string
  toUserId: string
  status: ConnectionStatus
  createdAt: string
}

// ===========================================
// DASHBOARD METRICS
// ===========================================

export interface DashboardMetrics {
  hoy: {
    reservas: number
    ingresos: number
    ocupacion: number
  }
  semana: {
    reservas: number
    ingresos: number
    comparativaSemanaAnterior: number
  }
  mes: {
    reservas: number
    ingresos: number
    comparativaMesAnterior: number
  }
  proximasReservas: Reservation[]
  alertas: DashboardAlert[]
}

export interface DashboardAlert {
  id: string
  type: 'warning' | 'error' | 'info'
  title: string
  message: string
  action?: string
  createdAt: string
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}