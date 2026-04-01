// ===========================================
// TIPOS ESPECÍFICOS PARA CONFIGURACIÓN
// ===========================================

// Rol de usuario
export type RolUsuario = 'owner' | 'admin' | 'staff'

// Idioma
export type Idioma = 'es' | 'en'

// Tema
export type Tema = 'light' | 'dark' | 'system'

// Política de exceso
export type PoliticaExceso = 'perder_reserva' | 'penalidad' | 'tiempo_restante' | 'configurable'

// ===========================================
// CONFIGURACIÓN DEL NEGOCIO
// ===========================================
export interface NegocioConfig {
  nombre: string
  ruc: string
  direccion: string
  ciudad: string
  distrito: string
  telefono: string
  email: string
  whatsapp: string
  logoUrl?: string
  redesSociales: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  descripcion?: string
  horarioAtencion?: string
}

// ===========================================
// CONFIGURACIÓN DE PAGOS
// ===========================================
export interface MetodosPagoAceptados {
  culqi: boolean
  efectivo: boolean
  tarjetaLocal: boolean
  yape: boolean
  plin: boolean
}

export interface AdelantoPorCancha {
  canchaId: string
  canchaNombre: string
  monto: number
}

export interface AdelantoPorHorario {
  dia: string // 'lunes', 'martes', etc.
  horaInicio: string
  horaFin: string
  monto: number
}

export interface PagosConfig {
  // Culqi
  culqiPublicKey?: string
  culqiConfigured: boolean
  // Facturación
  razonSocial: string
  rucFacturacion: string
  direccionFiscal: string
  // Métodos de pago
  metodosAceptados: MetodosPagoAceptados
  // Adelantos
  adelantoMinimoGlobal: number
  adelantoPorCancha: AdelantoPorCancha[]
  adelantoPorHorario: AdelantoPorHorario[]
}

// ===========================================
// POLÍTICAS DE RESERVA
// ===========================================
export interface PoliticasConfig {
  // Tolerancia
  toleranciaMinutos: number
  politicaExceso: PoliticaExceso
  penalidadMonto?: number
  penalidadPorcentaje?: number
  // Cancelación
  cancelacionHoras: number
  reembolsoPorcentaje: number
  // Política personalizada
  textoPoliticaPersonalizada?: string
}

// ===========================================
// NOTIFICACIONES
// ===========================================
export interface NotificacionesPushConfig {
  nuevaReserva: boolean
  cancelacion: boolean
  recordatorioSaldo: boolean
  stockBajo: boolean
  promocionPorVencer: boolean
  nuevaVenta: boolean
  pagoSaldo: boolean
}

export interface NotificacionesEmailConfig {
  resumenDiario: boolean
  resumenSemanal: boolean
  alertas: boolean
}

export interface NotificacionesConfig {
  push: NotificacionesPushConfig
  email: NotificacionesEmailConfig
}

// ===========================================
// USUARIO DEL SISTEMA
// ===========================================
export interface UsuarioSistema {
  id: string
  nombre: string
  email: string
  rol: RolUsuario
  telefono?: string
  activo: boolean
  ultimoAcceso: string
  createdAt: string
}

// ===========================================
// CONFIGURACIÓN DE USUARIO
// ===========================================
export interface UsuarioConfig {
  nombre: string
  email: string
  telefono: string
  avatarUrl?: string
  idioma: Idioma
  tema: Tema
}

// ===========================================
// SESIÓN ACTIVA
// ===========================================
export interface SesionActiva {
  id: string
  dispositivo: string
  navegador: string
  ubicacion: string
  fechaInicio: string
  esActual: boolean
}

// ===========================================
// FILTROS Y ESTADOS
// ===========================================
export type ConfigSection =
  | 'perfil'
  | 'negocio'
  | 'pagos'
  | 'politicas'
  | 'notificaciones'
  | 'usuarios'
  | 'seguridad'
  | 'avanzado'

// ===========================================
// RESPUESTA DEL HOOK
// ===========================================
export interface UseConfiguracionReturn {
  // Configuraciones
  usuarioConfig: UsuarioConfig
  negocioConfig: NegocioConfig
  pagosConfig: PagosConfig
  politicasConfig: PoliticasConfig
  notificacionesConfig: NotificacionesConfig
  usuarios: UsuarioSistema[]
  sesiones: SesionActiva[]

  // Estado
  loading: boolean
  activeSection: ConfigSection
  setActiveSection: (section: ConfigSection) => void
  hasUnsavedChanges: boolean

  // Acciones - Perfil
  updateUsuarioConfig: (data: Partial<UsuarioConfig>) => Promise<void>
  uploadAvatar: (file: File) => Promise<string>

