// ===========================================
// MOCK DATA PARA DASHBOARD
// ===========================================

import type {
  MetricasDia,
  ResumenSemanal,
  ResumenMes,
  ProximaReserva,
  Alerta,
  ProductoStockBajo,
  PromocionActiva,
  IngresoPorDia,
  TopHorario,
} from './types'

// Helper para fechas
const hoy = new Date()
const formatFecha = (d: Date) => d.toISOString().split('T')[0]
const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000)

// ===========================================
// MÉTRICAS DEL DÍA
// ===========================================
export const mockMetricasDia: MetricasDia = {
  reservasHoy: 8,
  reservasPendientesConfirmar: 2,
  reservasConfirmadas: 4,
  reservasConAdelanto: 2,
  ingresosHoy: 580,
  ingresosAyer: 540,
  ingresosComparativa: 7.4,
  ocupacionActual: 72,
  ocupacionAyer: 68,
  ventasExtrasHoy: 145,
  cantidadVentasExtras: 12,
  adelantosPendientes: 5,
  montoPendienteCobrar: 340,
}

// ===========================================
// RESUMEN SEMANAL
// ===========================================
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const hoyIndex = hoy.getDay()

export const mockPorDia: IngresoPorDia[] = Array.from({ length: 7 }, (_, i) => {
  const fecha = addDays(hoy, i - hoyIndex)
  return {
    dia: diasSemana[fecha.getDay()],
    fecha: formatFecha(fecha),
    reservas: i === hoyIndex ? 8 : Math.floor(Math.random() * 10) + 3,
    ingresos: i === hoyIndex ? 580 : Math.floor(Math.random() * 500) + 300,
  }
})

export const mockTopHorarios: TopHorario[] = [
  { hora: '18:00', reservas: 12, ingresos: 1200 },
  { hora: '19:00', reservas: 10, ingresos: 1000 },
  { hora: '17:00', reservas: 8, ingresos: 720 },
  { hora: '20:00', reservas: 7, ingresos: 770 },
  { hora: '16:00', reservas: 6, ingresos: 480 },
]

export const mockResumenSemanal: ResumenSemanal = {
  reservasSemana: 45,
  ingresosSemana: 4250,
  comparativaSemanaAnterior: 12,
  porDia: mockPorDia,
  topHorarios: mockTopHorarios,
}

// ===========================================
// RESUMEN DEL MES
// ===========================================
export const mockResumenMes: ResumenMes = {
  totalIngresos: 13450,
  comparativaMesAnterior: 8,
  ingresosReservas: 11200,
  ingresosExtras: 2250,
  porcentajeReservas: 83,
  porcentajeExtras: 17,
  tendencia: [
    { mes: 'Oct', total: 9800 },
    { mes: 'Nov', total: 10500 },
    { mes: 'Dic', total: 12100 },
    { mes: 'Ene', total: 11200 },
    { mes: 'Feb', total: 12450 },
    { mes: 'Mar', total: 13450 },
  ],
}

// ===========================================
// PRÓXIMAS RESERVAS
// ===========================================
export const mockProximasReservas: ProximaReserva[] = [
  {
    id: 'r1',
    hora: '14:00',
    horaFin: '16:00',
    clienteNombre: 'Carlos Mendoza',
    clienteTelefono: '999888777',
    canchaNombre: 'Cancha 1 - F5',
    canchaId: 'c1',
    estado: 'confirmed',
    monto: 200,
    adelanto: 200,
    saldoPendiente: 0,
    origen: 'manual',
  },
  {
    id: 'r2',
    hora: '15:30',
    horaFin: '16:30',
    clienteNombre: 'Miguel Torres',
    clienteTelefono: '998123456',
    canchaNombre: 'Cancha 2 - F5',
    canchaId: 'c2',
    estado: 'partial',
    monto: 100,
    adelanto: 30,
    saldoPendiente: 70,
    origen: 'app',
  },
  {
    id: 'r3',
    hora: '16:00',
    horaFin: '18:00',
    clienteNombre: 'Ana García',
    clienteTelefono: '997654321',
    canchaNombre: 'Cancha 1 - F5',
    canchaId: 'c1',
    estado: 'pending',
    monto: 200,
    adelanto: 0,
    saldoPendiente: 200,
    origen: 'manual',
  },
  {
    id: 'r4',
    hora: '17:00',
    horaFin: '18:00',
    clienteNombre: 'Pedro López',
    clienteTelefono: '996543210',
    canchaNombre: 'Cancha 3 - F7',
    canchaId: 'c3',
    estado: 'confirmed',
    monto: 150,
    adelanto: 150,
    saldoPendiente: 0,
    origen: 'manual',
  },
  {
    id: 'r5',
    hora: '18:00',
    horaFin: '19:00',
    clienteNombre: 'Lucía Fernández',
    clienteTelefono: '995432109',
    canchaNombre: 'Cancha 2 - F5',
    canchaId: 'c2',
    estado: 'confirmed',
    monto: 120,
    adelanto: 120,
    saldoPendiente: 0,
    origen: 'app',
  },
]

