'use client'

import * as React from 'react'
import {
  ShoppingCart,
  TrendingUp,
  Package,
  DollarSign,
  Percent,
  Beer,
  Cookie,
  CircleDot,
  ClipboardList,
  Wrench,
} from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type {
  VentaExtraReporte,
  IngresoPorCategoria,
  TopProducto,
  IngresoPorMetodoPago,
} from '../types'
import { CATEGORIA_EXTRA_CONFIG, METODOS_PAGO_CONFIG } from '../types'
import { GraficoDistribucion } from './GraficoDistribucion'

interface VentasExtrasTabProps {
  ventasExtras: VentaExtraReporte[]
  ingresosPorCategoria: IngresoPorCategoria[]
  topProductos: TopProducto[]
  ingresosPorMetodoPago: IngresoPorMetodoPago[]
}

export function VentasExtrasTab({
  ventasExtras,
  ingresosPorCategoria,
  topProductos,
  ingresosPorMetodoPago,
}: VentasExtrasTabProps) {
  const [viewMode, setViewMode] = React.useState<'resumen' | 'categorias' | 'productos'>('resumen')

  // Totales
  const totalVentas = ventasExtras.length
  const totalIngresos = ventasExtras.reduce((acc, v) => acc + v.subtotal, 0)
  const totalCantidad = ventasExtras.reduce((acc, v) => acc + v.cantidad, 0)

  // Margen promedio
  const margenPromedio = React.useMemo(() => {
    const ventasConMargen = ventasExtras.filter((v) => v.costoUnitario && v.precioUnitario)
    if (ventasConMargen.length === 0) return 0
    return (
      ventasConMargen.reduce((acc, v) => {
        const margen = ((v.precioUnitario! - v.costoUnitario!) / v.precioUnitario!) * 100
        return acc + margen
      }, 0) / ventasConMargen.length
    )
  }, [ventasExtras])

  // Ventas por método (solo extras)
  const ventasPorMetodo = React.useMemo(() => {
    const grupos: Record<string, { total: number; cantidad: number }> = {}
    ventasExtras.forEach((v) => {
      if (!grupos[v.metodoPago]) grupos[v.metodoPago] = { total: 0, cantidad: 0 }
      grupos[v.metodoPago].total += v.subtotal
      grupos[v.metodoPago].cantidad += 1
    })
    return Object.entries(grupos).map(([metodo, data]) => ({
      metodo: metodo as keyof typeof METODOS_PAGO_CONFIG,
      ...data,
    }))
  }, [ventasExtras])

  return (
    <div className="space-y-6">
      {/* Resumen rápido */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/20 flex h-10 w-10 items-center justify-center rounded-lg">
              <ShoppingCart className="text-secondary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total ventas</p>
              <p className="text-2xl font-bold">{totalVentas}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg">
              <DollarSign className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Ingresos extras</p>
              <p className="text-primary text-2xl font-bold">{formatCurrency(totalIngresos)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
              <Package className="text-muted-foreground h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Productos vendidos</p>
              <p className="text-2xl font-bold">{totalCantidad}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-success/20 flex h-10 w-10 items-center justify-center rounded-lg">
              <TrendingUp className="text-success h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Margen promedio</p>
              <p className="text-success text-2xl font-bold">{margenPromedio.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs internos */}
      <div className="border-border flex gap-1 border-b">
        {[
          { id: 'resumen', label: 'Resumen' },
          { id: 'categorias', label: 'Por categoría' },
          { id: 'productos', label: 'Top productos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as typeof viewMode)}
            className={cn(
              'px-4 pt-2 pb-3 text-sm font-medium transition-all',
              viewMode === tab.id
                ? 'text-primary border-primary -mb-[1px] border-b-2'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido según tab */}
      {viewMode === 'resumen' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Por categoría */}
          <Card className="p-4">
            <h3 className="mb-4 font-semibold">Ingresos por categoría</h3>
            <div className="space-y-3">
              {ingresosPorCategoria.map((cat) => {
                const config = CATEGORIA_EXTRA_CONFIG[cat.categoria]
                return (
                  <div key={cat.categoria} className="flex items-center gap-3">
                    <Badge className={config.color}>
                      {config.icon} {config.label}
                    </Badge>
                    <div className="flex-1">
                      <div className="bg-muted h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-secondary h-full rounded-full"
                          style={{
                            width: `${(cat.ingresos / totalIngresos) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(cat.ingresos)}</p>
                      <p className="text-muted-foreground text-xs">{cat.cantidadProductos} uds</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Métodos de pago */}
          <Card className="p-4">
            <h3 className="mb-4 font-semibold">Métodos de pago</h3>
            <div className="space-y-3">
              {ventasPorMetodo.map((item) => {
                const config = METODOS_PAGO_CONFIG[item.metodo]
                return (
                  <div key={item.metodo} className="flex items-center gap-3">
                    <Badge className={config.color}>
                      {config.icon} {config.label}
                    </Badge>
                    <div className="flex-1">
                      <div className="bg-muted h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{
                            width: `${(item.total / totalIngresos) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(item.total)}</p>
                      <p className="text-muted-foreground text-xs">{item.cantidad} ventas</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {viewMode === 'categorias' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ingresosPorCategoria.map((cat) => {
            const config = CATEGORIA_EXTRA_CONFIG[cat.categoria]
            const ventasCategoria = ventasExtras.filter((v) => v.categoria === cat.categoria)

            return (
              <Card key={cat.categoria} className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Badge className={config.color} size="lg">
                    {config.icon} {config.label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Ingresos</span>
                    <span className="text-primary font-bold">{formatCurrency(cat.ingresos)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Ventas</span>
                    <span className="font-medium">{cat.totalVentas}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Unidades</span>
                    <span className="font-medium">{cat.cantidadProductos}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Margen</span>
                    <span
                      className={cn(
                        'font-medium',
                        cat.margenPromedio >= 30 ? 'text-success' : 'text-warning'
                      )}
                    >
                      {cat.margenPromedio.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Top 3 productos de esta categoría */}
                <div className="border-border mt-3 border-t pt-3">
                  <p className="text-muted-foreground mb-2 text-xs">Top productos:</p>
                  {ventasCategoria
                    .reduce((acc: { nombre: string; cantidad: number }[], v) => {
                      const existing = acc.find((a) => a.nombre === v.productoNombre)
                      if (existing) {
                        existing.cantidad += v.cantidad
                      } else {
                        acc.push({ nombre: v.productoNombre, cantidad: v.cantidad })
                      }
                      return acc
                    }, [])
                    .sort((a, b) => b.cantidad - a.cantidad)
                    .slice(0, 3)
                    .map((p, i) => (
                      <div key={p.nombre} className="flex items-center justify-between text-xs">
                        <span>
                          {i + 1}. {p.nombre}
                        </span>
                        <span className="text-muted-foreground">{p.cantidad} uds</span>
                      </div>
                    ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {viewMode === 'productos' && (
        <div className="space-y-4">
          {/* Top 10 productos */}
          <Card className="p-4">
            <h3 className="mb-4 font-semibold">Top 10 productos más vendidos</h3>
            <div className="space-y-3">
              {topProductos.map((producto, index) => {
                const config = CATEGORIA_EXTRA_CONFIG[producto.categoria]
                const maxIngresos = topProductos[0]?.ingresos || 1

                return (
                  <div key={producto.productoId} className="flex items-center gap-3">
                    <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{producto.productoNombre}</span>
                        <Badge className={config.color} size="sm">
                          {config.icon}
                        </Badge>
                      </div>
                      <div className="mt-1">
                        <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${(producto.ingresos / maxIngresos) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold">{formatCurrency(producto.ingresos)}</p>
                      <p className="text-muted-foreground text-xs">
                        {producto.cantidadVendida} vendidos
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          producto.margen >= 30 ? 'text-success' : 'text-warning'
                        )}
                      >
                        {producto.margen.toFixed(0)}%
                      </p>
                      <p className="text-muted-foreground text-xs">margen</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