  // Acciones - Negocio
  updateNegocioConfig: (data: Partial<NegocioConfig>) => Promise<void>
  uploadLogo: (file: File) => Promise<string>

  // Acciones - Pagos
  updatePagosConfig: (data: Partial<PagosConfig>) => Promise<void>
  connectCulqi: (publicKey: string, secretKey: string) => Promise<void>
  disconnectCulqi: () => Promise<void>

  // Acciones - Políticas
  updatePoliticasConfig: (data: Partial<PoliticasConfig>) => Promise<void>

  // Acciones - Notificaciones
  updateNotificacionesConfig: (data: Partial<NotificacionesConfig>) => Promise<void>

  // Acciones - Usuarios
  invitarUsuario: (email: string, rol: RolUsuario) => Promise<void>
  actualizarRolUsuario: (id: string, rol: RolUsuario) => Promise<void>
  toggleUsuarioActivo: (id: string) => Promise<void>
  eliminarUsuario: (id: string) => Promise<void>

  // Acciones - Seguridad
  cambiarPassword: (actual: string, nueva: string) => Promise<void>
  cerrarSesion: (id: string) => Promise<void>
  cerrarTodasSesiones: () => Promise<void>

  // Acciones - Avanzado
  exportarConfiguracion: () => Promise<void>
  eliminarCuenta: () => Promise<void>
}

// ===========================================
// CONSTANTES
// ===========================================
export const SECTIONS_CONFIG: Record<
  ConfigSection,
  { label: string; icon: string; description: string }
> = {
  perfil: {
    label: 'Mi perfil',
    icon: '👤',
    description: 'Información personal de tu cuenta',
  },
  negocio: {
    label: 'Datos del negocio',
    icon: '🏢',
    description: 'Información de tu complejo de canchas',
  },
  pagos: {
    label: 'Pagos y facturación',
    icon: '💳',
    description: 'Configuración de Culqi y comprobantes',
  },
  politicas: {
    label: 'Políticas de reserva',
    icon: '📋',
    description: 'Tolerancia, cancelación y reembolsos',
  },
  notificaciones: {
    label: 'Notificaciones',
    icon: '🔔',
    description: 'Preferencias de alertas',
  },
  usuarios: {
    label: 'Usuarios y roles',
    icon: '👥',
    description: 'Gestiona el equipo de trabajo',
  },
  seguridad: {
    label: 'Seguridad',
    icon: '🔐',
    description: 'Contraseña y sesiones',
  },
  avanzado: {
    label: 'Avanzado',
    icon: '⚙️',
    description: 'Exportar y eliminar cuenta',
  },
}

export const POLITICA_EXCESO_CONFIG: Record<
  PoliticaExceso,
  { label: string; description: string }
> = {
  perder_reserva: {
    label: 'Pierde la reserva',
    description: 'Si excede la tolerancia, pierde el horario sin reembolso',
  },
  penalidad: {
    label: 'Aplicar penalidad',
    description: 'Se cobra una penalidad pero puede jugar el tiempo restante',
  },
  tiempo_restante: {
    label: 'Solo tiempo restante',
    description: 'Solo puede jugar el tiempo que quede de la reserva',
  },
  configurable: {
    label: 'Política personalizada',
    description: 'Define tu propia política en el campo de texto',
  },
}

export const ROL_CONFIG: Record<RolUsuario, { label: string; description: string; color: string }> =
  {
    owner: {
      label: 'Propietario',
      description: 'Acceso total al sistema',
      color: 'bg-primary/20 text-primary',
    },
    admin: {
      label: 'Administrador',
      description: 'Gestión de reservas, canchas e inventario',
      color: 'bg-secondary/20 text-secondary',
    },
    staff: {
      label: 'Personal',
      description: 'Solo visualización y ventas',
      color: 'bg-muted text-muted-foreground',
    },
  }

export const DIAS_SEMANA = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
]

export const TOLERANCIA_OPTIONS = [
  { value: 0, label: 'Sin tolerancia' },
  { value: 5, label: '5 minutos' },
  { value: 10, label: '10 minutos' },
  { value: 15, label: '15 minutos' },
  { value: 20, label: '20 minutos' },
  { value: 30, label: '30 minutos' },
]

export const CANCELACION_OPTIONS = [
  { value: 1, label: '1 hora antes' },
  { value: 3, label: '3 horas antes' },
  { value: 6, label: '6 horas antes' },
  { value: 12, label: '12 horas antes' },
  { value: 24, label: '24 horas antes' },
]

export const REEMBOLSO_OPTIONS = [
  { value: 100, label: '100% - Reembolso total' },
  { value: 75, label: '75% - Reembolso parcial' },
  { value: 50, label: '50% - Mitad del monto' },
  { value: 25, label: '25% - Reembolso mínimo' },
  { value: 0, label: '0% - Sin reembolso' },
]
