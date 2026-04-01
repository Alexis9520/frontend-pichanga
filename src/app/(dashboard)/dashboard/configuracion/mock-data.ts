// ===========================================
// MOCK DATA PARA CONFIGURACIÓN
// ===========================================

import type {
  UsuarioConfig,
  NegocioConfig,
  PagosConfig,
  PoliticasConfig,
  NotificacionesConfig,
  UsuarioSistema,
  SesionActiva,
} from './types'

// ===========================================
// CONFIGURACIÓN DE USUARIO
// ===========================================
export const mockUsuarioConfig: UsuarioConfig = {
  nombre: 'Pedro Ramos',
  email: 'pedro@loscampeones.pe',
  telefono: '999888777',
  avatarUrl: undefined,
  idioma: 'es',
  tema: 'dark',
}

// ===========================================
// CONFIGURACIÓN DEL NEGOCIO
// ===========================================
export const mockNegocioConfig: NegocioConfig = {
  nombre: 'Complejo Los Campeones',
  ruc: '20123456789',
  direccion: 'Av. Los Deportes 123',
  ciudad: 'Huancayo',
  distrito: 'Huancayo',
  telefono: '064-234567',
  email: 'contacto@loscampeones.pe',
  whatsapp: '999888777',
  logoUrl: undefined,
  redesSociales: {
    facebook: 'https://facebook.com/loscampeones',
    instagram: 'https://instagram.com/loscampeones',
    twitter: undefined,
  },
  descripcion: 'Complejo de canchas de fútbol con 3 canchas profesionales',
  horarioAtencion: 'Lunes a Domingo: 6:00 AM - 11:00 PM',
}

// ===========================================
// CONFIGURACIÓN DE PAGOS
// ===========================================
export const mockPagosConfig: PagosConfig = {
  // Culqi
  culqiPublicKey: 'pk_test_xxxxxxxxxxxxx',
  culqiConfigured: true,
  // Facturación
  razonSocial: 'Los Campeones S.A.C.',
  rucFacturacion: '20123456789',
  direccionFiscal: 'Av. Los Deportes 123, Huancayo, Junín',
  // Métodos de pago
  metodosAceptados: {
    culqi: true,
    efectivo: true,
    tarjetaLocal: true,
    yape: true,
    plin: true,
  },
  // Adelantos
  adelantoMinimoGlobal: 30,
  adelantoPorCancha: [
    { canchaId: 'c1', canchaNombre: 'Cancha 1 - F5', monto: 30 },
    { canchaId: 'c2', canchaNombre: 'Cancha 2 - F5', monto: 30 },
    { canchaId: 'c3', canchaNombre: 'Cancha 3 - F7', monto: 50 },
  ],
  adelantoPorHorario: [
    { dia: 'sabado', horaInicio: '18:00', horaFin: '23:00', monto: 60 },
    { dia: 'domingo', horaInicio: '18:00', horaFin: '23:00', monto: 60 },
  ],
}

// ===========================================
// POLÍTICAS DE RESERVA
// ===========================================
export const mockPoliticasConfig: PoliticasConfig = {
  toleranciaMinutos: 15,
  politicaExceso: 'tiempo_restante',
  penalidadMonto: undefined,
  penalidadPorcentaje: undefined,
  cancelacionHoras: 3,
  reembolsoPorcentaje: 75,
  textoPoliticaPersonalizada: undefined,
}

// ===========================================
// NOTIFICACIONES
// ===========================================
export const mockNotificacionesConfig: NotificacionesConfig = {
  push: {
    nuevaReserva: true,
    cancelacion: true,
    recordatorioSaldo: true,
    stockBajo: true,
    promocionPorVencer: true,
    nuevaVenta: true,
    pagoSaldo: true,
  },
  email: {
    resumenDiario: false,
    resumenSemanal: true,
    alertas: true,
  },
}

// ===========================================
// USUARIOS DEL SISTEMA
// ===========================================
export const mockUsuarios: UsuarioSistema[] = [
  {
    id: 'u1',
    nombre: 'Pedro Ramos',
    email: 'pedro@loscampeones.pe',
    rol: 'owner',
    telefono: '999888777',
    activo: true,
    ultimoAcceso: new Date().toISOString(),
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'u2',
    nombre: 'María López',
    email: 'maria@loscampeones.pe',
    rol: 'admin',
    telefono: '998123456',
    activo: true,
    ultimoAcceso: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'u3',
    nombre: 'Carlos García',
    email: 'carlos@loscampeones.pe',
    rol: 'staff',
    telefono: '997654321',
    activo: true,
    ultimoAcceso: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-03-10T09:00:00Z',
  },
  {
    id: 'u4',
    nombre: 'Ana Torres',
    email: 'ana@loscampeones.pe',
    rol: 'staff',
    telefono: '996543210',
    activo: false,
    ultimoAcceso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-03-15T11:00:00Z',
  },
]

// ===========================================
// SESIONES ACTIVAS
// ===========================================
export const mockSesiones: SesionActiva[] = [
  {
    id: 's1',
    dispositivo: 'Windows PC',
    navegador: 'Chrome 122.0',
    ubicacion: 'Huancayo, Perú',
    fechaInicio: new Date().toISOString(),
    esActual: true,
  },
  {
    id: 's2',
    dispositivo: 'iPhone 14',
    navegador: 'Safari 17.0',
    ubicacion: 'Huancayo, Perú',
    fechaInicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    esActual: false,
  },
  {
    id: 's3',
    dispositivo: 'Android Phone',
    navegador: 'Chrome Mobile',
    ubicacion: 'Lima, Perú',
    fechaInicio: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    esActual: false,
  },
]

// ===========================================
// CANCHAS (para referencia en adelantos)
// ===========================================
export const mockCanchas = [
  { id: 'c1', nombre: 'Cancha 1 - F5' },
  { id: 'c2', nombre: 'Cancha 2 - F5' },
  { id: 'c3', nombre: 'Cancha 3 - F7' },
]
