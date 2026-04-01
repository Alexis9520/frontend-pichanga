'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type {
  Producto,
  ProductoFormData,
  Venta,
  VentaFormData,
  MovimientoInventario,
  AjusteStockFormData,
  InventarioStats,
  InventarioFilters,
  VentasFilters,
  UseInventarioReturn,
  CategoriaProducto,
} from '../types'
import { mockProductos, mockVentas, mockMovimientos, mockInventarioStats } from '../mock-data'

const defaultFilters: InventarioFilters = {
  search: '',
  categoria: 'all',
  estado: 'all',
  stockStatus: 'all',
}

const defaultVentasFilters: VentasFilters = {
  fechaDesde: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  fechaHasta: new Date().toISOString().split('T')[0],
  metodoPago: 'all',
}

export function useInventario(): UseInventarioReturn {
  // Estado
  const [productos, setProductos] = useState<Producto[]>(mockProductos)
  const [ventas, setVentas] = useState<Venta[]>(mockVentas)
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>(mockMovimientos)
  const [filters, setFiltersState] = useState<InventarioFilters>(defaultFilters)
  const [ventasFilters, setVentasFiltersState] = useState<VentasFilters>(defaultVentasFilters)
  const [loading, setLoading] = useState(false)

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      // Búsqueda por nombre
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!p.nombre.toLowerCase().includes(searchLower)) return false
      }

      // Filtro por categoría
      if (filters.categoria !== 'all' && p.categoria !== filters.categoria) return false

      // Filtro por estado
      if (filters.estado === 'activo' && !p.activo) return false
      if (filters.estado === 'inactivo' && p.activo) return false

      // Filtro por stock
      if (filters.stockStatus === 'bajo') {
        if (!p.controlStock || !p.stockActual || !p.stockMinimo) return false
        if (p.stockActual >= p.stockMinimo) return false
      }
      if (filters.stockStatus === 'normal') {
        if (!p.controlStock) return false
        if (p.stockActual && p.stockMinimo && p.stockActual < p.stockMinimo) return false
      }

      return true
    })
  }, [productos, filters])

  // Filtrar ventas
  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      // Filtro por fecha
      if (ventasFilters.fechaDesde && v.fecha < ventasFilters.fechaDesde) return false
      if (ventasFilters.fechaHasta && v.fecha > ventasFilters.fechaHasta) return false

      // Filtro por método de pago
      if (ventasFilters.metodoPago !== 'all' && v.metodoPago !== ventasFilters.metodoPago)
        return false

      return true
    })
  }, [ventas, ventasFilters])

  // Calcular estadísticas
  const stats = useMemo((): InventarioStats => {
    const productosActivos = productos.filter((p) => p.activo)
    const stockBajo = productos.filter(
      (p) =>
        p.activo &&
        p.controlStock &&
        p.stockActual &&
        p.stockMinimo &&
        p.stockActual < p.stockMinimo
    ).length

    const hoy = new Date().toISOString().split('T')[0]
    const ventasHoy = ventas.filter((v) => v.fecha === hoy)
    const semanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const ventasSemana = ventas.filter((v) => v.fecha >= semanaAtras)

    // Calcular margen promedio
    const productosConMargen = productos.filter((p) => p.costo && p.costo > 0)
    const margenPromedio =
      productosConMargen.length > 0
        ? productosConMargen.reduce(
            (acc, p) => acc + ((p.precio - (p.costo || 0)) / p.precio) * 100,
            0
          ) / productosConMargen.length
        : 0

    return {
      totalProductos: productos.length,
      productosActivos: productosActivos.length,
      stockBajo,
      ventasHoy: ventasHoy.length,
      ventasSemana: ventasSemana.length,
      ingresosHoy: ventasHoy.reduce((acc, v) => acc + v.total, 0),
      ingresosSemana: ventasSemana.reduce((acc, v) => acc + v.total, 0),
      margenPromedio: Math.round(margenPromedio),
    }
  }, [productos, ventas])

  // CRUD - Crear producto
  const crearProducto = useCallback(async (data: ProductoFormData): Promise<Producto> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    const nuevoProducto: Producto = {
      id: `p-${Date.now()}`,
      ...data,
      activo: true,
      totalVendidos: 0,
      ingresosGenerados: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setProductos((prev) => [...prev, nuevoProducto])
    setLoading(false)
    toast.success('Producto creado exitosamente')

    return nuevoProducto
  }, [])

  // CRUD - Actualizar producto
  const actualizarProducto = useCallback(
    async (id: string, data: Partial<ProductoFormData>): Promise<Producto> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 400))

      let actualizado: Producto | undefined

      setProductos((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            actualizado = { ...p, ...data, updatedAt: new Date().toISOString() }
            return actualizado
          }
          return p
        })
      )

      setLoading(false)
      toast.success('Producto actualizado')

      return actualizado!
    },
    []
  )

  // CRUD - Eliminar producto
  const eliminarProducto = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 400))

    setProductos((prev) => prev.filter((p) => p.id !== id))
    setLoading(false)
    toast.success('Producto eliminado')
  }, [])

  // Toggle activo
  const toggleProductoActivo = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    setProductos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, activo: !p.activo, updatedAt: new Date().toISOString() }
        }
        return p
      })
    )

    setLoading(false)
    toast.success('Estado actualizado')
  }, [])

  // Ajustar stock
  const ajustarStock = useCallback(
    async (productoId: string, data: AjusteStockFormData): Promise<void> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 400))

      const producto = productos.find((p) => p.id === productoId)
      if (!producto || !producto.controlStock) {
        setLoading(false)
        toast.error('Este producto no tiene control de stock')
        return
      }

      const stockAnterior = producto.stockActual || 0
      let stockNuevo: number

      if (data.tipo === 'entrada') {
        stockNuevo = stockAnterior + data.cantidad
      } else if (data.tipo === 'salida' || data.tipo === 'ajuste') {
        stockNuevo = Math.max(0, stockAnterior - data.cantidad)
      } else {
        stockNuevo = stockAnterior
      }

      // Crear movimiento
      const movimiento: MovimientoInventario = {
        id: `m-${Date.now()}`,
        productoId,
        productoNombre: producto.nombre,
        tipo: data.tipo,
        cantidad: data.cantidad,
        stockAnterior,
        stockNuevo,
        observaciones: data.observaciones,
        usuarioId: 'u1',
        usuarioNombre: 'Admin',
        createdAt: new Date().toISOString(),
      }

      // Actualizar producto y agregar movimiento
      setProductos((prev) =>
        prev.map((p) => {
          if (p.id === productoId) {
            return { ...p, stockActual: stockNuevo, updatedAt: new Date().toISOString() }
          }
          return p
        })
      )

      setMovimientos((prev) => [movimiento, ...prev])

      setLoading(false)
      toast.success('Stock actualizado')
    },
    [productos]
  )

  // Crear venta
  const crearVenta = useCallback(
    async (data: VentaFormData): Promise<Venta> => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 600))

      // Construir productos de la venta
      const productosVenta = data.productos.map((item) => {
        const producto = productos.find((p) => p.id === item.productoId)
        return {
          productoId: item.productoId,
          productoNombre: producto?.nombre || 'Producto',
          categoria: producto?.categoria || 'bebida',
          cantidad: item.cantidad,
          precioUnitario: producto?.precio || 0,
          costoUnitario: producto?.costo,
          subtotal: (producto?.precio || 0) * item.cantidad,
        }
      })

      const total = productosVenta.reduce((acc, p) => acc + p.subtotal, 0)

      const nuevaVenta: Venta = {
        id: `v-${Date.now()}`,
        productos: productosVenta,
        clienteNombre: data.clienteNombre,
        clienteTelefono: data.clienteTelefono,
        reservaId: data.reservaId,
        total,
        metodoPago: data.metodoPago,
        fecha: new Date().toISOString().split('T')[0],
        vendedorId: 'u1',
        vendedorNombre: 'Admin',
        createdAt: new Date().toISOString(),
      }

      // Actualizar stock de productos
      data.productos.forEach((item) => {
        const producto = productos.find((p) => p.id === item.productoId)
        if (producto?.controlStock && producto.stockActual) {
          // Crear movimiento de venta
          const movimiento: MovimientoInventario = {
            id: `m-${Date.now()}-${item.productoId}`,
            productoId: item.productoId,
            productoNombre: producto.nombre,
            tipo: 'venta',
            cantidad: item.cantidad,
            stockAnterior: producto.stockActual,
            stockNuevo: producto.stockActual - item.cantidad,
            usuarioId: 'u1',
            usuarioNombre: 'Admin',
            createdAt: new Date().toISOString(),
          }
          setMovimientos((prev) => [movimiento, ...prev])

          // Actualizar stock del producto
          setProductos((prev) =>
            prev.map((p) => {
              if (p.id === item.productoId && p.stockActual) {
                return {
                  ...p,
                  stockActual: p.stockActual - item.cantidad,
                  totalVendidos: p.totalVendidos + item.cantidad,
                  ingresosGenerados: p.ingresosGenerados + item.cantidad * (p.precio || 0),
                  updatedAt: new Date().toISOString(),
                }
              }
              return p
            })
          )
        }
      })

      setVentas((prev) => [nuevaVenta, ...prev])
      setLoading(false)
      toast.success('Venta registrada')

      return nuevaVenta
    },
    [productos]
  )

  // Helpers
  const getProductosByCategoria = useCallback(
    (categoria: CategoriaProducto): Producto[] =>
      productos.filter((p) => p.categoria === categoria),
    [productos]
  )

  const getProductosActivos = useCallback(
    (): Producto[] => productos.filter((p) => p.activo),
    [productos]
  )

  const getProductoById = useCallback(
    (id: string) => productos.find((p) => p.id === id),
    [productos]
  )

  const getMovimientosByProducto = useCallback(
    (productoId: string) => movimientos.filter((m) => m.productoId === productoId),
    [movimientos]
  )

  const calcularMargen = useCallback((producto: Producto): number => {
    if (!producto.costo || producto.costo === 0) return 0
    return ((producto.precio - producto.costo) / producto.precio) * 100
  }, [])

  const setFilters = useCallback((newFilters: Partial<InventarioFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const setVentasFilters = useCallback((newFilters: Partial<VentasFilters>) => {
    setVentasFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  return {
    productos,
    productosFiltrados,
    filters,
    loading,
    stats,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    toggleProductoActivo,
    ajustarStock,
    movimientos,
    getMovimientosByProducto,
    ventas,
    ventasFiltradas,
    ventasFilters,
    crearVenta,
    setVentasFilters,
    getProductosByCategoria,
    getProductosActivos,
    getProductoById,
    calcularMargen,
    setFilters,
  }
}