// ===========================================
// PRODUCTOS STOCK BAJO
// ===========================================
export const mockProductosStockBajo: ProductoStockBajo[] = [
  {
    id: 'p1',
    nombre: 'Cerveza',
    categoria: 'bebida',
    stockActual: 3,
    stockMinimo: 10,
  },
  {
    id: 'p2',
    nombre: 'Agua mineral',
    categoria: 'bebida',
    stockActual: 5,
    stockMinimo: 15,
  },
]

// ===========================================
// PROMOCIONES ACTIVAS
// ===========================================
export const mockPromocionesActivas: PromocionActiva[] = [
  {
    id: 'promo1',
    nombre: 'Martes de mañana',
    tipo: 'descuento_porcentual',
    diasRestantes: 3,
    usosHoy: 0,
  },
  {
    id: 'promo2',
    nombre: 'Noche de fútbol',
    tipo: 'precio_fijo',
    diasRestantes: 7,
    usosHoy: 2,
  },
  {
    id: 'promo3',
    nombre: 'Combo cancha + bebidas',
    tipo: 'combo_productos',
    diasRestantes: 12,
    usosHoy: 1,
  },
]

// ===========================================
// ALERTAS
// ===========================================
export const mockAlertas: Alerta[] = [
  {
    id: 'a1',
    tipo: 'stock',
    titulo: 'Cerveza - Stock crítico',
    descripcion: 'Solo quedan 3 unidades (mínimo: 10)',
    prioridad: 'alta',
    accion: 'Ver inventario',
    link: '/dashboard/inventario',
    datos: { productoId: 'p1' },
  },
  {
    id: 'a2',
    tipo: 'stock',
    titulo: 'Agua mineral - Stock bajo',
    descripcion: 'Quedan 5 unidades (mínimo: 15)',
    prioridad: 'media',
    accion: 'Ver inventario',
    link: '/dashboard/inventario',
    datos: { productoId: 'p2' },
  },
  {
    id: 'a3',
    tipo: 'promocion',
    titulo: 'Promoción por vencer',
    descripcion: '"Martes de mañana" termina en 3 días',
    prioridad: 'media',
    accion: 'Ver promociones',
    link: '/dashboard/promociones',
    datos: { promocionId: 'promo1' },
  },
  {
    id: 'a4',
    tipo: 'saldo',
    titulo: 'Saldo pendiente por cobrar',
    descripcion: '5 reservas con S/340 pendiente para hoy',
    prioridad: 'media',
    accion: 'Ver reservas',
    link: '/dashboard/reservas',
  },
  {
    id: 'a5',
    tipo: 'reserva',
    titulo: 'Reservas sin confirmar',
    descripcion: '2 reservas pendientes de confirmación',
    prioridad: 'baja',
    accion: 'Ver reservas',
    link: '/dashboard/reservas',
  },
]

// ===========================================
// CANCHAS ESTADO
// ===========================================
export interface CanchaEstado {
  id: string
  nombre: string
  estado: 'libre' | 'ocupada' | 'proxima' | 'en_curso'
  clienteActual?: {
    nombre: string
    telefono?: string
  }
  horarioActual?: {
    inicio: string
    fin: string
  }
  proximaReserva?: {
    clienteNombre: string
    horaInicio: string
  }
  precioHora: number
  color: string
}

export const mockCanchasEstado: CanchaEstado[] = [
  {
    id: 'c1',
    nombre: 'Cancha 1',
    estado: 'ocupada',
    clienteActual: { nombre: 'Carlos Mendoza', telefono: '999888777' },
    horarioActual: { inicio: '14:00', fin: '16:00' },
    precioHora: 100,
    color: '#22c55e',
  },
  {
    id: 'c2',
    nombre: 'Cancha 2',
    estado: 'libre',
    precioHora: 100,
    color: '#3b82f6',
  },
  {
    id: 'c3',
    nombre: 'Cancha 3',
    estado: 'en_curso',
    clienteActual: { nombre: 'Miguel Torres' },
    horarioActual: { inicio: '13:00', fin: '14:30' },
    precioHora: 120,
    color: '#f59e0b',
  },
  {
    id: 'c4',
    nombre: 'Cancha 4',
    estado: 'proxima',
    proximaReserva: { clienteNombre: 'Pedro López', horaInicio: '16:00' },
    precioHora: 120,
    color: '#8b5cf6',
  },
]
