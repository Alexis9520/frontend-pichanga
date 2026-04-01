'use client'

import * as React from 'react'
import {
  Beer,
  Cookie,
  CircleDot,
  ClipboardList,
  Wrench,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, Badge } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { CategoriaProducto, Producto } from '../types'

interface CategoriaData {
  id: CategoriaProducto
  label: string
  icon: React.ElementType
  gradient: string
  bgClass: string
  iconBg: string
}

const CATEGORIAS_DATA: CategoriaData[] = [
  {
    id: 'bebida',
    label: 'Bebidas',
    icon: Beer,
    gradient: 'from-blue-500 to-blue-600',
    bgClass: 'bg-blue-500/10',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    id: 'snack',
    label: 'Snacks',
    icon: Cookie,
    gradient: 'from-amber-500 to-amber-600',
    bgClass: 'bg-amber-500/10',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
  },
  {
    id: 'deportivo',
    label: 'Deportivo',
    icon: CircleDot,
    gradient: 'from-green-500 to-green-600',
    bgClass: 'bg-green-500/10',
    iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
  },
  {
    id: 'alquiler',
    label: 'Alquiler',
    icon: ClipboardList,
    gradient: 'from-purple-500 to-purple-600',
    bgClass: 'bg-purple-500/10',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
  },
  {
    id: 'servicio',
    label: 'Servicios',
    icon: Wrench,
    gradient: 'from-cyan-500 to-cyan-600',
    bgClass: 'bg-cyan-500/10',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
  },
]

interface CategoriasGridProps {
  productos: Producto[]
  selectedCategoria: CategoriaProducto | 'all'
  onSelectCategoria: (categoria: CategoriaProducto | 'all') => void
}

export function CategoriasGrid({
  productos,
  selectedCategoria,
  onSelectCategoria,
}: CategoriasGridProps) {
  // Calcular stats por categoría
  const statsByCategoria = React.useMemo(() => {
    const stats: Record<string, { count: number; stockBajo: number; ingresos: number }> = {
      bebida: { count: 0, stockBajo: 0, ingresos: 0 },
      snack: { count: 0, stockBajo: 0, ingresos: 0 },
      deportivo: { count: 0, stockBajo: 0, ingresos: 0 },
      alquiler: { count: 0, stockBajo: 0, ingresos: 0 },
      servicio: { count: 0, stockBajo: 0, ingresos: 0 },
    }

    productos.forEach((p) => {
      if (!p.activo) return
      stats[p.categoria].count++
      stats[p.categoria].ingresos += p.ingresosGenerados

      // Stock bajo
      if (
        p.controlStock &&
        p.stockActual !== undefined &&
        p.stockMinimo !== undefined &&
        p.stockActual < p.stockMinimo
      ) {
        stats[p.categoria].stockBajo++
      }
    })

    return stats
  }, [productos])

  // Total de productos activos
  const totalActivos = productos.filter((p) => p.activo).length

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {/* Card "Todos" */}
      <button
        onClick={() => onSelectCategoria('all')}
        className={cn(
          'rounded-xl border-2 p-4 text-left transition-all',
          selectedCategoria === 'all'
            ? 'border-primary bg-primary/5 shadow-primary/10 shadow-lg'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              selectedCategoria === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            <span className="text-sm font-bold">{totalActivos}</span>
          </div>
          {selectedCategoria === 'all' && <div className="bg-primary h-2 w-2 rounded-full" />}
        </div>
        <p className="mt-2 text-sm font-semibold">Todos</p>
        <p className="text-muted-foreground text-xs">productos</p>
      </button>

      {/* Cards por categoría */}
      {CATEGORIAS_DATA.map((cat) => {
        const stats = statsByCategoria[cat.id]
        const isSelected = selectedCategoria === cat.id
        const Icon = cat.icon

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategoria(cat.id)}
            className={cn(
              'rounded-xl border-2 p-4 text-left transition-all',
              isSelected
                ? cn('border-primary/50 shadow-lg', cat.bgClass)
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            )}
          >
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  isSelected ? cat.iconBg : 'bg-muted'
                )}
              >
                <Icon
                  className={cn('h-5 w-5', isSelected ? 'text-white' : 'text-muted-foreground')}
                />
              </div>
              {stats.stockBajo > 0 && (
                <Badge variant="destructive" size="sm">
                  {stats.stockBajo}
                </Badge>
              )}
            </div>

            <p
              className={cn(
                'mt-2 text-sm font-semibold',
                isSelected && cat.gradient.replace('from-', 'text-').split(' ')[0]
              )}
            >
              {cat.label}
            </p>

            <div className="text-muted-foreground mt-1 space-y-0.5 text-xs">
              <p>{stats.count} productos</p>
              <p className="text-foreground font-medium">{formatCurrency(stats.ingresos)}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
