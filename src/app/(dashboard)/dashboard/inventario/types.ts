// ===========================================
// TIPOS ESPECÍFICOS PARA INVENTARIO
// ===========================================

// Categoría de producto
export type CategoriaProducto = 'bebida' | 'snack' | 'deportivo' | 'alquiler' | 'servicio'

// Tipo de movimiento de inventario
export type TipoMovimiento = 'entrada' | 'salida' | 'venta' | 'ajuste'

// Método de pago
export type MetodoPago = 'efectivo' | 'tarjeta' | 'yape' | 'plin'

// ===========================================
// PRODUCTO
// ===========================================
export interface Producto {
  id: string
  nombre: string
  descripcion?: string
  categoria: CategoriaProducto
  precio: number
  costo?: number
  controlStock: boolean
  stockActual?: number
  stockMinimo?: number
  imagenUrl?: string
  activo: boolean
  // Stats calculados
  totalVendidos: number
  ingresosGenerados: number
  // Auditoría
  createdAt: string
  updatedAt: string
}

// ===========================================
// FORMULARIO DE PRODUCTO
// ===========================================
export interface ProductoFormData {
  nombre: string
  descripcion?: string
  categoria: CategoriaProducto
  precio: number
  costo?: number
  controlStock: boolean
  stockActual?: number
  stockMinimo?: number
}

// ===========================================
// MOVIMIENTO DE INVENTARIO
// ===========================================
export interface MovimientoInventario {
  id: string
  productoId: string
  productoNombre: string
  tipo: TipoMovimiento
  cantidad: number
  stockAnterior: number
  stockNuevo: number
  observaciones?: string
  usuarioId: string
  usuarioNombre: string
  createdAt: string
}

// ===========================================
// PRODUCTO EN VENTA
// ===========================================
export interface ProductoVenta {
  productoId: string
  productoNombre: string
  categoria: CategoriaProducto
  cantidad: number
  precioUnitario: number
  costoUnitario?: number
  subtotal: number
}

// ===========================================
// VENTA
// ===========================================
export interface Venta {
  id: string
  productos: ProductoVenta[]
  clienteNombre?: string
  clienteTelefono?: string
  reservaId?: string
  reservaInfo?: string
  total: number
  metodoPago: MetodoPago
  fecha: string
  vendedorId: string
  vendedorNombre: string
  createdAt: string
}

// ===========================================
// FORMULARIO DE VENTA
// ===========================================
export interface VentaFormData {
  productos: { productoId: string; cantidad: number }[]
  clienteNombre?: string
  clienteTelefono?: string
  reservaId?: string
  metodoPago: MetodoPago
}

// ===========================================
// FORMULARIO DE AJUSTE DE STOCK
// ===========================================
export interface AjusteStockFormData {
  tipo: 'entrada' | 'salida' | 'ajuste'
  cantidad: number
  observaciones?: string
}

// ===========================================
// ESTADÍSTICAS
// ===========================================
export interface InventarioStats {
  totalProductos: number
  productosActivos: number
  stockBajo: number
  ventasHoy: number
  ventasSemana: number
  ingresosHoy: number
  ingresosSemana: number
  margenPromedio: number
}

// ===========================================
// FILTROS
// ===========================================
export interface InventarioFilters {
  search: string
  categoria: CategoriaProducto | 'all'
  estado: 'activo' | 'inactivo' | 'all'
  stockStatus: 'bajo' | 'normal' | 'all'
}

export interface VentasFilters {
  fechaDesde: string
  fechaHasta: string
  metodoPago: MetodoPago | 'all'
}

// ===========================================
// RESPUESTA DEL HOOK
// ===========================================
export interface UseInventarioReturn {
  // Productos
  productos: Producto[]
  productosFiltrados: Producto[]
  filters: InventarioFilters
  loading: boolean
  stats: InventarioStats

  // CRUD Productos
  crearProducto: (data: ProductoFormData) => Promise<Producto>
  actualizarProducto: (id: string, data: Partial<ProductoFormData>) => Promise<Producto>
  eliminarProducto: (id: string) => Promise<void>
  toggleProductoActivo: (id: string) => Promise<void>

  // Stock
  ajustarStock: (productoId: string, data: AjusteStockFormData) => Promise<void>
  movimientos: MovimientoInventario[]
  getMovimientosByProducto: (productoId: string) => MovimientoInventario[]

  // Ventas
  ventas: Venta[]
  ventasFiltradas: Venta[]
  ventasFilters: VentasFilters
  crearVenta: (data: VentaFormData) => Promise<Venta>
  setVentasFilters: (filters: Partial<VentasFilters>) => void

  // Helpers
  getProductosByCategoria: (categoria: CategoriaProducto) => Producto[]
  getProductosActivos: () => Producto[]
  getProductoById: (id: string) => Producto | undefined
  calcularMargen: (producto: Producto) => number
  setFilters: (filters: Partial<InventarioFilters>) => void
}

// ===========================================
// CONSTANTES
// ===========================================
export const CATEGORIAS_CONFIG: Record<
  CategoriaProducto,
  {
    label: string
    icon: string
    color: string
    controlStockDefault: boolean
  }
> = {
  bebida: {
    label: 'Bebidas',
    icon: '🍺',
    color: 'bg-blue-500/20 text-blue-500',
    controlStockDefault: true,
  },
  snack: {
    label: 'Snacks',
    icon: '🍿',
    color: 'bg-amber-500/20 text-amber-500',
    controlStockDefault: true,
  },
  deportivo: {
    label: 'Artículos Deportivos',
    icon: '⚽',
    color: 'bg-green-500/20 text-green-500',
    controlStockDefault: true,
  },
  alquiler: {
    label: 'Alquiler',
    icon: '📋',
    color: 'bg-purple-500/20 text-purple-500',
    controlStockDefault: false,
  },
  servicio: {
    label: 'Servicios',
    icon: '🛠️',
    color: 'bg-cyan-500/20 text-cyan-500',
    controlStockDefault: false,
  },
}

export const METODOS_PAGO_CONFIG: Record<
  MetodoPago,
  {
    label: string
    icon: string
  }
> = {
  efectivo: { label: 'Efectivo', icon: '💵' },
  tarjeta: { label: 'Tarjeta', icon: '💳' },
  yape: { label: 'Yape', icon: '📱' },
  plin: { label: 'Plin', icon: '📱' },
}

export const TIPO_MOVIMIENTO_CONFIG: Record<
  TipoMovimiento,
  {
    label: string
    icon: string
    color: string
  }
> = {
  entrada: { label: 'Entrada', icon: '⬆️', color: 'text-success' },
  salida: { label: 'Salida', icon: '⬇️', color: 'text-destructive' },
  venta: { label: 'Venta', icon: '🛒', color: 'text-primary' },
  ajuste: { label: 'Ajuste', icon: '🔄', color: 'text-warning' },
}
