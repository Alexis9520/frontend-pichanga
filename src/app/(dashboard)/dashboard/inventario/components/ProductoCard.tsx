'use client'

import * as React from 'react'
import {
  Edit,
  Package,
  TrendingUp,
  AlertTriangle,
  History,
  Power,
  MoreVertical,
  Beer,
  Cookie,
  CircleDot,
  ClipboardList,
  Wrench,
} from 'lucide-react'
import { Badge, Button, Switch } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { Producto, CategoriaProducto } from '../types'

// Configuración de categorías con iconos Lucide
const CATEGORIAS_CONFIG: Record<
  CategoriaProducto,
  { label: string; icon: React.ElementType; gradient: string; bgClass: string }
> = {
  bebida: {
    label: 'Bebidas',
    icon: Beer,
    gradient: 'from-blue-500 to-blue-600',
    bgClass: 'bg-blue-500/10',
  },
  snack: {
    label: 'Snacks',
    icon: Cookie,
    gradient: 'from-amber-500 to-amber-600',
    bgClass: 'bg-amber-500/10',
  },
  deportivo: {
    label: 'Deportivo',
    icon: CircleDot,
    gradient: 'from-green-500 to-green-600',
    bgClass: 'bg-green-500/10',
  },
  alquiler: {
    label: 'Alquiler',
    icon: ClipboardList,
    gradient: 'from-purple-500 to-purple-600',
    bgClass: 'bg-purple-500/10',
  },
  servicio: {
    label: 'Servicios',
    icon: Wrench,
    gradient: 'from-cyan-500 to-cyan-600',
    bgClass: 'bg-cyan-500/10',
  },
}

interface ProductoCardProps {
  producto: Producto
  onEdit: () => void
  onToggleActivo: () => void
  onAjustarStock: () => void
  onVerMovimientos: () => void
}

