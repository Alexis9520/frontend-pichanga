'use client'

import * as React from 'react'
import { Package, ShoppingCart, Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { useInventario } from './hooks/useInventario'
import type {
  Producto,
  CategoriaProducto,
  ProductoFormData,
  VentaFormData,
  AjusteStockFormData,
} from './types'
import {
  ProductosTab,
  VentasTab,
  ProductoFormModal,
  NuevaVentaModal,
  MovimientosModal,
  AjusteStockModal,
  HeroInventario,
  CategoriasGrid,
} from './components'

// Tabs
const TABS = [
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
]

export default function InventarioPage() {
  const {
    productos,
    productosFiltrados,
    filters,
    stats,
    crearProducto,
    actualizarProducto,
    toggleProductoActivo,
    ajustarStock,
    movimientos,
    ventasFiltradas,
    ventasFilters,
    crearVenta,
    setVentasFilters,
    setFilters,
  } = useInventario()

  // Estado de tabs y modales
  const [activeTab, setActiveTab] = React.useState<'productos' | 'ventas'>('productos')
  const [showProductoModal, setShowProductoModal] = React.useState(false)
  const [showVentaModal, setShowVentaModal] = React.useState(false)
  const [showMovimientosModal, setShowMovimientosModal] = React.useState(false)
  const [showAjusteModal, setShowAjusteModal] = React.useState(false)
  const [selectedProducto, setSelectedProducto] = React.useState<Producto | null>(null)
  const [selectedCategoria, setSelectedCategoria] = React.useState<CategoriaProducto | 'all'>('all')

  // Productos con stock bajo
  const productosStockBajo = React.useMemo(() => {
    return productos.filter((p) => {
      if (!p.activo || !p.controlStock) return false
      return (
        p.stockActual !== undefined && p.stockMinimo !== undefined && p.stockActual < p.stockMinimo
      )
    })
  }, [productos])

  // Filtrar productos por categoría seleccionada
  const productosVisibles = React.useMemo(() => {
    if (selectedCategoria === 'all') return productosFiltrados
    return productosFiltrados.filter((p) => p.categoria === selectedCategoria)
  }, [productosFiltrados, selectedCategoria])

  // Handlers
  const handleNewProduct = () => {
    setSelectedProducto(null)
    setShowProductoModal(true)
  }

  const handleEditProduct = (producto: Producto) => {
    setSelectedProducto(producto)
    setShowProductoModal(true)
  }

  const handleToggleActivo = async (producto: Producto) => {
    await toggleProductoActivo(producto.id)
  }

  const handleAjustarStock = (producto: Producto) => {
    setSelectedProducto(producto)
    setShowAjusteModal(true)
  }

  const handleVerMovimientos = (producto: Producto) => {
    setSelectedProducto(producto)
    setShowMovimientosModal(true)
  }

  const handleProductoSubmit = async (data: ProductoFormData) => {
    if (selectedProducto) {
      await actualizarProducto(selectedProducto.id, data)
    } else {
      await crearProducto(data)
    }
  }

  const handleVentaSubmit = async (data: VentaFormData) => {
    await crearVenta(data)
  }

  const handleAjusteSubmit = async (data: AjusteStockFormData) => {
    if (selectedProducto) {
      await ajustarStock(selectedProducto.id, data)
    }
  }

  const handleVerStockBajo = () => {
    setFilters({ stockStatus: 'bajo' })
    setActiveTab('productos')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Inventario</h1>
          <p className="text-muted-foreground">Gestiona productos, servicios y ventas extras</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowVentaModal(true)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Nueva venta
          </Button>
          <Button onClick={handleNewProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Button>
        </div>
      </div>

      {/* Hero de inventario */}
      <HeroInventario
        ingresosHoy={stats.ingresosHoy}
        ingresosSemana={stats.ingresosSemana}
        ventasHoy={stats.ventasHoy}
        ventasSemana={stats.ventasSemana}
        comparativaAyer={12} // Mock: +12% vs ayer
        productosStockBajo={productosStockBajo}
        onVerStockBajo={handleVerStockBajo}
      />

      {/* Categorías */}
      <CategoriasGrid
        productos={productos}
        selectedCategoria={selectedCategoria}
        onSelectCategoria={setSelectedCategoria}
      />

      {/* Tabs */}
      <div className="border-border flex gap-1 border-b">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const count = tab.id === 'productos' ? productosVisibles.length : ventasFiltradas.length
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'productos' | 'ventas')}
              className={`flex items-center gap-2 px-4 pt-2 pb-3 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-primary border-primary -mb-[1px] border-b-2'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'productos' ? (
        <ProductosTab
          productos={productosVisibles}
          filters={filters}
          onFiltersChange={setFilters}
          onNewProduct={handleNewProduct}
          onEditProduct={handleEditProduct}
          onToggleActivo={handleToggleActivo}
          onAjustarStock={handleAjustarStock}
          onVerMovimientos={handleVerMovimientos}
        />
      ) : (
        <VentasTab
          ventas={ventasFiltradas}
          filters={ventasFilters}
          onFiltersChange={setVentasFilters}
          onNewVenta={() => setShowVentaModal(true)}
        />
      )}

      {/* Modales */}
      <ProductoFormModal
        open={showProductoModal}
        onOpenChange={setShowProductoModal}
        producto={selectedProducto}
        onSubmit={handleProductoSubmit}
      />

      <NuevaVentaModal
        open={showVentaModal}
        onOpenChange={setShowVentaModal}
        productos={productos.filter((p) => p.activo)}
        onSubmit={handleVentaSubmit}
      />

      <MovimientosModal
        open={showMovimientosModal}
        onOpenChange={setShowMovimientosModal}
        producto={selectedProducto}
        movimientos={movimientos}
      />

      <AjusteStockModal
        open={showAjusteModal}
        onOpenChange={setShowAjusteModal}
        producto={selectedProducto}
        onSubmit={handleAjusteSubmit}
      />
    </div>
  )
}
