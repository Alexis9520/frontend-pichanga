'use client'

import * as React from 'react'
import { Plus, Search, Package } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Producto, CategoriaProducto, InventarioFilters } from '../types'
import { ProductoCard } from './ProductoCard'

const CATEGORIAS: { id: CategoriaProducto | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Todos', icon: '📦' },
  { id: 'bebida', label: 'Bebidas', icon: '🍺' },
  { id: 'snack', label: 'Snacks', icon: '🍿' },
  { id: 'deportivo', label: 'Deportivo', icon: '⚽' },
  { id: 'alquiler', label: 'Alquiler', icon: '📋' },
  { id: 'servicio', label: 'Servicios', icon: '🛠️' },
]

interface ProductosTabProps {
  productos: Producto[]
  filters: InventarioFilters
  onFiltersChange: (filters: Partial<InventarioFilters>) => void
  onNewProduct: () => void
  onEditProduct: (producto: Producto) => void
  onToggleActivo: (producto: Producto) => void
  onAjustarStock: (producto: Producto) => void
  onVerMovimientos: (producto: Producto) => void
}

export function ProductosTab({
  productos,
  filters,
  onFiltersChange,
  onNewProduct,
  onEditProduct,
  onToggleActivo,
  onAjustarStock,
  onVerMovimientos,
}: ProductosTabProps) {
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Búsqueda */}
          <div className="max-w-sm flex-1">
            <Input
              placeholder="Buscar producto..."
              leftIcon={<Search className="h-4 w-4" />}
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
            />
          </div>

          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-1">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFiltersChange({ categoria: cat.id })}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                  filters.categoria === cat.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grid de productos */}
      {productos.length === 0 ? (
        <div className="border-border rounded-xl border-2 border-dashed p-12 text-center">
          <Package className="text-muted-foreground mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">No hay productos</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {filters.search || filters.categoria !== 'all'
              ? 'No se encontraron productos con los filtros seleccionados'
              : 'Agrega tu primer producto al catálogo'}
          </p>
          <Button className="mt-4" onClick={onNewProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              onEdit={() => onEditProduct(producto)}
              onToggleActivo={() => onToggleActivo(producto)}
              onAjustarStock={() => onAjustarStock(producto)}
              onVerMovimientos={() => onVerMovimientos(producto)}
            />
          ))}

          {/* Card para nuevo producto */}
          <button
            onClick={onNewProduct}
            className="group border-border hover:border-primary hover:bg-primary/5 flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all"
          >
            <div className="bg-muted group-hover:bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full transition-colors">
              <Plus className="text-muted-foreground group-hover:text-primary h-6 w-6 transition-colors" />
            </div>
            <p className="mt-4 font-medium">Nuevo producto</p>
            <p className="text-muted-foreground mt-1 text-sm">Agregar al catálogo</p>
          </button>
        </div>
      )}
    </div>
  )
}