export function ProductoCard({
  producto,
  onEdit,
  onToggleActivo,
  onAjustarStock,
  onVerMovimientos,
}: ProductoCardProps) {
  const [showMenu, setShowMenu] = React.useState(false)

  const categoria = CATEGORIAS_CONFIG[producto.categoria]
  const CategoriaIcon = categoria.icon

  // Determinar estado de stock
  const getStockStatus = () => {
    if (!producto.controlStock || producto.stockActual === undefined) {
      return { status: 'no-control', label: 'Sin control', color: 'muted' }
    }

    const stockActual = producto.stockActual
    const stockMinimo = producto.stockMinimo || 1

    if (stockActual <= 0) {
      return { status: 'agotado', label: 'Agotado', color: 'red' }
    }
    if (stockActual <= stockMinimo * 0.5) {
      return { status: 'critico', label: 'Crítico', color: 'red' }
    }
    if (stockActual < stockMinimo) {
      return { status: 'bajo', label: 'Bajo', color: 'amber' }
    }
    if (stockActual < stockMinimo * 1.5) {
      return { status: 'normal', label: 'Normal', color: 'green' }
    }
    return { status: 'ok', label: 'OK', color: 'green' }
  }

  const stockStatus = getStockStatus()
  const isLowStock =
    stockStatus.status === 'critico' ||
    stockStatus.status === 'bajo' ||
    stockStatus.status === 'agotado'
  const isCriticalStock = stockStatus.status === 'critico' || stockStatus.status === 'agotado'

  // Calcular porcentaje para la barra
  const stockPercentage = React.useMemo(() => {
    if (!producto.controlStock || producto.stockActual === undefined) return 100
    const stockMinimo = producto.stockMinimo || 1
    const porcentaje = (producto.stockActual / (stockMinimo * 2)) * 100
    return Math.min(Math.max(porcentaje, 0), 100)
  }, [producto])

  // Calcular margen
  const margen = producto.costo
    ? ((producto.precio - producto.costo) / producto.precio) * 100
    : null

  // Color de la barra según estado
  const getBarColor = () => {
    switch (stockStatus.status) {
      case 'agotado':
      case 'critico':
        return 'bg-red-500'
      case 'bajo':
        return 'bg-amber-500'
      default:
        return 'bg-green-500'
    }
  }

  return (
    <div
      className={cn(
        'group border-border bg-card relative overflow-hidden rounded-2xl border-2 transition-all',
        'hover:shadow-lg',
        !producto.activo && 'opacity-60 grayscale-[20%]',
        isCriticalStock && 'border-red-500/50 bg-red-500/5',
        isLowStock && !isCriticalStock && 'border-amber-500/50 bg-amber-500/5'
      )}
    >
      {/* Header con gradiente */}
      <div className={cn('relative rounded-t-xl px-4 py-3', categoria.bgClass)}>
        <div className="flex items-center justify-between">
          {/* Categoría */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br',
                categoria.gradient
              )}
            >
              <CategoriaIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">{categoria.label}</span>
          </div>

          {/* Badge de stock */}
          {producto.controlStock && (
            <Badge
              variant={
                stockStatus.color === 'red'
                  ? 'destructive'
                  : stockStatus.color === 'amber'
                    ? 'warning'
                    : 'success'
              }
              size="sm"
              dot
            >
              {stockStatus.label}
            </Badge>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Nombre y toggle */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{producto.nombre}</h3>
            {producto.descripcion && (
              <p className="text-muted-foreground mt-0.5 truncate text-xs">
                {producto.descripcion}
              </p>
            )}
          </div>
          <Switch checked={producto.activo} onChange={onToggleActivo} />
        </div>

        {/* Precio */}
        <div className="mb-3">
          <span className="text-2xl font-bold">{formatCurrency(producto.precio)}</span>
          {producto.costo && producto.costo > 0 && (
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
              <span>Costo: {formatCurrency(producto.costo)}</span>
              {margen && (
                <Badge
                  variant={margen >= 30 ? 'success' : margen >= 20 ? 'warning' : 'outline'}
                  size="sm"
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {margen.toFixed(0)}%
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Stock */}
        {producto.controlStock ? (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stock actual</span>
              <span
                className={cn(
                  'font-bold',
                  stockStatus.color === 'red' && 'text-red-600',
                  stockStatus.color === 'amber' && 'text-amber-600',
                  stockStatus.color === 'green' && 'text-green-600'
                )}
              >
                {producto.stockActual} unidades
              </span>
            </div>

            {/* Barra de progreso */}
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className={cn('h-full rounded-full transition-all', getBarColor())}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>

            {producto.stockMinimo && (
              <p className="text-muted-foreground text-xs">
                Mínimo: {producto.stockMinimo} unidades
              </p>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <Badge variant="outline" size="sm">
              Sin control de stock
            </Badge>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-sm font-bold">{producto.totalVendidos}</p>
            <p className="text-muted-foreground text-[10px]">Vendidos</p>
          </div>
          <div className="rounded-lg bg-green-500/10 p-2">
            <p className="text-sm font-bold text-green-600">
              {formatCurrency(producto.ingresosGenerados)}
            </p>
            <p className="text-muted-foreground text-[10px]">Ingresos</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="border-border flex items-center gap-2 border-t pt-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Edit className="mr-1 h-3 w-3" />
            Editar
          </Button>

          <div className="relative">
            <Button variant="ghost" size="icon-sm" onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="border-border bg-popover absolute right-0 bottom-full z-50 mb-1 min-w-[160px] rounded-lg border p-1 shadow-lg">
                  {producto.controlStock && (
                    <button
                      className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                      onClick={() => {
                        setShowMenu(false)
                        onAjustarStock()
                      }}
                    >
                      <Package className="h-4 w-4" />
                      Ajustar stock
                    </button>
                  )}
                  <button
                    className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                    onClick={() => {
                      setShowMenu(false)
                      onVerMovimientos()
                    }}
                  >
                    <History className="h-4 w-4" />
                    Ver movimientos
                  </button>
                  <button
                    className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                    onClick={() => {
                      setShowMenu(false)
                      onToggleActivo()
                    }}
                  >
                    <Power className="h-4 w-4" />
                    {producto.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
