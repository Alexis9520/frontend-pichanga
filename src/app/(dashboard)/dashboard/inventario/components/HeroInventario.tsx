'use client'

import * as React from 'react'
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
} from 'lucide-react'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import { cn, formatCurrency } from '@/lib/utils'
import type { Producto } from '../types'

interface HeroInventarioProps {
  ingresosHoy: number
  ingresosSemana: number
  ventasHoy: number
  ventasSemana: number
  comparativaAyer: number
  productosStockBajo: Producto[]
  onVerStockBajo: () => void
}

export function HeroInventario({
  ingresosHoy,
  ingresosSemana,
  ventasHoy,
  ventasSemana,
  comparativaAyer,
  productosStockBajo,
  onVerStockBajo,
}: HeroInventarioProps) {
  const comparativaPositiva = comparativaAyer >= 0
  const hasStockBajo = productosStockBajo.length > 0

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          {/* Stats del día */}
          <div className="from-primary/10 via-primary/5 bg-gradient-to-br to-transparent p-6">
            <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              Resumen del Día
            </p>

            {/* Ingresos destacado */}
            <div className="mt-4">
              <span className="text-4xl font-bold tracking-tight">
                {formatCurrency(ingresosHoy)}
              </span>
              <p className="text-muted-foreground text-sm">Ingresos hoy</p>
            </div>

            {/* Comparativa */}
            <div className="mt-3 flex items-center gap-2">
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium',
                  comparativaPositiva
                    ? 'bg-green-500/10 text-green-600'
                    : 'bg-red-500/10 text-red-600'
                )}
              >
                {comparativaPositiva ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(comparativaAyer)}%
              </div>
              <span className="text-muted-foreground text-sm">vs ayer</span>
            </div>

            {/* Stats rápidos */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-primary h-4 w-4" />
                  <span className="font-bold">{ventasHoy}</span>
                </div>
                <p className="text-muted-foreground text-xs">Ventas hoy</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-600">{formatCurrency(ingresosSemana)}</span>
                </div>
                <p className="text-muted-foreground text-xs">Esta semana</p>
              </div>
            </div>

            {/* Mini gráfico de métodos de pago */}
            <div className="mt-4">
              <p className="text-muted-foreground mb-2 text-xs font-medium">Ventas por método</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-xs">Efectivo</span>
                  <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                    <div className="bg-primary h-full rounded-full" style={{ width: '55%' }} />
                  </div>
                  <span className="text-xs font-medium">55%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-xs">Yape</span>
                  <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: '30%' }} />
                  </div>
                  <span className="text-xs font-medium">30%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-xs">Tarjeta</span>
                  <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: '15%' }} />
                  </div>
                  <span className="text-xs font-medium">15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas de stock bajo */}
          <div
            className={cn('p-6', hasStockBajo && 'bg-gradient-to-br from-red-500/5 to-transparent')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasStockBajo ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{hasStockBajo ? 'Stock Bajo' : 'Stock OK'}</p>
                  <p className="text-muted-foreground text-xs">
                    {hasStockBajo
                      ? `${productosStockBajo.length} producto${productosStockBajo.length > 1 ? 's' : ''} necesitan atención`
                      : 'Todos los productos con stock suficiente'}
                  </p>
                </div>
              </div>
              {hasStockBajo && (
                <Badge variant="destructive" size="sm">
                  {productosStockBajo.length}
                </Badge>
              )}
            </div>

            {hasStockBajo ? (
              <>
                {/* Productos con stock bajo */}
                <div className="mt-4 space-y-2">
                  {productosStockBajo.slice(0, 3).map((producto) => {
                    const stockActual = producto.stockActual || 0
                    const stockMinimo = producto.stockMinimo || 1
                    const porcentaje = Math.min((stockActual / stockMinimo) * 50, 100)

                    return (
                      <div
                        key={producto.id}
                        className="border-border bg-background rounded-lg border p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{producto.nombre}</span>
                          </div>
                          <span
                            className={cn(
                              'text-sm font-bold',
                              stockActual <= 3 ? 'text-red-600' : 'text-amber-600'
                            )}
                          >
                            {stockActual} uds
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                stockActual <= 3 ? 'bg-red-500' : 'bg-amber-500'
                              )}
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                          <p className="text-muted-foreground mt-1 text-xs">
                            Mínimo: {stockMinimo} unidades
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Ver todos */}
                {productosStockBajo.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={onVerStockBajo}
                  >
                    Ver todos los productos con stock bajo
                  </Button>
                )}
              </>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-600">Todo en orden</p>
                <p className="text-muted-foreground text-xs">No hay productos con stock bajo</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
